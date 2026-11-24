import "server-only";

import { ai } from "./gemini";
import { getDescriptiveBrandGuide } from "./merge-prompt/instructions/format-context";
import {
  IMAGE_FALLBACK_MODEL,
  resolveImageModel,
  resolveImageSize,
} from "./gemini/models";
import { isModelFallbackError } from "./gemini/client";
import type { DesignImageInput } from "./image-inputs";

function extractBurmeseTextGuidance(prompt: string, skipPhrases: string[]): string {
    const burmeseRegex = /[\u1000-\u109F\uAA60-\uAA7F]/;
    if (!burmeseRegex.test(prompt)) {
        return "";
    }

    const lines = prompt.split("\n");
    const burmeseLines: string[] = [];
    for (const line of lines) {
        if (burmeseRegex.test(line)) {
            const cleaned = line
                .replace(/^[\s"':,]+|[\s"':,]+$/g, "")
                .replace(/"text":\s*"/, "")
                .replace(/"headlines":\s*\{/, "")
                .trim();
            if (cleaned.length > 1 && !burmeseLines.includes(cleaned)) {
                if (skipPhrases.some((phrase) => phrase && cleaned.includes(phrase))) {
                    continue;
                }
                burmeseLines.push(cleaned);
            }
        }
    }

    const burmeseTextList = burmeseLines.slice(0, 8).map((t, idx) => `  ${idx + 1}. "${t}"`).join("\n");

    return `
══════════════════════════════════════════════════════════════════════════
🔴 STRICT BURMESE TYPOGRAPHY & SPELLING LAWS (ZERO TOLERANCE FOR ERRORS):
══════════════════════════════════════════════════════════════════════════
Exact Burmese text detected for this design:
${burmeseTextList || "  - Follow Burmese text from the Execution Plan exactly."}

CRITICAL RULES FOR RENDERING BURMESE SCRIPT:
1. CHARACTER-FOR-CHARACTER FIDELITY: You MUST copy every single Burmese character, tone mark, dot, vowel, and diacritic 100% character-by-character exactly as provided above. NEVER omit, substitute, transpose, or hallucinate characters.
2. CORRECT DIACRITIC ANATOMY (DO NOT MERGE OR MELT):
   - Upper diacritics (ိ, ီ, ဲ, ံ, ်) must sit directly centered above the primary consonant, with clean clear daylight between the diacritic and consonant.
   - Lower diacritics (ု, ူ, ့) must sit directly underneath the consonant.
   - The vowel 'ေ' MUST be placed cleanly to the immediate left of its consonant.
   - Tone mark 'း' (visarga / two vertical dots) must sit to the right of the syllable.
   - Stacked consonants (e.g. ္ + consonant) must form a crisp subscript below the consonant, never a melted blob.
3. FLAT 2D VECTOR SANS-SERIF ONLY (NO 3D / NO EMBOSS):
   - Render ALL Burmese text in clean, modern, flat 2D sans-serif typography (contemporary digital branding style).
   - STRICTLY FORBIDDEN: 3D extrusion, beveled edges, metallic embossing, heavy outline strokes, and multi-layered blurry drop shadows. These effects ruin circular Burmese letterforms.
4. HIGH-CONTRAST CONTAINER BACKING:
   - Place Burmese text on high-contrast, clean solid or semi-translucent container strips/panels (e.g., solid white text on dark emerald green, dark navy, or charcoal backing; or dark charcoal text on clean ivory backing). This guarantees the neural renderer outputs crisp letterforms.
5. HORIZONTAL BASELINE ONLY:
   - Keep all Burmese text strictly on level horizontal lines. Never curve, arc, or slant Burmese text.
══════════════════════════════════════════════════════════════════════════
`;
}

export async function generateGeminiImage(
    userPrompt: string,
    brandContext: any,
    imageInputs: DesignImageInput[],
    aspectRatio: string = "4:3",
    speed: "slow" | "normal" = "normal",
    quality: "normal" | "hd" | "2k" | "4k" = "hd",
    modelTier: "normal" | "pro" = "normal",
) {
    const normalizedPrompt = userPrompt.normalize("NFC");
    // 1. Fetch and convert images to base64 (handles both URLs and base64 data URIs)
    const imageParts = await Promise.all(
        imageInputs.slice(0, 10).map(async (item) => {
            const imageInput = item.url;
            try {
                // Check if it's already a base64 data URI
                if (imageInput.startsWith('data:image/')) {
                    // Extract base64 data and mime type from data URI
                    const [mimeType, base64Data] = imageInput.split(',');
                    const actualMimeType = mimeType.split(':')[1].split(';')[0];
                    return {
                        inlineData: {
                            data: base64Data,
                            mimeType: actualMimeType,
                        },
                    };
                } else {
                    // It's a URL, fetch it
                    const response = await fetch(imageInput);
                    const buffer = await response.arrayBuffer();
                    return {
                        inlineData: {
                            data: Buffer.from(buffer).toString("base64"),
                            mimeType: response.headers.get("content-type") || "image/jpeg",
                        },
                    };
                }
            } catch (e) {
                console.error(`Failed to process image: ${imageInput}`, e);
                return null;
            }
        })
    );

    const validImageParts = imageParts.filter(p => p !== null);

    // Build descriptive list of successfully loaded images and map indices
    let loadedImageInstructions = "";
    let logoPartIndex = -1;
    let primarySubjectIndex = -1;
    let secondarySubjectIndices: number[] = [];
    let styleReferenceIndices: number[] = [];
    let lockedPropIndices: number[] = [];
    let existingDesignIndex = -1;

    let validPartIdx = 0;
    for (let i = 0; i < imageParts.length; i++) {
        if (imageParts[i] !== null) {
            const role = imageInputs[i].role;
            const label = `Image Input #${validPartIdx + 1}`;
            
            if (role === "logo") {
                logoPartIndex = validPartIdx;
                loadedImageInstructions += `- ${label}: OFFICIAL BRAND LOGO. You must overlay/integrate this logo into the design.\n`;
            } else if (role === "primary_subject") {
                primarySubjectIndex = validPartIdx;
                loadedImageInstructions += `- ${label}: PRIMARY SUBJECT / HUMAN / CHARACTER. This is the main hero of the design. You MUST place them in the foreground, retain their key facial features, pose, and clothing silhouette exactly.\n`;
            } else if (role === "secondary_subject") {
                secondarySubjectIndices.push(validPartIdx);
                loadedImageInstructions += `- ${label}: SUPPORTING / SUB SUBJECT. This is a secondary character/product that must be integrated into the layout (usually placed smaller or behind the primary subject).\n`;
            } else if (role === "style_reference") {
                styleReferenceIndices.push(validPartIdx);
                loadedImageInstructions += `- ${label}: STYLE REFERENCE IMAGE. This is for layout, color theme, composition, and aesthetic inspiration ONLY. CRITICAL: DO NOT copy, transcribe, or use ANY text from this reference image. All text MUST come from the user prompt. Only replicate the structural layout and mood.\n`;
            } else if (role === "existing_design") {
                existingDesignIndex = validPartIdx;
                loadedImageInstructions += `- ${label}: EXISTING FINISHED DESIGN TO EDIT. This is the current poster. Reproduce it, then apply only the requested change. Do not create a new design.\n`;
            } else if (role === "locked_prop") {
                lockedPropIndices.push(validPartIdx);
                const objectName = imageInputs[i].lockedProp?.label || "locked object";
                loadedImageInstructions += `- ${label}: LOCKED OBJECT PHOTOGRAPH (${objectName}). Place this exact object in the scene as a physical prop (perspective, rotation, lighting, and a drop shadow are allowed). FORBIDDEN: redrawing it, rewriting any text on it, replacing seals or emblems with the brand logo, or adding extra lettering. Keep every glyph identical to this photograph. Put the brand logo elsewhere on the poster, never on this object.\n`;
            }
            validPartIdx++;
        }
    }

    // 2. Construct prompt with brand context
    const skipPrinted = imageInputs.flatMap((item) => item.lockedProp?.printedText ?? []);
    const burmeseGuidance = extractBurmeseTextGuidance(normalizedPrompt, skipPrinted);
    const fullPrompt = `
        User Request: ${normalizedPrompt}
        
        Brand Aesthetic Context:
        ${JSON.stringify(brandContext, null, 2)}
        
        ${getDescriptiveBrandGuide(brandContext)}

        LOADED IMAGE INPUTS & ROLES:
        ${loadedImageInstructions || "No additional images provided."}
        ${burmeseGuidance}
        CRITICAL RULES FOR IMAGE GENERATION:
        - NEVER render any literal gridlines, graph paper squares, blueprint coordinate lines, bounding box outline boxes, or wiremesh borders. The "layout_map" coordinates and "grid" rows/columns in the execution plan are purely abstract alignment guides for composition. Render them as clean, borderless zones. Be an artist: use whitespace, organic depth, contrast, and layout balance to separate sections naturally, NOT hard borders or wireframe lines. Keep the background styled per the brand context with absolutely NO graph line overlays.
        - NEVER add hashtags (#anything) to the image. Hashtags are for social media captions, not graphic designs.
        - NEVER write the literal text "Call-to-Action", "CTA", "Button Text", or "Click Here" on the design. If no specific CTA text is in the execution plan, do not render any CTA button.
        - NEVER invent phone numbers, emails, website URLs, social media handles, QR codes, or addresses that are not in the user request or execution plan.
        - NEVER use placeholder/instruction terms as visible text content.
        - Only render text that is explicitly present in the user request or execution plan JSON.
        
        TEXT RENDERING & QUALITY:
        - STRICT TEXT COPIER: You MUST copy all text characters (letters, numbers, punctuation, spelling) EXACTLY as they are written in the user request or execution plan. Never invent, alter, or drop any letters, words, or numbers.
        - Ensure all visible text is large, legible, and structurally important (Headline, Subhead, CTA).
        - DO NOT render tiny text, fine print, or small labels on UI elements, documents, or products. The AI cannot render small text clearly; it looks like gibberish.
        - Use abstract shapes, lines, or color blocks to represent small text on mock-ups.
        ${lockedPropIndices.length > 0 ? `- EXCEPTION: Keep lettering already printed on locked-object photographs sharp and readable. Do not replace it with abstract shapes, and do not redraw it.` : ""}
        
        BURMESE TYPOGRAPHY & TEXT RULES (STRICT ENFORCEMENT TO PREVENT SPELLING ERRORS):
        - NO 3D / EMBOSSED EFFECTS: NEVER render Burmese text with 3D, extruded, beveled, metallic, or thick outline styles. They cause round Burmese letters and diacritics to merge and melt into ugly, distorted blobs.
        - FLAT 2D ONLY: Render all Burmese text as clean, flat, 2D vector-style typography. Use solid high-contrast colors (e.g., flat solid white, solid black, or solid gold) with no border, or a single ultra-thin border. No heavy drop shadows.
        - DIACRITIC ALIGNMENT & ORDERING: Ensure Burmese diacritics and vowel symbols are positioned correctly relative to their main consonant and follow correct spelling sequences (e.g. consonant followed by medials, then vowels, then final diacritics). Never stack them excessively, misplace them, or overlap them. Render in a clean, modern, rounded sans-serif font style to prevent melting.
        - CONTRAST BACKING: Place text on solid, high-contrast, opaque or semi-translucent container panels/banners (e.g., dark green, dark grey, or black background for white/gold text) to guarantee legibility and keep the typography sharp and readable.
        - STRICTLY HORIZONTAL BASELINE: Render all Burmese text on a straight, level, horizontal baseline. Never curve, warp, slant, or wrap Burmese text along custom paths or shapes, as this corrupts diacritic rendering.
        - STANDARD SYSTEM SANS-SERIF: Render Burmese text ONLY in standard, clean, rounded sans-serif Unicode styles. Banned fonts: handwriting scripts, calligraphic, brush styles, or highly stylized artistic scripts.
        - GENERATE SPACED CHARACTERS: Ensure there is clear visual separation between consecutive circular Burmese letters and diacritics. Do NOT let text run together or touch.
        - VERIFY COPY SPELLING: Read the Burmese string in the execution plan character-by-character and copy it exactly, including every dot, medial, circle, and final mark (like '္', '်', 'း', '့', 'ု', 'ူ', 'ေ', 'ော').
        - NO LOGO TEXT HALLUCINATION: The AI cannot render small text beneath or inside the logo. NEVER try to draw or write out the brand name or corporate text beneath or inside the logo (e.g., do NOT write 'GSL 1OAVC ENTERPRISSS'). Keep the logo as a clean, text-less graphic symbol or abstract emblem, stripping any tiny text underneath it entirely.
        
        IMAGE INPUT ENFORCEMENT (STRICT):
        ${logoPartIndex !== -1 ? `- You MUST include the OFFICIAL BRAND LOGO (Image Input #${logoPartIndex + 1}) with 100% pixel accuracy. DO NOT redesign, redraw, stretch, or distort it. Preserve its color and shape exactly.` : ""}
        ${primarySubjectIndex !== -1 ? `- You MUST include the PRIMARY SUBJECT (Image Input #${primarySubjectIndex + 1}) in the design. Treat it as the main foreground element. Do NOT ignore it.` : ""}
        ${secondarySubjectIndices.length > 0 ? `- You MUST include the SUPPORTING / SUB SUBJECTS (Image Input(s): ${secondarySubjectIndices.map(idx => `#${idx + 1}`).join(", ")}) in the design. Integrate them as secondary layout elements.` : ""}
        ${styleReferenceIndices.length > 0 ? `- You MUST follow the structure and style of the STYLE REFERENCE images (Image Input(s): ${styleReferenceIndices.map(idx => `#${idx + 1}`).join(", ")}) closely. Replicate their layout type, lighting, and composition style. BUT DO NOT copy/paste the faces, characters, or competitor logos from these reference images.` : ""}
        ${lockedPropIndices.length > 0 ? `- You MUST composite the LOCKED OBJECT photograph(s) (Image Input(s): ${lockedPropIndices.map(idx => `#${idx + 1}`).join(", ")}) as real props in the scene. Do NOT redraw them. Do NOT generate text on them. Do NOT put the brand logo on them.` : ""}
        ${existingDesignIndex !== -1 ? `- THIS IS AN EDIT OF IMAGE INPUT #${existingDesignIndex + 1}, NOT A NEW DESIGN. Match that poster, then change only what the request names.` : ""}
        - You MUST use any provided human/character subject images. NEVER ignore them. They are the primary subject.
        - You MUST follow the structure and style of any provided reference images closely if they exist.
    `;

    // 3. Generate Content with IMAGE modality using new SDK pattern
    void modelTier;
    const selectedModel = resolveImageModel();
    const fallbackModel = IMAGE_FALLBACK_MODEL;
    const imageConfig = {
        aspectRatio: aspectRatio,
        imageSize: resolveImageSize(quality),
    };
    const generate = (model: string) =>
        ai.models.generateContent({
            model,
            contents: [
                {
                    role: "user",
                    parts: [
                        { text: fullPrompt },
                        ...validImageParts as any,
                    ],
                },
            ],
            config: {
                temperature: 0.2,
                topP: 0.9,
                topK: 30,
                serviceTier: speed === "slow" ? "flex" : "standard",
                imageConfig,
            } as any,
        });

    let result;
    try {
        result = await generate(selectedModel);
    } catch (primaryError: any) {
        let mapped = primaryError;
        if (isModelFallbackError(primaryError) && fallbackModel !== selectedModel) {
            try {
                console.warn(`Image model ${selectedModel} failed, falling back to ${fallbackModel}`);
                result = await generate(fallbackModel);
            } catch (fallbackError: any) {
                mapped = fallbackError;
            }
        }
        if (!result) {
            const rawMsg = String(mapped?.message || "");
            const lower = rawMsg.toLowerCase();
            console.error("Gemini image generation raw error:", rawMsg);

            if (lower.includes("invalid_argument") || lower.includes("invalid argument") || lower.includes("bad request")) {
                throw new Error("Image generation encountered an issue. Please try again.");
            }
            if (lower.includes("429") || lower.includes("rate limit") || lower.includes("quota") || lower.includes("503") || lower.includes("unavailable") || lower.includes("deadline") || lower.includes("timeout") || lower.includes("fetch failed")) {
                throw new Error("AI server is busy. Please try again in a moment.");
            }
            if (rawMsg.startsWith("{") || rawMsg.includes('"error"') || rawMsg.includes('"code"')) {
                throw new Error("Image generation failed. Please try again.");
            }
            throw new Error("Image generation failed. Please try again.");
        }
    }

    // 4. Extract Image Part
    const imagePart = result.candidates?.[0]?.content?.parts?.find((p: any) => p.inlineData);

    if (!imagePart || !imagePart.inlineData) {
        console.error("No image generated in Gemini response", JSON.stringify(result, null, 2));
        throw new Error("Image generation failed. Please try again.");
    }

    return Buffer.from(imagePart.inlineData.data ?? "", "base64");
}

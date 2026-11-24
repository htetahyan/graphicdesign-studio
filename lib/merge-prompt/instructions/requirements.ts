export function getRequirementsSection(
  customHeadline?: string,
  ctaText?: string,
  hasCharacterImage: boolean = false,
  hasReferenceImages: boolean = false,
  designType: "graphic_design" | "flyer" = "graphic_design",
): string {
  // Build conditional enforcement blocks based on what images are actually present
  const characterEnforcement = hasCharacterImage ? `
    ═══════════════════════════════════════════
    ⚠️ CHARACTER/SUBJECT IMAGE DETECTED — MANDATORY HERO PLACEMENT
    ═══════════════════════════════════════════
    A CHARACTER / HUMAN / SUBJECT image has been uploaded by the user.
    THIS IMAGE IS THE SINGLE MOST IMPORTANT VISUAL ELEMENT IN THE DESIGN (after the logo).

    YOU MUST DO ALL OF THE FOLLOWING IN YOUR OUTPUT JSON:
    1. Your layout_map.elements array MUST contain an element with:
       - "id": "hero_subject"
       - "role": "hero_subject"
       - A large bbox_percent (at least 30-50% of the canvas width/height)
       - A high z_index (above background, below text)
       - notes explaining to preserve the character's face, pose, and clothing exactly
    2. Your visual_elements_detailed.foreground_subject MUST describe the uploaded character/person as the main visual hero.
       - description MUST say "User-uploaded character/human subject" — NOT a generic scene description
       - treatment MUST describe professional integration (e.g., "clean cutout composited onto brand background")
    3. DO NOT replace the uploaded character with a generic illustration, icon, or stock photo description.
    4. DO NOT describe a scene where the character is absent.
    5. The character MUST be prominently visible in the foreground, not hidden or tiny.

    FAILURE TO INCLUDE THE hero_subject ELEMENT MEANS YOUR OUTPUT IS WRONG.
  ` : '';

  const referenceEnforcement = hasReferenceImages ? `
    ═══════════════════════════════════════════
    ⚠️ STYLE REFERENCE IMAGES DETECTED — MANDATORY LAYOUT MATCHING
    ═══════════════════════════════════════════
    Style reference images have been uploaded by the user.
    
    YOU MUST:
    1. Study each reference image CAREFULLY before generating your JSON.
    2. Your design_composition.layout_strategy MUST be derived from the reference images' layout.
    3. Your layout_map element positions MUST mirror the reference images' composition.
    4. DO NOT ignore the references and generate a generic layout.
    5. Describe what you observe from references in your visual_elements_detailed notes.
    6. CRITICAL: DO NOT TRANSCRIBE, COPY, OR USE ANY TEXT FOUND IN THE REFERENCE IMAGES.
    7. CRITICAL: Reference images are strictly for VISUAL layout, color, and mood inspiration. ALL text must come from the user prompt or be generated anew.
  ` : '';

  const aiPersona = designType === "flyer"
    ? `You are an expert Commercial Promotional Flyer & Poster AI for marketing, travel packages, event flyers, and retail offers.
    Your task is to generate a hyper-detailed, execution-ready JSON prompt for commercial promotional flyers for the Nano Banana image model.`
    : `You are an expert Burmese Graphic Design AI for the Myanmar market.
    Your task is to generate a hyper-detailed, execution-ready JSON prompt for the Nano Banana image model.`;

  return `
    ${aiPersona}

    ═══════════════════════════════════════════
    IMAGE INPUTS (ABSOLUTE REQUIREMENTS)
    ═══════════════════════════════════════════

    The image model will receive image_input in this order:
    1) Brand Logo image (official logo) — ALWAYS present
    2) Optional Character / Human / Main Subject image (if the user uploaded one)
    3) Optional supporting subject images (if the user uploaded more than one character image)
    4) Optional style reference images (if the user uploaded any)
    
    ⚠️ CURRENT SESSION IMAGE STATUS:
    - Character/Subject image: ${hasCharacterImage ? '✅ PROVIDED — You MUST include hero_subject in layout_map' : '❌ Not provided'}
    - Style reference images: ${hasReferenceImages ? '✅ PROVIDED — You MUST match their layout style' : '❌ Not provided'}

    YOU MUST enforce ALL of the following:
    - The final design MUST visibly include the EXCACT brand logo provided.
      - Never omit the logo.
      - Never crop the logo.
      - Never redraw, type out, or redesign the logo.
      - Keep the logo readable, correct shape, and clean edges.
      - Preserve logo colors exactly.
      - The model tends to hallucinate logos; you must explicitly instruct the generator to stamp the exact input image #1 without any aesthetic changes.
    - If a Character / Human image is provided:
      - THIS IS NON-NEGOTIABLE: You MUST include the character/human subject in the design.
      - NEVER ignore, skip, or remove a user-uploaded subject image.
      - Treat it as the PRIMARY foreground subject.
      - Preserve the person's identity, pose, clothing silhouette, and key facial features as closely as possible.
      - Integrate the subject cleanly into the brand layout (professional cutout/composite look; no messy artifacts).
      - The character image is the MOST IMPORTANT visual element after the logo.
    - If an additional supporting subject image is provided (after the primary character image):
      - THIS IS NON-NEGOTIABLE: You MUST include supporting subjects too.
      - Treat it as a SECONDARY supporting subject (not just style reference).
      - Keep identity and key features consistent.
      - Place supporting subject smaller or behind the primary subject to avoid clutter.
      - If composition is too busy, include only the primary subject.
    - If style reference images are provided, you MUST use them as PRIMARY DESIGN GUIDANCE.
      - THIS IS NON-NEGOTIABLE: NEVER ignore reference images.
      - CAREFULLY STUDY every reference image before generating your JSON.
      - Describe in your output what you observe: layout type, element positioning,
        color usage, decorative motifs, typography style, depth/dimension, and mood.
      - Your output design MUST visually resemble the reference images in structure.
      - If you ignore references, the output is WRONG. The user chose them deliberately.
      - Use them for style, layout, composition, lighting, and motif.
      - CRITICAL: DO NOT COPY, TRANSCRIBE, OR USE ANY TEXT FOUND IN REFERENCE IMAGES. All text MUST come from the user request.
      - Do NOT recreate a competitor logo/brand from references.
    - Your OUTPUT JSON MUST include a layout_map element with id "logo".
      - The logo element must have explicit bbox_percent placement inside safe area.
    ${hasCharacterImage ? '- Your OUTPUT JSON MUST include a layout_map element with id "hero_subject" and role "hero_subject".' : ''}

    ${characterEnforcement}
    ${referenceEnforcement}

    ═══════════════════════════════════════════
    USER TEXT AUTHORITY (CRITICAL)
    ═══════════════════════════════════════════
    - If the user provides specific text for a Headline or CTA (provided in the prompt context), YOU MUST USE THAT TEXT VERBATIM.
    - IGNORE any text detected from reference images or visual analysis if the user has provided a custom Headline or CTA.
    - Headline to use: ${customHeadline && customHeadline.trim() !== '' ? customHeadline : 'NONE - Evaluate prompt to generate the best headline'}
    - CTA to use: ${ctaText && ctaText.trim() !== '' ? ctaText : 'NONE - Generate relevant CTA if appropriate'}
    - User input is the ABSOLUTE authority. If a custom Headline or CTA is provided above, you MUST place it in the corresponding JSON fields exactly.

    ═══════════════════════════════════════════
    STRICT ELEMENT FIDELITY & BIAS PREVENTION
    ═══════════════════════════════════════════
    - REAL-WORLD OBJECTS (STRICTLY OPT-IN):
      DO NOT include official documents, national flags, currency, or travel papers unless the user names that object.
      - If a locked-object photograph is supplied, composite that photo. Never ask the image model to draw lettering on it.
      - DO NOT introduce catalog objects for generic industry prompts.
  `;
}

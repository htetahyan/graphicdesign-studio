import "server-only";

import { generateContentWithModelFallback, cleanAndParseJson } from "@/lib/gemini";
import { TEXT_FALLBACK_MODEL, TEXT_PRIMARY_MODEL } from "@/lib/gemini/models";

export interface CarouselSlidePlan {
  index: number;
  role: string;
  headline: string;
  content_focus: string;
  subprompt: string;
  layout_composition_type: string;
  include_character: boolean;
}

export interface CarouselPlan {
  theme: string;
  slides: CarouselSlidePlan[];
}

export async function planCarouselSeries(
  userPrompt: string,
  brandContext: any,
  slideCount: number,
  hasCharacter: boolean = false
): Promise<CarouselPlan> {
  const plannerSystemPrompt = `You are an expert social media carousel designer.
Given a user prompt describing a graphic design request and a brand aesthetic context, create a cohesive multi-slide carousel post structure.
You must design exactly ${slideCount} slides that sequentially build a narrative (e.g., Hook -> Details -> Value/Tips -> CTA).

Ensure the text for the slides (headlines, subheads, CTAs) matches the language style of the user prompt (if the user writes in Burmese, make headlines in Burmese. If they write in English, make them in English).
If the text is in Burmese:
- Ensure the Burmese spelling, diacritics, and grammar are 100% correct.
- CRITICAL: Keep headlines and visible text extremely short, punchy, and concise (MAXIMUM 5 to 7 words). Long Burmese sentences are highly prone to character melting and spelling errors by the image generator. Keeping it short ensures perfect, clear rendering.
Keep all headlines/CTAs flat, 2D, and bold.

DESIGN LAYOUT & DIVERSITY DIRECTIONS (PREVENT REPETITIVE "COPY-PASTE" LOOK):
- MANDATORY: Every slide in the carousel must use a different layout and visual structure to keep the viewer engaged. Avoid repeating the same composition across consecutive slides.
- Use the "layout_composition_type" field to assign a distinct composition style to each slide. Select from:
  * "centered-hero": Hero subject in the center, text layered above or below (best for Slide 1 / Hook).
  * "two-column-split": Clean division with text on the left, primary graphic/subject on the right (or vice versa).
  * "diagonal-flow": Elements and gradient overlays arranged diagonally, directing the reader's eye across the canvas.
  * "top-heavy-grid": Main content blocks or list elements organized in a clean top grid, with a premium footer.
  * "minimal-quote": Focus is on 1 key quote or main statement in a large elegant font, surrounded by generous whitespace and subtle abstract shapes.
  * "bottom-heavy-cta": Text and button placed dominantly in the lower half, clean header zone (best for last slide / CTA).
- Alternate background styles: Direct the generator to alternate between solid backgrounds, soft dual-tone gradients, diagonal split panels, or clean glassmorphic overlay cards across slides.
- Vary camera angles and subject distance (e.g., close-up shot of a product/feature on slide 2, medium shot of a person/character on slide 3, wide cinematic view on slide 1).

Output a JSON object ONLY with the following structure:
{
  "theme": "Brief description of the overall theme",
  "slides": [
    {
      "index": 0,
      "role": "hook",
      "headline": "Headline for slide 0",
      "content_focus": "Specific visual focus description for this slide, integrating the brand's design signatures, with details of composition, subject placement, and camera shot angle",
      "subprompt": "Specific visual details, background gradients, layout adjustments, and premium container styles (e.g. gold-bordered panels) for this slide",
      "layout_composition_type": "centered-hero", // choose from centered-hero, two-column-split, diagonal-flow, top-heavy-grid, minimal-quote, bottom-heavy-cta
      "include_character": ${hasCharacter} // boolean — if hasCharacter is true, decide if this slide should feature the character/subject (e.g., true for hook/CTA, false for text/checklist slides). If hasCharacter is false, set to false.
    },
    ...
  ]
}

Make sure there are exactly ${slideCount} slides, with indices from 0 to ${slideCount - 1}.
Do not include any other text or markdown formatting outside of the JSON block.`;

  try {
    const result = await generateContentWithModelFallback({
      primaryModel: TEXT_PRIMARY_MODEL,
      fallbackModel: TEXT_FALLBACK_MODEL,
      contents: [
        {
          role: "user",
          parts: [
            { text: `User Prompt: ${userPrompt}\n\nBrand Context:\n${JSON.stringify(brandContext, null, 2)}\n\nCharacter Subject Available: ${hasCharacter}` }
          ]
        }
      ],
      config: {
        temperature: 0.2,
        responseMimeType: "application/json",
        systemInstruction: plannerSystemPrompt,
      }
    });

    const text = result.text ?? "";
    const parsed = cleanAndParseJson(text);
    if (parsed && Array.isArray(parsed.slides) && parsed.slides.length === slideCount) {
      // Validate that all slides have include_character boolean and layout_composition_type
      parsed.slides.forEach((s: any) => {
        if (typeof s.include_character !== "boolean") {
          s.include_character = hasCharacter ? (s.index === 0 || s.index === slideCount - 1) : false;
        }
        if (typeof s.layout_composition_type !== "string") {
          s.layout_composition_type = s.index === 0 ? "centered-hero" : s.index === slideCount - 1 ? "bottom-heavy-cta" : "two-column-split";
        }
      });
      return parsed as CarouselPlan;
    }
    throw new Error("Invalid structure returned from planner");
  } catch (error) {
    console.error("Failed to plan carousel series, using fallback:", error);
    const slides: CarouselSlidePlan[] = Array.from({ length: slideCount }, (_, index) => ({
      index,
      role: index === 0 ? "hook" : index === slideCount - 1 ? "cta" : "detail",
      headline: `${userPrompt} - Slide ${index + 1}`,
      content_focus: `Visual showing content relevant to slide ${index + 1} of ${userPrompt}`,
      subprompt: `Slide ${index + 1} of ${slideCount} for: ${userPrompt}`,
      layout_composition_type: index === 0 ? "centered-hero" : index === slideCount - 1 ? "bottom-heavy-cta" : "two-column-split",
      include_character: hasCharacter ? (index === 0 || index === slideCount - 1) : false
    }));
    return {
      theme: userPrompt,
      slides
    };
  }
}

import "server-only";

import { generateContentWithModelFallback, prepareImageInput, cleanAndParseJson } from "@/lib/gemini";
import { TEXT_FALLBACK_MODEL, TEXT_PRIMARY_MODEL } from "@/lib/gemini/models";

export async function analyzeInspirationTemplate(params: {
  industryId: string;
  imageUrl: string;
}) {
  const image = await prepareImageInput(params.imageUrl);

  const prompt = `
You are an expert graphic design analyst.
Analyze the uploaded inspiration image element by element and output ONLY valid JSON.

The JSON MUST match this exact shape and level of detail:
{
  "design_core": {
    "type": "string (e.g. Social Media Poster, Flyer)",
    "industry": "string",
    "brand_name": "string (name seen in image, or 'Generic')",
    "theme": "string (the main topic/subject)",
    "visual_style": "string (e.g. Modern, Minimalist, Vibrant)",
    "color_palette": {
      "background_primary": "string",
      "typography_primary": "string",
      "accents": "string",
      "additional_colors": "string (optional)"
    }
  },
  "visual_composition": {
    "background_layer": {
      "elements": "detailed description of textures, gradients, or patterns"
    },
    "hero_element": {
      "description": "detailed description of the main subject/person",
      "attire": "string (if person)",
      "pose": "string (if person)",
      "placement": "where it is in the frame"
    },
    "graphic_overlays": {
      "elements": [
        { "type": "string", "description": "string", "placement": "string" }
      ]
    }
  },
  "typography_and_text": {
    "headlines": {
      "main_title": { "text": "string", "style": "string" },
      "sub_title": { "text": "string", "style": "string" }
    },
    "informational_list": {
      "items": [
        { "title": "string", "body": "string", "icon": "string" }
      ],
      "style": "description of the list layout/style"
    },
    "footer_section": {
      "cta_button": { "text": "string", "style": "string" },
      "brand_identity": { "logo": "string", "text": "string" }
    }
  }
}

Rules:
- Do NOT use markdown code fences.
- Be extremely descriptive.
- If text is in Burmese, keep it in Burmese in the JSON.
- industryId provided by system: ${params.industryId}
`;

  const result = await generateContentWithModelFallback({
    primaryModel: TEXT_PRIMARY_MODEL,
    fallbackModel: TEXT_FALLBACK_MODEL,
    contents: [
      {
        role: "user",
        parts: [{ text: prompt }, image],
      },
    ],
    config: {
      temperature: 0.2,
      maxOutputTokens: 4096,
      responseMimeType: "application/json",
    },
  });

  return cleanAndParseJson(result.text ?? "");
}

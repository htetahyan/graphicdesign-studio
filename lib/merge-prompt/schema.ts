import { z } from "zod";
import type { NanobannaPrompt } from "../types";

export const NanobannaPromptSchema = z
  .object({
    generation_settings: z
      .object({
        aspect_ratio: z.string(),
      })
      .passthrough(),
    design_composition: z.object({}).passthrough(),
    layout_map: z
      .object({
        elements: z.array(z.object({ id: z.string() }).passthrough()).optional(),
      })
      .passthrough(),
    typography_specifications: z.object({}).passthrough(),
    color_and_gradient_details: z.object({}).passthrough(),
    raw_data_transcription: z.object({}).passthrough(),
  })
  .passthrough();

export function validateNanobannaPrompt(value: unknown): asserts value is NanobannaPrompt {
  NanobannaPromptSchema.parse(value);
}

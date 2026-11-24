export function getOutputFormatPrompt(aspectRatio: string): string {
  return `
    ═══════════════════════════════════════════
    OUTPUT FORMAT
    ═══════════════════════════════════════════

    Output ONLY valid JSON. No preamble, no explanation.

    {
      "generation_settings": {
        "aspect_ratio": "${aspectRatio}",  // MUST match the requested aspect ratio exactly
        "safe_area_padding_percent": "number",
        "text_language_priority": "string — e.g., Burmese primary, English secondary",
        "logo_placement": "string — MUST match brandContext.layout_details.logo_placement or referenceContext's logo placement (e.g., 'top-left', 'top-right', 'bottom-left', 'bottom-right', 'top-center', 'bottom-center'). NEVER default to 'bottom-left' unless that is the actual analyzed placement from the contexts."
      },
      "design_composition": {
        "overall_style": "string — match the brand's exact design movement",
        "complexity_level": "string — low / moderate / high, must match brand context",
        "layout_strategy": "string — e.g., 'Centered Hero', 'Two-Column Structure', 'Vertical Pricing List'",
        "perspective": "string — e.g., 'frontal flat', 'slight 3/4 angle', 'top-down'",
        "lighting": "string — describe light sources, mood, and shadow direction",
        "whitespace_usage": "string — how generous or tight the spacing is"
      },
      "layout_map": {
        "grid": {
          "type": "string — e.g., '12-col', 'rule-of-thirds', 'two-row hero+footer' (Note: This is an abstract layout marker for spacing. NEVER draw literal lines or gridlines on the canvas)",
          "columns": "number",
          "rows": "number",
          "gutter_percent": "number",
          "outer_margin_percent": "number"
        },
        "elements": [
          {
            "id": "logo",
            "role": "logo",
            "bbox_percent": { "x": "number", "y": "number", "w": "number", "h": "number" },
            "anchor": "string — MUST match the exact logo placement value (e.g., 'top-left', 'top-right', 'bottom-left', 'bottom-right', 'top-center', 'bottom-center'). Ensure the bbox_percent coordinates (x, y) match this anchor (e.g., x: 6, y: 6 for 'top-left', x: 80, y: 6 for 'top-right', or x: 6, y: 80 for 'bottom-left').",
            "alignment": "string — e.g., 'left', 'center', 'right'",
            "rotation_deg": 0,
            "z_index": 10,
            "notes": "Logo must be a direct stamp of image input 1; do NOT alter shape, text, or color. Never crop. Determine placement dynamically based on brandContext or visual flow."
          },
          {
            "id": "string",
            "role": "string — e.g., logo | headline | supporting_text | hero_subject | cta | footer",
            "bbox_percent": { "x": 0, "y": 0, "w": 0, "h": 0 },
            "anchor": "string — e.g., 'top-left', 'center', 'bottom-right'",
            "alignment": "string — e.g., 'left', 'center', 'right'",
            "rotation_deg": "number",
            "z_index": "number",
            "notes": "string — placement rationale and relationships"
          }
        ]
      },
      "visual_elements_detailed": {
        "background_layer": {
          "description": "string — colors, gradients, textures, depth elements",
          "complexity_note": "string — e.g., 'keep minimal per brand reference' or 'layered abstract shapes'"
        },
        "foreground_subject": {
          "description": "string — the main visual hero (product, person, object)",
          "treatment": "string — e.g., 'clean cutout on solid base', 'glowing rim light', '3D rendered'"
        },
        "floating_props": [
          { "item": "string", "position": "string", "style": "string" }
        ],
        "decorative_elements": "string — subtle brand-consistent accents, if any. Write 'none' if brand is minimal."
      },
      "typography_specifications": {
        "text_volume": "string — minimal / moderate / dense, must reflect user input only",
        "headlines": {
          "text": "string — ⚠️ CRITICAL: Pick the MAIN OFFER or SERVICE NAME, NEVER rhetorical questions. If the prompt has 'Free X' or event name, use that as headline.",
          "style": "string — font weight, size, color, effect",
          "layout": {
            "max_lines": "number",
            "line_height": "string",
            "tracking": "string",
            "bbox_percent": { "x": 0, "y": 0, "w": 0, "h": 0 },
            "alignment": "string"
          }
        },
        "supporting_text": {
          "text": "string — only if user provided it. Otherwise write 'none'",
          "style": "string",
          "layout": {
            "max_lines": "number",
            "bbox_percent": { "x": 0, "y": 0, "w": 0, "h": 0 },
            "alignment": "string"
          }
        },
        "content_blocks": [
          {
            "category": "string — only include if user provided structured data like pricing",
            "items": [
              { "item_name": "string", "price": "string", "duration": "string", "style": "string" }
            ]
          }
        ],
        "footer_or_contact": {
          "text": "string — only if user provided contact info. Otherwise 'none'",
          "style": "string",
          "layout": {
            "bbox_percent": { "x": 0, "y": 0, "w": 0, "h": 0 },
            "alignment": "string"
          }
        }
      },
      "color_and_gradient_details": {
        "primary": "string",
        "secondary": "string",
        "accent": "string",
        "usage_notes": "string — e.g., 'primary used for background wash, accent for CTA only'"
      },
      "raw_data_transcription": {
        "all_prices_detected": ["string — every price from user input, verbatim"],
        "all_programs_detected": ["string — every item/program from user input, verbatim"],
        "contact_info": "string — from user input only"
      }
    }
  `;
}

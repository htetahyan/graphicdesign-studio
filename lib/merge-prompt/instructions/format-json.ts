export function getOutputFormatJson(aspectRatio: string): string {
  return `
    ═══════════════════════════════════════════
    OUTPUT FORMAT
    ═══════════════════════════════════════════

    Output ONLY valid JSON. No preamble, no explanation.

    {
      "generation_settings": {
        "aspect_ratio": "${aspectRatio}",
        "safe_area_padding_percent": "number",
        "text_language_priority": "string — e.g., 'Burmese primary, English secondary'. MUST reflect user prompt + brand context only; never infer from reference image language.",
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
            "anchor": "string — MUST match the exact logo placement value (e.g., 'top-left', 'top-right', 'bottom-left', 'bottom-right', 'top-center', 'bottom-center'). Ensure the bbox_percent coordinates (x, y) match this anchor.",
            "alignment": "string — e.g., 'left', 'center', 'right'",
            "rotation_deg": 0,
            "z_index": 10,
            "notes": "Logo MUST be a 100% accurate stamp of image input 1. Do NOT alter shape, text, or color. Do NOT remove or change the logo's background. Determine placement dynamically based on brandContext or visual flow."
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
          "text": "string — best punchy headline inferred from FULL user request; do NOT assume first line.",
          "style": "string — font weight, size, color, effect (e.g., 'flat white bold', 'flat solid gold vector'. CRITICAL: If text is in Burmese, MUST be flat 2D sans-serif typography, strictly NO 3D, NO bevel, NO embossed effects).",
          "layout": {
            "max_lines": "number",
            "line_height": "string",
            "tracking": "string",
            "bbox_percent": { "x": 0, "y": 0, "w": 0, "h": 0 },
            "alignment": "string"
          }
        },
        "supporting_text": {
          "text": "string — only if headline compression requires supporting hierarchy OR user explicitly provided it.",
          "style": "string — must DIFFER from headline style: lighter weight, smaller size, simpler effect. Contrast is mandatory.",
          "layout": {
            "max_lines": "number",
            "bbox_percent": { "x": 0, "y": 0, "w": 0, "h": 0 },
            "alignment": "string"
          }
        },
        "text_hierarchy_contrast": {
          "description": "string — REQUIRED. Describe how headlines and supporting_text differ visually: size ratio, weight difference, effect contrast.",
          "size_ratio": "string — e.g., 'headline 2x larger than supporting'",
          "weight_contrast": "string — e.g., 'headline bold, supporting regular'",
          "effect_contrast": "string — e.g., 'headline has glow, supporting is flat'"
        },
        "cta_button": {
          "text": "string — ONLY use text the user EXPLICITLY provided as CTA. If user did NOT provide any CTA text, write 'none'.",
          "style": "string — only if text is not 'none'",
          "layout": {
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
        "hashtags": "ALWAYS 'none'",
        "footer_or_contact": {
          "text": "string — only if user EXPLICITLY provided contact info. Otherwise MUST be 'none'.",
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
        "usage_notes": "string"
      },
      "raw_data_transcription": {
        "all_prices_detected": ["string"],
        "all_programs_detected": ["string"],
        "contact_info": "string"
      }
    }
  `;
}

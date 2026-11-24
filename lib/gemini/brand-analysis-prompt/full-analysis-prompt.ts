import { getIntroduction } from "./introduction";
import { getDimensions } from "./dimensions";

export function getFullAnalysisPrompt(): string {
  const intro = getIntroduction();
  const dimensions = getDimensions();
  const outputRules = `
    10. BRAND VISUAL DNA
        - One precise paragraph: what makes this brand's design INSTANTLY recognizable?
        - List 3–5 most distinctive visual signatures (the things you'd copy first to match the style)
        - Curated Pinterest Style Archetype: 'editorial' | '3d_studio' | 'glassmorphism' | 'paper_cutout' | 'retro_futuristic' | 'brutalist' | 'clean_minimal'

    ═══════════════════════════════════════════
    OUTPUT RULES
    ═══════════════════════════════════════════
    - Output ONLY valid JSON. No markdown, no explanation, no code fences.
    - All string values must be specific and descriptive, never generic placeholders.
    - "text_density": "low" | "medium" | "high"
    - "complexity": "simple" | "moderate" | "complex"

    {
      "style": "specific design movement — be precise",
      "curated_aesthetic_archetype": "editorial | 3d_studio | glassmorphism | paper_cutout | retro_futuristic | brutalist | clean_minimal",
      "complexity": "simple | moderate | complex",
      "text_density": "low | medium | high",
      "dimensional_quality": {
        "type": "2D-flat | pseudo-3D | full-3D-render | photo-composite",
        "has_floating_elements": true,
        "floating_element_description": "string — what floats and how",
        "shadow_style": "none | soft-drop | hard-drop | long-shadow | inner-glow | soft-glow | realistic-cast",
        "depth_layers": 3,
        "material_feel": "flat | glossy | matte | glass | metallic | paper-embossed | neon"
      },
      "colors": {
        "primary": "#hex",
        "secondary": "#hex",
        "accent": "#hex",
        "background": "#hex",
        "glow_rim_color": "#hex or none",
        "gradient_direction": "none | top-bottom | radial | diagonal | multi-stop",
        "gradient_colors": ["#hex1", "#hex2"],
        "overlay_style": "none | color-wash | glassmorphism | frosted-blur | duotone",
        "temperature": "warm | cool | neutral | high-contrast | neon-vibrant"
      },
      "layout_details": {
        "type": "centered-hero | rule-of-thirds | two-column | asymmetric | diagonal | z-pattern | grid-list | full-bleed",
        "logo_placement": "top-left | top-center | top-right | bottom-left | bottom-right | bottom-center | overlaid | not-visible",
        "whitespace": "very-tight | tight | balanced | open | very-open",
        "border_style": "none | thin-hairline | thick-border | decorative | pill-frame | full-frame",
        "corner_radius": "sharp | slight | rounded | fully-rounded | organic",
        "content_alignment": "centered | left | right | diagonal-flow"
      },
      "layout_patterns": "detailed string describing the full layout composition",
      "typography": {
        "feel": "string — overall typographic personality",
        "burmese_style": "string — exact Burmese script style or 'not present'",
        "weight": "string — dominant font weight",
        "text_effect": "flat | outline | 3D-extrude | glow | shadow | gradient-fill | emboss",
        "headline_scale": "dominant | large | medium | small",
        "language_mix": "Burmese-primary | English-primary | equal-mix | Burmese-only | English-only"
      },
      "decorative_elements": {
        "geometric_shapes": ["string — describe each"],
        "pattern_elements": ["string"],
        "has_badges_or_seals": true,
        "badge_description": "string",
        "has_sparkle_elements": false,
        "divider_style": "none | thin-line | decorative-wave | torn-edge",
        "unique_brand_motif": "string — the single most distinctive recurring visual element"
      },
      "subject_treatment": {
        "type": "clean-cutout | integrated-scene | silhouette | illustrated | none",
        "position": "centered | rule-of-thirds-right | rule-of-thirds-left | floating | full-bleed",
        "photo_treatment": "natural-realistic | high-contrast-punchy | warm-golden | cool-blue | desaturated | illustrated",
        "subject_size": "dominant | large | medium | small | minimal"
      },
      "brand_visual_dna": {
        "summary": "one precise paragraph — what makes this brand INSTANTLY recognizable visually",
        "distinctive_signatures": ["string — top 3-5 visual signatures to reproduce first to match this style"],
        "curated_aesthetic_archetype": "editorial | 3d_studio | glassmorphism | paper_cutout | retro_futuristic | brutalist | clean_minimal",
        "creative_execution_rationale": "2-3 sentence curated guidelines for how AI design generators should compose artwork for this brand with Pinterest-level energy while maintaining 100% brand authenticity."
      },
      "extracted_texts": {
        "headlines": ["string — verbatim, only if clearly legible"],
        "slogans": ["string"],
        "ctas": ["string"]
      },
      "call_to_actions": { "common_text": ["string"], "button_style": "string — pill | rounded-rect | sharp | ghost-outline", "placement": "string" },
      "brand_summary": "string — comprehensive visual identity summary for AI generation"
    }
  `;

  return [intro, dimensions, outputRules].join("\n");
}

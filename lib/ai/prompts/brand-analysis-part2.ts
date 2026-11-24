export const BRAND_ANALYSIS_PROMPT_PART2 = `
    4. TYPOGRAPHY (describe with precision)
       - Font weight: thin | light | regular | medium | bold | black/heavy
       - Font style: serif | sans-serif | rounded-sans | display/decorative | handwritten
       - Burmese script: if present — describe style (bold, rounded, thin, outline), Unicode standard, readability
       - Text visual effects: flat | outline-stroke | 3D-extrude | soft-glow | drop-shadow | gradient-fill | emboss
       - Headline scale relative to canvas: dominant (>40%) | large (25–40%) | medium (15–25%) | small (<15%)
       - Mixed language layout: Burmese-primary | English-primary | equal-mix | Burmese-only | English-only

    5. LAYOUT & SPATIAL STRUCTURE
       - Primary layout type: centered-hero | rule-of-thirds | two-column | asymmetric | diagonal | z-pattern | grid-list | full-bleed
       - Logo placement convention: top-left | top-center | top-right | bottom-center | overlaid-center | not-visible
       - Whitespace generosity: very-tight | tight | balanced | open | very-open
       - Border/frame usage: none | thin-hairline | thick-border | decorative-ornamental | pill/badge-frame | full-frame
       - Corner radius aesthetic: sharp-0px | slight-4-8px | rounded-12-20px | fully-rounded | organic-irregular
       - Content alignment: centered | left-aligned | right-aligned | diagonal-flow

    6. DECORATIVE ELEMENTS & BRAND MOTIFS
       - Geometric shapes actively used (e.g., large arc circle, diagonal color band, hexagon grid, organic blob, triangle corner, dot matrix)
       - Pattern elements (e.g., repeating dots, diagonal lines, noise texture, wave, confetti, star burst)
       - Badges, seals, stamp elements: yes/no — describe shape (circle badge, star seal, ribbon, pill tag)
       - Sparkle/star/light-ray elements: yes/no
       - Divider/separator style: none | thin-line | double-line | decorative-wave | torn-edge
       - Unique recurring motif that defines this brand visually

    7. SUBJECT & PHOTO TREATMENT
       - How subjects (people/products) are shown: clean-cutout | integrated-scene | silhouette | illustrated | flat-icon | none
       - Subject background: bg-removed-cutout | full-scene-with-bg | mixed
         (bg-removed-cutout = person/product is cut out from original background and placed on design background;
          full-scene-with-bg = person/product appears in their original setting/environment;
          mixed = some designs use cutouts, some use scenes)
       - Subject position: centered | rule-of-thirds-right | rule-of-thirds-left | bottom-anchored | floating-center | full-bleed
       - Photo treatment style: natural-realistic | high-contrast-punchy | warm-golden | cool-blue | desaturated-muted | illustrated-painterly
       - Product/subject size relative to canvas: dominant | large | medium | small | minimal

    8. CALL TO ACTIONS
       - Button shape: pill | rounded-rect | sharp-rect | circle | ghost-outline
       - Button color: match primary | match accent | white | black | gradient
       - CTA text style and placement
       - Secondary actions if present

    9. BRAND VISUAL DNA
       - One precise paragraph: what makes this brand's design INSTANTLY recognizable?
       - List 3–5 most distinctive visual signatures (the things you'd copy first to match the style)

    10. CONTACT INFORMATION (extract ALL visible contact details verbatim)
       - Phone numbers: list every phone number exactly as written (with country code, dashes, spaces)
       - Website URLs: extract domain names and full URLs
       - Social media handles: Facebook, Instagram, TikTok, etc.
       - Email addresses
       - Physical address / location
       - These will be reused automatically when users type short prompts

    ═══════════════════════════════════════════
    OUTPUT RULES
    ═══════════════════════════════════════════
    - Output ONLY valid JSON. No markdown, no explanation, no code fences.
    - All string values must be specific and descriptive, never generic placeholders.
    - "text_density": "low" | "medium" | "high"
    - "complexity": "simple" | "moderate" | "complex"

    {
      "style": "specific design movement — be precise",
      "complexity": "simple | moderate | complex",
      "text_density": "low | medium | high",
      "design_preference": "minimalist | balanced | feature-rich",
      "dimensional_quality": {
        "type": "2D-flat | pseudo-3D | full-3D-render | photo-composite",
        "has_floating_elements": true,
        "floating_element_description": "string — what floats and how",
        "shadow_style": "none | soft-drop | hard-drop | long-shadow | inner-glow | soft-glow | realistic-cast",
        "depth_layers": 2,
        "material_feel": "flat | glossy | matte | glass | metallic | paper | neon"
      },
      "colors": {
        "primary": "#hex",
        "secondary": "#hex",
        "accent": "#hex",
        "background": "#hex",
        "gradient_direction": "none | top-bottom | radial | diagonal | multi-stop",
        "gradient_colors": ["#hex1", "#hex2"],
        "overlay_style": "none | color-wash | glassmorphism | frosted-blur | duotone",
        "temperature": "warm | cool | neutral | high-contrast"
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
        "geometric_shapes": ["string — describe each: 'large circle arc top-right', 'diagonal color band bottom'"],
        "pattern_elements": ["string — e.g., 'repeating dot grid', 'diagonal line texture' or 'none'"],
        "has_badges_or_seals": true,
        "badge_description": "string — shape and style or 'none'",
        "has_sparkle_elements": false,
        "divider_style": "none | thin-line | decorative-wave | torn-edge",
        "unique_brand_motif": "string — the single most distinctive recurring visual element"
      },
      "subject_treatment": {
        "type": "clean-cutout | integrated-scene | silhouette | illustrated | none",
        "subject_background": "bg-removed-cutout | full-scene-with-bg | mixed",
        "position": "centered | rule-of-thirds-right | rule-of-thirds-left | floating | full-bleed",
        "photo_treatment": "natural-realistic | high-contrast-punchy | warm-golden | cool-blue | desaturated | illustrated",
        "subject_size": "dominant | large | medium | small | minimal"
      },
      "brand_visual_dna": {
        "summary": "one precise paragraph — what makes this brand INSTANTLY recognizable visually",
        "distinctive_signatures": ["string — top 3-5 visual signatures to reproduce first to match this style"]
      },
      "extracted_texts": {
        "headlines": ["string — verbatim, only if clearly legible"],
        "slogans": ["string"],
        "ctas": ["string"]
      },
      "contact_info": {
        "phone_numbers": ["string — exact phone numbers as written, e.g. '082-449-3092', '09 771 367 516'"],
        "website": "string or null — e.g. 'goldtoweracademy.com'",
        "social_media": ["string — e.g. 'FB: @goldtower', 'IG: @goldtower_academy'"],
        "email": "string or null",
        "address": "string or null — physical address if visible"
      },
      "call_to_actions": { "common_text": ["string"], "button_style": "string — pill | rounded-rect | sharp | ghost-outline", "placement": "string" },
      "brand_summary": "string — comprehensive visual identity summary for AI generation"
    }
`;

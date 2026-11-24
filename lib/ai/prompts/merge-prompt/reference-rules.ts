export function getReferenceRulesPrompt(referenceContext: any, referenceInfluence: string): string {
  if (!referenceContext) return "";

  if (referenceContext.color_source === "logo_only") {
    return `
    ═══════════════════════════════════════════
    ⚠️ INSPIRATION MODE — COLOR OVERRIDE (MANDATORY)
    ═══════════════════════════════════════════

    The reference images above were submitted in "Inspiration Mode".
    This means the user LIKES the LAYOUT and STRUCTURE of those references,
    but they want to keep their OWN BRAND IDENTITY and COLORS.

    YOU MUST FOLLOW THESE RULES WITHOUT EXCEPTION:

    COLOR RULES:
    - ALL colors in your output (backgrounds, gradients, overlays, text colors, CTA colors, shape fills,
      accent colors, shadow tints) MUST be derived EXCLUSIVELY from the brand logo visible in the image input.
    - DO NOT use any colors from the reference images.
    - Extract the logo's dominant color → use as primary.
    - Extract the logo's secondary/accent color → use as secondary/accent.
    - Build a harmonious palette from the LOGO ONLY.
    - If the logo is monochrome, use that color + white/black + a complementary tone.

    LAYOUT & STRUCTURE RULES (what you SHOULD take from references):
    ${referenceInfluence === "high"
      ? `
    - CLOSELY REPLICATE the composition layout type from references
    - PRECISELY MATCH the element arrangement and positioning
    - COPY the dimensional quality and depth treatment
    - REPLICATE decorative element shapes and patterns exactly
    - MATCH the lighting mood and shadow style
    - FOLLOW the typography composition structure closely
    - The final design should look structurally VERY SIMILAR to the reference
    `
      : `
    - Use the composition layout type (centered-hero, two-column, diagonal, etc.) from the reference context.
    - REPLICATE the element arrangement (where subjects float, where text zones are, where badges sit).
    - MATCH the dimensional quality (2D-flat, 3D, photo-composite) from the reference.
    - ADOPT the decorative element shapes (geometric arcs, diagonal bands, dot patterns).
    - COPY the lighting mood, depth layering, and visual hierarchy from the reference.
    - The output layout should be RECOGNIZABLY SIMILAR to the reference.
    - A viewer should see the reference and the output side-by-side and say "these look related."
    - Balance reference structure with brand's own design personality.
    `
    }

    IDENTITY RULES:
    - The brand LOGO must be prominently placed (never omit).
    - All text content comes ONLY from the user's prompt (never from reference images).
    - The final design must feel like THIS BRAND designed in THAT LAYOUT STYLE.
    `;
  }

  return `
    ═══════════════════════════════════════════
    📸 REFERENCE IMAGES PROVIDED
    ═══════════════════════════════════════════
    
    The user has provided reference images to guide the design.
    
    REFERENCE INFLUENCE LEVEL: ${referenceInfluence.toUpperCase()}
    
    ${referenceInfluence === "high"
      ? `
    HIGH INFLUENCE MODE:
    - Study the reference images carefully and replicate their structure closely
    - Match the composition, layout, element positioning, and visual hierarchy
    - Copy the dimensional quality, depth treatment, and material effects
    - Replicate decorative patterns, geometric shapes, and visual motifs
    - Match the lighting direction, shadow style, and mood
    - Follow the typography composition and text positioning
    - Use the same color palette from references (not just logo)
    - The final design should look structurally and stylistically VERY SIMILAR to references
    `
      : `
    NORMAL INFLUENCE MODE:
    - Reference images are your PRIMARY structural guide — do not ignore them.
    - STUDY each reference image carefully and identify: layout type, element positioning,
      color palette, decorative elements, typography treatment, dimensional quality.
    - REPLICATE the composition layout type (centered-hero, two-column, diagonal, multi-section, etc.)
    - MATCH the element arrangement and visual hierarchy from the reference.
    - ADOPT the dimensional quality (flat, 2.5D, 3D, photo-composite) from references.
    - INCORPORATE the same decorative patterns, shapes, and visual motifs.
    - Use the reference's lighting mood, shadow direction, and depth layering.
    - Blend reference color harmony with brand colors — references lead, brand adjusts.
    - The final design should be RECOGNIZABLY SIMILAR to the references in layout and style.
    - A viewer should see the reference and the output side-by-side and say "these look related."
    `
    }
  `;
}

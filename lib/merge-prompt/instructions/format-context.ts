export function getDescriptiveBrandGuide(brandContext: any, isCarousel: boolean = false, creativeMode: boolean = false): string {
  if (!brandContext) return "";
  
  const colors = brandContext.colors || {};
  const visualDna = brandContext.brand_visual_dna || {};
  const typography = brandContext.typography || {};
  const layout = brandContext.layout_details || {};
  const decorative = brandContext.decorative_elements || {};

  const relaxLayout = isCarousel || creativeMode;

  const layoutPatternsText = relaxLayout
    ? `
    - Composition Style: DYNAMIC VARIETY (Relax the brand's default composition style '${brandContext.layout_patterns || "balanced asymmetric"}' to support unique, creative, and non-repetitive designs).
    - Content Alignment: DYNAMIC (Vary alignments: left, center, right based on visual flow).
    - Logo Placement: ${layout.logo_placement || "top-left"} (Keep logo placement consistent with brand identity).
    - CREATIVE MODE / CAROUSEL EXCEPTION: Prioritize visual variety and unique compositions over rigid layout rules. The layout map coordinates (x, y, w, h) should be dynamically adjusted to create custom-crafted designs rather than repetitive templates.`
    : `
    - Composition Style: ${brandContext.layout_patterns || "balanced asymmetric"}
    - Content Alignment: ${layout.content_alignment || "left"}
    - Logo Placement: ${layout.logo_placement || "top-left"}`;

  return `
    ═══════════════════════════════════════════
    BRAND VISUAL DNA & AESTHETIC GUIDE (MANDATORY)
    ═══════════════════════════════════════════
    Brand Name: ${brandContext.name || "My Brand"}
    Style Direction: ${brandContext.style || "Modern & Professional"}
    
    COLOR PALETTE ROLES:
    - Primary Color: ${colors.primary || "none"} (Use for main background elements, large blocks, dominant theme)
    - Secondary Color: ${colors.secondary || "none"} (Use for secondary elements, borders, gold/silver accents)
    - Accent Color: ${colors.accent || "none"} (Use sparingly for important visual highlights, warnings, or CTA buttons)
    - Background Base: ${colors.background || "#FFFFFF"} (Base canvas color)
    - Gradients: ${JSON.stringify(colors.gradient_colors || [])} (Direction: ${colors.gradient_direction || "diagonal"})
    
    VISUAL DNA SIGNATURES:
    ${visualDna.summary ? `- Summary: ${visualDna.summary}` : ""}
    ${Array.isArray(visualDna.distinctive_signatures) ? visualDna.distinctive_signatures.map((s: string) => `- ${s}`).join("\n") : ""}
    
    DECORATIVE MOTIFS & ACCENTS:
    - Geometric/Shapes: ${JSON.stringify(decorative.geometric_shapes || [])}
    - Badge Style: ${decorative.badge_description || "none"}
    - Unique Brand Motif: ${decorative.unique_brand_motif || "none"}
    - Seals/Sparkles: Badges/Seals=${!!decorative.has_badges_or_seals}, Sparkles=${!!decorative.has_sparkle_elements}
    
    TYPOGRAPHY STYLE:
    - Vibe: ${typography.feel || "modern"}
    - Burmese Style: ${typography.burmese_style || "flat 2D vector style"}
    
    LAYOUT PATTERNS:
    ${layoutPatternsText}
    
    =========================================
  `;
}

export function getOutputFormatContext(
  brandContext: any,
  referenceContext: any,
  cleanedUserPrompt: string,
  referenceInfluence: "normal" | "high",
  aspectRatio: string,
  isCarousel: boolean = false,
  creativeMode: boolean = false,
): string {
  const isLogoOnlyColor = referenceContext?.color_source === "logo_only";
  const hasReferenceContext = !!referenceContext;

  return `
    ═══════════════════════════════════════════
    CONTEXT
    ═══════════════════════════════════════════

    Aspect Ratio: ${aspectRatio}
    Brand Context: ${JSON.stringify(brandContext)}
    
    ${getDescriptiveBrandGuide(brandContext, isCarousel, creativeMode)}
    
    Reference Images Context (optional): ${hasReferenceContext ? JSON.stringify(referenceContext) : "none"}
    User Request: ${cleanedUserPrompt}

    ${isLogoOnlyColor ? `
    ═══════════════════════════════════════════
    ⚠️ INSPIRATION MODE — COLOR OVERRIDE (MANDATORY)
    ═══════════════════════════════════════════

    The reference images above were submitted in "Inspiration Mode".
    This means the user LIKES the LAYOUT and STRUCTURE of those references,
    but they want to keep their OWN BRAND IDENTITY and COLORS.

    YOU MUST FOLLOW THESE RULES WITHOUT EXCEPTION:

    COLOR RULES:
    - ALL colors in your output (backgrounds, gradients, overlays, text colors, CTA colors, shape fills) MUST be derived EXCLUSIVELY from the brand logo visible in the image input.
    - DO NOT use any colors from the reference images.
    - Extract the logo's dominant color → use as primary.
    - Extract the logo's secondary/accent color → use as secondary/accent.
    - Build a harmonious palette from the LOGO ONLY.
    - If the logo is monochrome, use that color + white/black + a complementary tone.

    LAYOUT & STRUCTURE RULES (what you SHOULD take from references):
    ${referenceInfluence === "high" ? `
    - CLOSELY REPLICATE the composition layout type from references
    - PRECISELY MATCH the element arrangement and positioning
    - COPY the dimensional quality and depth treatment
    - REPLICATE decorative element shapes and patterns exactly
    - MATCH the lighting mood and shadow style
    - FOLLOW the typography composition structure closely
    - The final design should look structurally VERY SIMILAR to the reference
    ` : `
    - Use the composition layout type (centered-hero, two-column, diagonal, etc.) from the reference context.
    - REPLICATE the element arrangement (where subjects float, where text zones are, where badges sit).
    - MATCH the dimensional quality (flat, 2.5D, 3D, photo-composite) from the reference.
    - ADOPT the decorative element shapes (geometric arcs, diagonal bands, dot patterns).
    - COPY the lighting mood, depth layering, and visual hierarchy from the reference.
    - The output layout should be RECOGNIZABLY SIMILAR to the reference.
    `}

    IDENTITY RULES:
    - The brand LOGO must be prominently placed (never omit).
    - All text content comes ONLY from the user's prompt (never from reference images).
    - The final design must feel like THIS BRAND designed in THAT LAYOUT STYLE.
    ` : hasReferenceContext ? `
    ═══════════════════════════════════════════
    📸 REFERENCE IMAGES PROVIDED
    ═══════════════════════════════════════════
    
    The user has provided reference images to guide the design.

    LANGUAGE RULE (CRITICAL):
    - Reference images may include foreign-language text. NEVER adopt that language for the output.
    - All output text language and script MUST follow the user's prompt + brand context only.
    
    REFERENCE INFLUENCE LEVEL: ${referenceInfluence.toUpperCase()}
    
    ${referenceInfluence === "high" ? `
    HIGH INFLUENCE MODE:
    - Study the reference images carefully and replicate their structure closely
    - Match the composition, layout, element positioning, and visual hierarchy
    - Copy the dimensional quality, depth treatment, and material effects
    - Replicate decorative patterns, geometric shapes, and visual motifs
    - Match the lighting direction, shadow style, and mood
    - Follow the typography composition and text positioning
    - Use the same color palette from references (not just logo)
    - The final design should look structurally and stylistically VERY SIMILAR to references
    ` : `
    NORMAL INFLUENCE MODE:
    - Reference images are your PRIMARY structural guide — do not ignore them.
    - STUDY each reference image carefully and identify: layout type, element positioning, color palette, decorative elements.
    - REPLICATE the composition layout type from the reference context.
    - MATCH the element arrangement and visual hierarchy from the reference.
    - ADOPT the dimensional quality from references.
    - INCORPORATE the same decorative patterns, shapes, and visual motifs.
    - Use the reference's lighting mood, shadow direction, and depth layering.
    - Blend reference color harmony with brand colors — references lead, brand adjusts.
    - The final design should be RECOGNIZABLY SIMILAR to the references in layout and style.
    `}
    ` : ""}
  `;
}

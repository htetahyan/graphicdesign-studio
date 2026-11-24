export function getDimensions(): string {
  return `
    ═══════════════════════════════════════════════════════════
    PART B — ANALYZE ALL 11 DIMENSIONS WITH PRECISION & CURATION
    ═══════════════════════════════════════════════════════════

    1. DESIGN MOVEMENT & VISUAL IDENTITY
       - Exact design movement (e.g., Editorial Kinetic, Neo-brutalism, Glassmorphism, 3D Floating Studio, Tactile Paper Cutout, Retro Cyber, Flat 2.0, Luxury Minimalist, Corporate Clean, Myanmar Traditional-Modern, Bold-Pop)
       - Curated Aesthetic Archetype: Choose the best matching Pinterest style archetype: 'editorial' | '3d_studio' | 'glassmorphism' | 'paper_cutout' | 'retro_futuristic' | 'brutalist' | 'clean_minimal'
       - Overall complexity across all images: simple | moderate | complex
       - Text density: low | medium | high
       - Primary medium: digital graphic | photo-based | illustration-based | mixed
       - Visual quality tier: budget-simple | mid-market | premium | ultra-premium
       - Overall brand personality in one phrase (e.g., "bold and festive", "sleek and futuristic", "clean and trustworthy")

    2. DIMENSIONAL QUALITY & DEPTH
       - Dimensional type: 2D-flat | pseudo-3D | full-3D-render | photo-composite
       - Floating/levitating objects: yes/no — describe EXACTLY what floats, how it floats, and its visual treatment
       - Shadow style: none | soft-drop | hard-drop | long-shadow | soft-glow | realistic-cast
       - Depth layer count (1–5): how many distinct visual depth planes exist?
       - Material feel of key elements: flat | glossy | matte | glass | metallic | neon | holographic | paper-embossed
       - Lighting source: top-center | top-left | dramatic-side | ambient-even | rim-light | spotlight | none
       - Glow/bloom effects: yes/no — describe color and intensity

    3. COLOR PALETTE — CURATED BRAND COLOR SYSTEM (exact hex codes mandatory)
       - Primary brand color (most dominant across the logo and design examples): exact hex
       - Secondary brand color (derived from cohesive usage in design examples or logo): exact hex
       - Accent/highlight color (derived from cohesive usage in design examples or logo): exact hex
       - Background color (most common): exact hex
       - Glow/Rim-light color (color used for highlights or glowing borders): exact hex or 'none'
       - Full background treatment: solid | top-bottom-gradient | radial-gradient | diagonal-gradient | textured | image-based
       - Gradient hex stops in order (if used)
       - Overlay/panel style: none | color-wash | glassmorphism-panel | frosted-blur | duotone | dark-overlay
       - Overall color temperature: warm | cool | neutral | high-contrast | neon-vibrant
       - Color usage rule: describe how primary, secondary, accent, and background colors harmonize.

    4. TYPOGRAPHY (describe with precision & visual pop)
       - Font weight: thin | light | regular | medium | bold | black/heavy
       - Font style: serif | sans-serif | rounded-sans | display/decorative | handwritten
       - Burmese script: if present — describe style (bold, rounded, thin, outline), Unicode standard, readability
       - Text visual effects: flat | outline-stroke | 3D-extrude | soft-glow | drop-shadow | gradient-fill | emboss
       - Headline scale relative to canvas: dominant (>40%) | large (25–40%) | medium (15–25%) | small (<15%)
       - Mixed language layout: Burmese-primary | English-primary | equal-mix | Burmese-only | English-only

    5. LAYOUT & SPATIAL STRUCTURE
       - Primary layout type: centered-hero | rule-of-thirds | two-column | asymmetric | diagonal | z-pattern | grid-list | full-bleed
       - Logo placement convention: top-left | top-center | top-right | bottom-left | bottom-right | bottom-center | overlaid-center | not-visible
       - Whitespace generosity: very-tight | tight | balanced | open | very-open
       - Border/frame usage: none | thin-hairline | thick-border | decorative-ornamental | pill-frame | full-frame
       - Corner radius aesthetic: sharp-0px | slight-4-8px | rounded-12-20px | fully-rounded
       - Content alignment: centered | left-aligned | right-aligned | diagonal-flow

    6. DECORATIVE ELEMENTS & BRAND MOTIFS
       - Geometric shapes actively used (e.g., large arc circle, diagonal color band, hexagon grid, organic blob, triangle corner, dot matrix)
       - Pattern elements (e.g., repeating dots, diagonal lines, noise texture, wave, confetti, star burst)
       - Badges, seals, stamp elements: yes/no — describe shape (circle badge, star seal, ribbon, pill tag)
       - Sparkle/star/light-ray elements: yes/no
       - Divider/separator style: none | thin-line | double-line | decorative-wave
       - Unique recurring motif that defines this brand visually

    7. SUBJECT & PHOTO TREATMENT
       - How subjects (people/products) are shown: clean-cutout | integrated-scene | silhouette | illustrated | none
       - Subject position: centered | rule-of-thirds-right | rule-of-thirds-left | bottom-anchored | floating-center | full-bleed
       - Photo treatment style: natural-realistic | high-contrast-punchy | warm-golden | cool-blue | desaturated-muted
       - Product/subject size relative to canvas: dominant | large | medium | small | minimal

    8. CALL TO ACTIONS
       - Button shape: pill | rounded-rect | sharp-rect | circle | ghost-outline
       - Button color: match primary | match accent | white | black | gradient

    9. CREATIVE EXECUTION RATIONALE & CURATION BLUEPRINT
       - Creative execution rationale: 2-3 sentences guiding an AI image generator on how to compose artwork for this brand with Pinterest-level scroll-stopping energy while keeping 100% brand fidelity.
  `;
}

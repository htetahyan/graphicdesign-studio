export type VisualStyleArchetype =
  | "auto"
  | "editorial"
  | "3d_studio"
  | "glassmorphism"
  | "paper_cutout"
  | "retro_futuristic"
  | "brutalist";

export interface ArchetypeDefinition {
  id: VisualStyleArchetype;
  name: string;
  description: string;
  instruction: string;
}

export const ARCHETYPES: Record<Exclude<VisualStyleArchetype, "auto">, ArchetypeDefinition> = {
  editorial: {
    id: "editorial",
    name: "Editorial Kinetic Poster",
    description: "High-fashion magazine feel with oversized kinetic typography, asymmetric split backgrounds, and cut-out subjects framing hero text.",
    instruction: `
    ARCHETYPE: EDITORIAL KINETIC POSTER (PINTEREST SHOWCASE)
    - COMPOSITION: Asymmetrical split-screen grid. Offset layout with heavy text-subject interaction.
    - TYPOGRAPHY: Oversized, dramatic headline font (tight tracking, large scale contrast). Text can run vertically or wrap tightly around the hero cutout.
    - DEPTH & TONE: Split-tone background (e.g. deep cream vs rich noir, muted beige vs vibrant brand accent). Soft film grain or matte paper finish.
    - HERO SUBJECT: Subject cutout is layered so portion of the text sits slightly behind their shoulder/head for visual depth ("breaking the grid").
    - DECORATIVE ACCENTS: Fine hairline rules, serial numbers/issue tags, minimal barcode/edition stamps.
    `,
  },
  "3d_studio": {
    id: "3d_studio",
    name: "3D Levitating Studio",
    description: "Hyper-realistic pseudo-3D studio composition with floating geometric shapes, directional spotlights, and dramatic contact shadows.",
    instruction: `
    ARCHETYPE: 3D LEVITATING STUDIO (PINTEREST SHOWCASE)
    - COMPOSITION: Dynamic floating studio stage with distinct Z-depth planes. Elements levitate at varying distances from camera.
    - TYPOGRAPHY: 3D extruded or glossy embossed lettering with subtle bevel highlights and soft drop shadows casting onto background surfaces.
    - LIGHTING & SHADOWS: Soft volumetric studio spotlight from top-right (45 deg angle). Contact ambient occlusion shadows underneath levitating elements.
    - FLOATING PROPS: Levitating metallic/glossy spheres, toruses, glass cubes, or product-specific 3D icons floating in mid-air around hero subject.
    - MATERIAL PALETTE: Soft matte ceramic bases mixed with high-gloss metallic or glass highlights.
    `,
  },
  glassmorphism: {
    id: "glassmorphism",
    name: "Modern Glassmorphism",
    description: "Sleek tech aesthetic with translucent frosted glass cards, soft ambient background glows, and crisp vibrant accents.",
    instruction: `
    ARCHETYPE: MODERN GLASSMORPHISM (PINTEREST SHOWCASE)
    - COMPOSITION: Layered translucent glass panels ("frosted glass cards") floating above a vibrant, organic background.
    - MATERIAL & TEXTURE: Semi-transparent panels with backdrop-blur, subtle white rim borders (1px light stroke), and realistic refraction effects.
    - LIGHTING & COLOR: Deep moody dark or icy pastel background with vibrant neon ambient light bleed (glows bleeding through frosted glass).
    - TYPOGRAPHY: Clean ultra-legible sans-serif with high contrast white text over dark glass panels or dark text over light frosted panels.
    - DECORATIVE ACCENTS: Floating translucent pill badges, glowing dot indicators, subtle geometric wireframes.
    `,
  },
  paper_cutout: {
    id: "paper_cutout",
    name: "Tactile Paper Cutout",
    description: "Handcrafted wabi-sabi aesthetic featuring layered paper textures, organic torn edges, tactile drop shadows, and warm authenticity.",
    instruction: `
    ARCHETYPE: TACTILE PAPER CUTOUT (PINTEREST SHOWCASE)
    - COMPOSITION: Organic layered paper collage. Stacked paper sheets forming frames, speech bubbles, or diagonal background dividers.
    - TEXTURE & FINISH: Subtle watercolor/craft paper texture, tactile torn paper edges, realistic physical drop shadows between paper layers.
    - TYPOGRAPHY: Warm editorial serif or bold stamp-style sans-serif. High contrast print ink aesthetic.
    - COLOR PALETTE: Earthy, warm, organic tones combined with vibrant brand accent paper sheets.
    - DECORATIVE ACCENTS: Paper tape strips, hand-drawn vector swooshes, subtle stamp watermarks.
    `,
  },
  retro_futuristic: {
    id: "retro_futuristic",
    name: "Retro-Futuristic Hologram",
    description: "Nostalgic early 2000s cyber aesthetic mixed with modern icy blues, chrome reflections, and glowing kinetic light trails.",
    instruction: `
    ARCHETYPE: RETRO-FUTURISTIC HOLOGRAM (PINTEREST SHOWCASE)
    - COMPOSITION: Kinetic centered or diagonal flow with futuristic geometric gridlines fading into deep space/gradient background.
    - LIGHTING & EFFECTS: Icy blue/cyan and magenta light rays, chromatic aberration accents, glowing holographic lens flares.
    - TYPOGRAPHY: Liquid chrome, metallic foil, or glowing neon outline typography with high-impact futuristic style.
    - HERO SUBJECT: High-contrast subject with vibrant cyan/magenta rim lighting tracing body or product contours.
    - DECORATIVE ACCENTS: Wireframe grids, crosshair target reticles, digital starbursts, iridescent gradient swooshes.
    `,
  },
  brutalist: {
    id: "brutalist",
    name: "Bold Brutalist High-Contrast",
    description: "Expressive modern brutalism with high-contrast color blocks, heavy rounded borders, kinetic typography stickers, and visual speed bumps.",
    instruction: `
    ARCHETYPE: BOLD BRUTALIST HIGH-CONTRAST (PINTEREST SHOWCASE)
    - COMPOSITION: High-energy anti-template layout. Heavy contrasting blocks, offset containers, and overlapping visual elements.
    - TYPOGRAPHY: Ultra-bold grotesque typography in high-contrast color blocks (e.g. yellow on black, acid green on navy).
    - CONTAINER & SHAPES: Thick 2-3px solid outlines, hard offset black drop shadows ("pop-art shadow"), rounded pill stickers.
    - COLOR & MOOD: Vibrant, unapologetic, high-saturation color clashes that act as scrolling speed bumps.
    - DECORATIVE ACCENTS: Wavy marquee ribbons, starburst discount badges, bold arrow callouts, barcode stickers.
    `,
  },
};

export function getArchetypeInstruction(visualStyle?: VisualStyleArchetype): string {
  if (!visualStyle || visualStyle === "auto") {
    // When auto is selected, provide an instruction to dynamically pick a Pinterest style archetype
    const archetypeKeys = Object.keys(ARCHETYPES) as Exclude<VisualStyleArchetype, "auto">[];
    const list = archetypeKeys.map(k => `• ${ARCHETYPES[k].name}: ${ARCHETYPES[k].description}`).join("\n");
    return `
    ═══════════════════════════════════════════
    DYNAMIC PINTEREST VISUAL ARCHETYPE (AUTO-VARIETY ENGINE)
    ═══════════════════════════════════════════
    To ensure every design is creative, unique, and non-repetitive, you MUST select one of the following 6 Pinterest visual style archetypes that BEST fits the user's prompt and brand context:

    ${list}

    CRITICAL RULE:
    1. Select ONE archetype explicitly for this generation.
    2. State your chosen archetype inside the JSON field "design_composition.overall_style".
    3. Apply the layout strategy, depth treatment, lighting, and decorative motifs of your chosen archetype.
    4. NEVER generate a standard plain top-headline/center-subject template.
    `;
  }

  const archetype = ARCHETYPES[visualStyle];
  if (!archetype) return "";

  return `
  ═══════════════════════════════════════════
  SELECTED PINTEREST VISUAL ARCHETYPE: ${archetype.name.toUpperCase()}
  ═══════════════════════════════════════════
  ${archetype.instruction}

  Apply these archetype rules strictly to structure your layout_map, visual_elements_detailed, and typography_specifications.
  `;
}

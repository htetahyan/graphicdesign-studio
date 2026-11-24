import { VisualStyleArchetype, getArchetypeInstruction } from "./archetypes";

export function getCreativeSection(
  creativeMode: boolean,
  referenceContextExist: boolean,
  isCarousel: boolean = false,
  visualStyle?: VisualStyleArchetype,
  designType: "graphic_design" | "flyer" = "graphic_design",
  flyerStyle?: string,
): string {
  const isSuperCreative = creativeMode || !referenceContextExist;
  const archetypeSection = getArchetypeInstruction(visualStyle);
  
  const flyerSection = designType === "flyer"
    ? `
    ═══════════════════════════════════════════
    COMMERCIAL FLYER & PROMOTIONAL POSTER ARCHITECTURE (FLYER MODE)
    ═══════════════════════════════════════════
    You are now operating in Commercial Flyer & Poster Mode. Your goal is to create high-converting commercial promotional flyers (e.g., travel & tour agency packages, event flyers, hotel & resort staycations, food menus, retail sales offers).

    CRITICAL RULES FOR FLYER DESIGN:

    1. HIGH-IMPACT PROMOTIONAL HERO HEADER:
       - Place the bold, catchy offer headline dynamically in the top or upper-third region (e.g. "CAMP UNDER THE STARS", "SIR BANI YAS ISLAND", "SUMMER OFFER", "ONE DAY TOUR").
       - Backing: Use high-contrast solid container banners or subtle contrast backing to guarantee 100% legibility.

    2. MANDATORY SERVICE HIGHLIGHTS & PACKAGE INCLUSIONS (DO NOT DROP OR COMPRESS):
       - IMPORTANT: NEVER drop, ignore, or over-compress detailed services, tour itinerary points, package inclusions, or highlighted features provided in the user text.
       - Structure ALL provided services into an elegant "INCLUSIONS / HIGHLIGHTS / FEATURES" container card.
       - Each inclusion must have a neat visual bullet point or minimalist icon indicator (e.g. tent for staycation, fork/spoon for meals, campfire icon, boat/speed boat icon, safari vehicle icon, kayak/sports icon).
       - Maintain clean, readable, spaced typography for all inclusion items.

    3. PROMOTIONAL PRICE BADGES & OFFER LABELS:
       - Highlight pricing, discounts, and currency figures inside a dedicated high-visibility badge (e.g. bright rounded pill badge, circular price seal, or starburst sticker like "$680 PER PERSON", "380 AED", "50% OFF").
       - Accompany the price with any group/audience terms mentioned (e.g., "PER PERSON", "FOR 2 PEOPLE", "IDEAL FOR FAMILIES, FRIENDS & GROUPS").

    4. CIRCULAR MEDALLION & ACTIVITY PHOTO CUTOUTS:
       - When supporting/secondary activity or destination photos exist, composite them into sleek circular frames or rounded medallion cutouts with crisp white, gold, or accent border strokes (overlapping naturally with the main hero composition, exactly like high-end travel agency flyers).
       - Maintain visual depth: circular medallions can slightly overlap the background or container panel with soft realistic drop shadows.

    5. DEDICATED FOOTER CONTACT STRIP:
       - Place all booking and contact channels (WhatsApp icon + number, website, email, booking handle) cleanly inside a dedicated horizontal footer banner strip across the bottom.
       - Ensure contact numbers and web addresses from the user prompt are rendered clearly and prominently.
    `
    : "";
  const carouselSection = isCarousel
    ? `
    ═══════════════════════════════════════════
    CAROUSEL SLIDE VISUAL DIVERSITY (MANDATORY)
    ═══════════════════════════════════════════
    This design is part of a multi-slide carousel. To prevent slides from looking like identical "copy-paste" templates, you MUST apply distinct layouts, alignments, and background arrangements.
    
    1. EXTREME COMPOSITION VARIETY:
       - Every slide must use a different structure in its "layout_map" elements.
       - Place the headline, supporting text, and main subject in different regions and coordinates (bbox_percent) across different slides. Do NOT place text and subjects in the exact same spot on consecutive slides.
       - Align with the slide's planned composition type (e.g. left-aligned split, right-aligned split, centered-hero, diagonal flow, or top/bottom heavy split).
       
    2. BACKGROUND ALTERNATION & DEPTH:
       - Vary the background style. Use diagonal split colors on one slide, translucent glass panels/container cards on another, solid colors with abstract shapes on a third, and soft gradients on a fourth.
       - Do not draw the exact same background gradients and central subjects for every slide. Alternate between close-up shots of details/props and wider compositions.
       
    3. BRAND CONSISTENCY:
       - Maintain consistency through brand colors, logo placement (anchor and position can remain stable or move predictably, but logo itself must be identical), and typeface vibes.
    `
    : "";

  return `
    ${archetypeSection}

    ═══════════════════════════════════════════
    CREATIVE MODE & NO-REFERENCE REVOLUTION
    ═══════════════════════════════════════════

    If the user DOES NOT provide any style reference images, you MUST enter "SUPERCREATIVE MODE":
    - BAN generic, flat, or boring "infographic" layouts (e.g., no 3-column structured layouts, no static subjects sitting plainly on flat backgrounds).
    - EMULATE 2026 HIGH-END BEHANCE/PINTEREST AESTHETICS:
      * Asymmetrical, dynamic compositions.
      * Extreme depth of field (Z-depth layering where elements float in 3D space, casting soft realistic shadows).
      * "Breaking the frame" — subjects extending beyond implied boundaries or interacting directly with typography.
      * Kinetic typography — text that feels like a physical object in the scene (glowing, 3D extruded, wrapped around objects).
    - If no specific subject is provided, invent a highly cinematic, conceptual, or abstract background that perfectly matches the brand's style context (e.g., levitating geometric platforms, moody studio lighting, dynamic speed trails).
    - You MUST document your bold creative decision in the "design_composition.overall_style" and "notes" fields. Give the user a masterpiece, not a template.

    VISUAL QUALITY OVER TEXT QUANTITY:
    - Great design is mostly visual. Text is supporting, not the hero.
    - DEFAULT to minimal text even if the user provides long content.
    - If user provides long paragraphs, your job is to SUMMARIZE into a clean, marketing-ready layout.

    HEADLINE COMPRESSION INTELLIGENCE:
    - If the headline exceeds 6 words or feels like multiple ideas combined, SPLIT IT INTO HIERARCHY:
      * Primary headline: The MAIN offer/hook (short, punchy, 2-4 words max)
      * Secondary headline: Supporting context, benefit, or sub-message (optional, smaller)
    - NEVER leave long single-line headlines without visual hierarchy or contrast.
    - Supporting text does NOT need to be explicitly provided by user — you can generate it based on context.

    TYPOGRAPHY HIERARCHY ENFORCEMENT:
    - Headlines MUST have dramatic visual treatment to stand out:
      * Size contrast: headline must be at least 2x the size of supporting text
      * Weight contrast: headline bold/black, supporting text medium/regular
      * Effect contrast: headline has glow/3D/shadow, supporting text is flat
      * Position contrast: headline dominates upper/mid area, supporting below
    - If all text looks the same size/weight/effect → the design lacks hierarchy → FAIL.

    ═══════════════════════════════════════════
    CREATIVE MODE (HIGH-IMPACT AD DESIGN)
    ═══════════════════════════════════════════
    You are now in Creative Mode, channeling the super creative energy of Pinterest graphic designs like vibrant promo flyers, dynamic app ads, and bold posters. Go beyond standard templates — draw from 2026 trends like nonconformity, tactile paper textures, glassmorphism, 3D floating props, and retro-futurism.
    
    Before structuring the JSON, independently brainstorm original ideas — generate 2-3 unique twists on the user's concept. Select the most impactful one, explaining your creative rationale briefly in the JSON's "notes" field.
    
    STYLE:
    - MANDATORY LAYOUT UNIQUENESS: Ban standard centered templates (like simple top-headline + middle-subject + bottom-logo stacks). Calculate custom, non-repetitive layout_map coordinates for every design. Create asymmetrical layouts by shifting elements offset (e.g., split columns, diagonal groupings, or overlapping boundaries).
    - Amp up dramatic composition with depth, high contrast, and visual flow (e.g., diagonal swooshes, asymmetric balances, radial energy bursts, and collage clusters).
    - Fuse real-life photos with graphic elements: overlay bold text on dynamic people in action poses, product close-ups, or illustrative motifs.
    - Build a razor-sharp hierarchy: 1 hero headline, 1 key benefit/offer line, and 1 powerhouse CTA.

    5-PLANE Z-DEPTH LAYER ARCHITECTURE (MANDATORY):
    - Plane 1 (Background): Subtle texture / ambient lighting gradient / studio backdrop.
    - Plane 2 (Shadows / Ambient Occlusion): Contact shadows or glowing halos casting onto plane 1.
    - Plane 3 (Midground Cards / Shapes): Frosted glass panel, paper cutout, or geometric container card (z_index 5-9).
    - Plane 4 (Hero Subject Cutout): Primary person/product cutout overlapping Plane 3 (z_index 10-14).
    - Plane 5 (Foreground Overlays & Kinetic Text): Bold 3D headline typography, floating props, light sparkles, and CTA badge (z_index 15+).

    CREATIVE WITHOUT PROMOS (DEFAULT):
    - If no explicit promo/price/discount, unleash creativity via self-directed ideation:
      * Explosive typography systems (extreme scale contrast, kinetic/wavy text, shaped or 3D-extruded blocks, trend fonts).
      * Inventive compositions (asymmetry, photo cutouts framing text, multi-layer depth, cityscapes with floating elements).
      * Brand-consistent illustrations/abstract motifs.
      * Premium material treatments (glossy glass effects, embossed paper textures, metallic sheens) WITHOUT any sales stickers.
      * A dominant hero visual + clean CTA, evoking Pinterest's scroll-stopping appeal.

    PRIORITY / CONFLICT RULE:
    - If any other instruction would make the layout generic or low-energy, you must follow Creative Mode for composition/typography/art-direction decisions.
    - You MUST still obey: exact logo stamping, brand palette constraints, "no new facts", and "complexity must match the brand".

    ANTI-GENERIC TEMPLATE (CRITICAL):
    - Ban boring 'infographic' layouts — no default 3-column split layouts, numbered steps, or roadmap boxes unless explicitly requested.
    - Avoid wrapping everything in thick borders or rounded UI cards; opt for organic, flowing shapes with implied motion.
    - Stick to 1 strong hero area + 1 supporting visual zone + 1 CTA/footer.
    - Limit distinct text blocks to 2-4 total; aggressively condense user-provided explanations into punchy, ad-copy lines.
    - Embrace whitespace for breathing room, with massive type scale contrast and zero clutter.

    ${isSuperCreative ? `
    ═══════════════════════════════════════════
    NANO BANANA PRO — SUPERCREATIVE IMAGE MODE
    ═══════════════════════════════════════════
    Enter Nano Banana Pro SuperCreative Image Mode, channeling Southeast Asia's boldest commercial directors — dynamic human energy crashing through frame edges, products floating in cinematic 3D space, typographic elements living inside the scene, and layered z-depth.

    PREMIUM VISUAL DIRECTIVES:
    - Human subjects in high-energy poses that break, overlap, or bleed beyond frame boundaries.
    - Deep z-depth layering: foreground subject overlaps mid-ground type elements overlaps background scene — minimum 4 planes of depth.
    - Typography lives IN the composition as a 3D scene object — letters bend, glow, cast shadows, get overlapped.
    - Products, icons, and objects float in implied 3D perspective with motion trails.
    - Organic particle scatter: confetti, sparkles, coins, light rays naturally placed.
    - Promotional shape objects (pill badges, starburst seals) exist as physical scene elements.
    - Rim lighting on all human subjects, fill light sourced from nearest glowing object or product.
    - Composition split: 60% human energy zone / 40% information zone.
    - Subject always overlaps or breaks at least one text element.
    - CTA element bottom-center, high contrast, rounded pill form, physical object in scene.
    - Brand mark placement MUST respect brandContext.layout_details.logo_placement or referenceContext's logo placement.
    - Format: portrait 9:16 mobile-first bleed-edge boldness.
    ` : ""}
    ${carouselSection}
    ${flyerSection}
  `;
}

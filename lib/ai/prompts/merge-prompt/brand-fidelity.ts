export const brandFidelityPrompt = `
    ═══════════════════════════════════════════
    🚨 BRAND STYLE FIDELITY — MOST IMPORTANT RULE
    ═══════════════════════════════════════════

    The generated design MUST look like it was made by the SAME designer who
    made the brand's existing designs. It must feel like part of the same series.

    YOU MUST MATCH THESE EXACTLY FROM THE BRAND CONTEXT:

    1. BACKGROUND TYPE: If brand uses light/white/cream backgrounds → use light bg.
       If brand uses dark backgrounds → use dark bg. NEVER switch light↔dark.

    2. DIMENSIONAL QUALITY: If brand is photo-based/flat/2D → keep it photo-based/flat.
       Do NOT add 3D floating elements, glassmorphism, or fake renders to a flat brand.
       Only use 3D if the brand's own designs use 3D.

    3. SUBJECT TREATMENT: If brand uses real photos of people → use real photo style.
       Do NOT switch to illustrated people, 3D renders, or silhouettes.
       If brand shows women → don't randomly use men (unless the user's prompt specifies).

    4. COLOR TEMPERATURE: If brand is warm (cream, gold, olive) → stay warm.
       If brand is cool (teal, blue, dark) → stay cool. NEVER change the temperature.

    5. LAYOUT STRUCTURE: If brand uses centered-hero with person on right → do that.
       If brand uses asymmetric two-column → do that. Match the spatial structure.

    6. DECORATIVE ELEMENTS: Only use decorative elements that appear in the brand's
       existing designs. If brand uses simple lines → use simple lines.
       Do NOT add sparkles, floating coins, calendar icons, badges, or 3D cards
       unless the brand's own designs have those.

    7. SUBJECT BACKGROUND: Check "subject_background" in brand context.
       - If "bg-removed-cutout" -> use clean cutout subjects on the design background.
       - If "full-scene-with-bg" -> show subjects in their natural environment/scene.
       - NEVER switch between these unless the user explicitly asks.

    SELF-CHECK BEFORE OUTPUT:
    - Would the brand owner look at this and say "yes, this looks like my brand"?
    - Does the background color/type match?
    - Does the dimensional quality match (flat vs 3D)?
    - Does the mood and energy match?
    - Does the subject background treatment match (cutout vs full scene)?
    - If ANY of these fail, REDO your JSON to match the brand.
`;

export const imageInputsPrompt = `
    ═══════════════════════════════════════════
    IMAGE INPUTS (ABSOLUTE REQUIREMENTS)
    ═══════════════════════════════════════════

    The image model will receive image_input in this order:
    1) Brand Logo image (official logo) — ALWAYS present
    2) Optional Character / Human / Main Subject image (if the user uploaded one)
    3) Optional style reference images (if the user uploaded any)

    YOU MUST enforce ALL of the following:
    - The final design MUST visibly include the EXCACT brand logo provided.
      - Never omit the logo.
      - Never crop the logo.
      - Never redraw, type out, or redesign the logo.
      - Keep the logo readable, correct shape, and clean edges.
      - Preserve logo colors exactly.
      - The model tends to hallucinate logos; you must explicitly instruct the generator to stamp the exact input image #1 without any aesthetic changes.
    - If a Character / Human image is provided:
      - Treat it as the PRIMARY foreground subject.
      - Preserve the person's identity, pose, clothing silhouette, and key facial features as closely as possible.
      - Integrate the subject cleanly into the brand layout (professional cutout/composite look; no messy artifacts).
    - If style reference images are provided, you MUST use them as PRIMARY DESIGN GUIDANCE.
      - CAREFULLY STUDY every reference image before generating your JSON.
      - Describe in your output what you observe: layout type, element positioning,
        color usage, decorative motifs, typography style, depth/dimension, and mood.
      - Your output design MUST visually resemble the reference images in structure.
      - If you ignore references, the output is WRONG. The user chose them deliberately.
      - Use them for style, layout, composition, lighting, and motif.
      - Do NOT copy any text from reference images.
      - Do NOT recreate a competitor logo/brand from references.
    - Your OUTPUT JSON MUST include a layout_map element with id "logo".
      - The logo element must have explicit bbox_percent placement inside safe area.
`;

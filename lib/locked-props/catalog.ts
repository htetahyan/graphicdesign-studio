/**
 * Locked object photos. To add one:
 * 1. Drop a PNG in public/assets/locked-props/
 * 2. Append an entry below (id, file, triggers, label).
 * Prompts stay generic — do not add per-object essays in merge-prompt or gemini-image.
 */
export type LockedProp = {
  id: string;
  /** Filename under public/assets/locked-props/ */
  file: string;
  /** If any of these appear in the user prompt, attach this photo. */
  triggers: string[];
  /** Short name used in generic composite instructions */
  label: string;
  /** Glyphs already printed on the photo — never ask the model to redraw these */
  printedText?: string[];
};

export const LOCKED_PROPS: LockedProp[] = [
  {
    id: "myanmar-passport",
    file: "myanmar-passport.png",
    triggers: ["passport", "နိုင်ငံကူး"],
    label: "Myanmar passport cover",
    printedText: [
      "ပြည်ထောင်စုသမ္မတမြန်မာနိုင်ငံတော်",
      "နိုင်ငံကူးလက်မှတ်",
    ],
  },
];

export function matchLockedProps(prompt: string): LockedProp[] {
  const lower = prompt.toLowerCase();
  return LOCKED_PROPS.filter((asset) =>
    asset.triggers.some((trigger) => lower.includes(trigger.toLowerCase())),
  );
}

export function lockedPropsPlannerBlock(): string {
  if (LOCKED_PROPS.length === 0) return "";
  const catalog = LOCKED_PROPS.map(
    (asset) => `      - ${asset.label} (id: ${asset.id}; triggers: ${asset.triggers.join(", ")})`,
  ).join("\n");
  return `
    LOCKED OBJECT PHOTOS (OPT-IN BY USER WORDS ONLY):
    When the user explicitly names an object in this catalog, a photograph is supplied as a locked_prop image input.
    The execution plan MUST treat it as that photograph composited into the scene (perspective, rotation, lighting, shadow allowed).
    FORBIDDEN for every locked object: redrawing it, generating lettering on it, replacing seals/emblems with the brand logo, gold-foil or embossed type drawn by the model.
    Do NOT insert a catalog object unless the user named it.

    Catalog:
${catalog}
`
}

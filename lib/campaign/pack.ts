export const CAMPAIGN_FORMATS = [
  { key: "feed_square", label: "Feed 1:1", aspectRatio: "1:1", promptHint: "square social feed post" },
  { key: "feed_portrait", label: "Feed 4:5", aspectRatio: "4:5", promptHint: "portrait Instagram feed post" },
  { key: "story", label: "Story 9:16", aspectRatio: "9:16", promptHint: "full-bleed vertical story / Reel cover" },
  { key: "cover", label: "Cover 16:9", aspectRatio: "16:9", promptHint: "wide cover / YouTube / Facebook cover" },
] as const;

export type CampaignFormatKey = (typeof CAMPAIGN_FORMATS)[number]["key"];

export const DEFAULT_CAMPAIGN_FORMATS: CampaignFormatKey[] = [
  "feed_square",
  "feed_portrait",
  "story",
  "cover",
];

export const PACK_CREDIT_DISCOUNT = 0.8;

export function formatByKey(key: string) {
  return CAMPAIGN_FORMATS.find((f) => f.key === key);
}

export function computeAssetCost(opts: {
  speed?: "slow" | "normal";
  quality?: "normal" | "hd" | "2k" | "4k";
}) {
  const speed = opts.speed || "normal";
  const quality = opts.quality || "hd";
  const speedCost = speed === "slow" ? 7 : 10;
  const qualityCost = quality === "4k" ? 10 : quality === "2k" ? 5 : quality === "hd" ? 2 : 0;
  const rawCost = speedCost + qualityCost;
  const minRequiredCredits = quality === "2k" || quality === "4k" ? 7 : 4;
  return Math.max(rawCost, minRequiredCredits);
}

export function computePackCost(opts: {
  formatCount: number;
  includeCarousel: boolean;
  slideCount?: number;
  speed?: "slow" | "normal";
  quality?: "normal" | "hd" | "2k" | "4k";
}) {
  const perAsset = computeAssetCost(opts);
  const discounted = Math.max(3, Math.round(perAsset * PACK_CREDIT_DISCOUNT));
  const slides = opts.includeCarousel ? Math.max(2, Math.min(opts.slideCount || 4, 6)) : 0;
  const assetCount = opts.formatCount + slides;
  return { perAsset: discounted, assetCount, total: discounted * assetCount, slides };
}

export function buildPackPrompt(opts: {
  brief: string;
  offer?: string | null;
  headline?: string | null;
  ctaText?: string | null;
  formatHint: string;
  brandLocks?: {
    lockedColors?: string[] | null;
    lockedFonts?: string[] | null;
    doNotUse?: string | null;
  };
}) {
  const lines = [
    `Create a finished marketing design for this campaign.`,
    `Format: ${opts.formatHint}.`,
    `Brief: ${opts.brief}`,
  ];
  if (opts.offer) lines.push(`Offer / promo: ${opts.offer}`);
  if (opts.headline) lines.push(`Headline (render exactly): ${opts.headline}`);
  if (opts.ctaText) lines.push(`CTA (render exactly): ${opts.ctaText}`);
  const colors = opts.brandLocks?.lockedColors?.filter(Boolean) ?? [];
  if (colors.length) lines.push(`BRAND LOCK — use ONLY these colors: ${colors.join(", ")}.`);
  const fonts = opts.brandLocks?.lockedFonts?.filter(Boolean) ?? [];
  if (fonts.length) lines.push(`BRAND LOCK — typography feel: ${fonts.join(", ")}.`);
  if (opts.brandLocks?.doNotUse) lines.push(`Do not use: ${opts.brandLocks.doNotUse}.`);
  lines.push("Keep visible text short. If the brief is Burmese, all on-image text must be correct Burmese Unicode.");
  return lines.join("\n");
}

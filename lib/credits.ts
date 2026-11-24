/** Generation credit prices. Do not change these values without a pricing review. */

export function computeGenerationCredits(opts: {
  speed?: "slow" | "normal";
  quality?: "normal" | "hd" | "2k" | "4k";
  modelTier?: "normal" | "pro";
  carouselMode?: boolean;
  slideCount?: number;
}) {
  const speed = opts.speed || "normal";
  const quality = opts.quality || "normal";
  const modelTier = opts.modelTier || "normal";
  const speedCost = speed === "slow" ? 7 : 10;
  const qualityCost = quality === "4k" ? 10 : quality === "2k" ? 5 : quality === "hd" ? 2 : 0;
  const modelCost = modelTier === "pro" ? 5 : 0;
  const rawCost = speedCost + qualityCost + modelCost;
  const minRequiredCredits = quality === "2k" || quality === "4k" ? 7 : 4;
  const singleCost = Math.max(rawCost, minRequiredCredits);
  const slides = opts.carouselMode ? Math.max(1, opts.slideCount || 4) : 1;
  return {
    singleCost,
    totalCost: singleCost * slides,
  };
}

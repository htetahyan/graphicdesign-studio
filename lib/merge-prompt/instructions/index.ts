import { getRequirementsSection } from "./requirements";
import { getCreativeSection } from "./creative";
import { getTextRulesSection } from "./text-rules";
import { getOutputFormatJson } from "./format-json";
import { getOutputFormatContext } from "./format-context";
import { VisualStyleArchetype } from "./archetypes";

interface BuildInstructionParams {
  brandContext: any;
  cleanedUserPrompt: string;
  referenceContext: any | null;
  creativeMode: boolean;
  referenceInfluence: "normal" | "high";
  aspectRatio: string;
  customHeadline?: string;
  ctaText?: string;
  isCarousel?: boolean;
  hasCharacterImage?: boolean;
  hasReferenceImages?: boolean;
  visualStyle?: VisualStyleArchetype;
  designType?: "graphic_design" | "flyer";
  flyerStyle?: string;
  isEdit?: boolean;
}

export function buildSystemInstruction({
  brandContext,
  cleanedUserPrompt,
  referenceContext,
  creativeMode,
  referenceInfluence,
  aspectRatio,
  customHeadline,
  ctaText,
  isCarousel = false,
  hasCharacterImage = false,
  hasReferenceImages = false,
  visualStyle,
  designType = "graphic_design",
  flyerStyle,
  isEdit = false,
}: BuildInstructionParams): string {
  const requirements = getRequirementsSection(customHeadline, ctaText, hasCharacterImage, hasReferenceImages, designType);
  const creative = isEdit
    ? `EDIT MODE:\nThe attached image is the current finished design. Plan a revision of that image. Change only the requested details. Keep the same layout, subjects, logo, colors, and every line of text the user did not mention. Do not invent a new concept or a new composition.`
    : getCreativeSection(creativeMode, !!referenceContext, isCarousel, visualStyle, designType, flyerStyle);
  const textRules = getTextRulesSection();
  const formatJson = getOutputFormatJson(aspectRatio);
  const formatContext = getOutputFormatContext(
    brandContext,
    referenceContext,
    cleanedUserPrompt,
    referenceInfluence,
    aspectRatio,
    isCarousel,
    creativeMode,
  );

  return [
    requirements,
    creative,
    textRules,
    formatJson,
    formatContext,
  ].join("\n");
}

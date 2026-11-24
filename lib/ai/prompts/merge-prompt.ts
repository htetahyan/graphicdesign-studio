import { imageInputsPrompt } from "./merge-prompt/image-inputs";
import { brandFidelityPrompt } from "./merge-prompt/brand-fidelity";
import { creativeModePrompt } from "./merge-prompt/creative-mode";
import { textRulesPrompt } from "./merge-prompt/text-rules";
import { getOutputFormatPrompt } from "./merge-prompt/output-format";
import { getReferenceRulesPrompt } from "./merge-prompt/reference-rules";

export function buildMergePrompt(
    brandContext: any,
    userPrompt: string,
    referenceContext: any | null = null,
    creativeMode: boolean = false,
    referenceInfluence: "normal" | "high" = "normal",
    aspectRatio: string = "4:3",
): string {
    return `
    You are an expert Burmese Graphic Design AI for the Myanmar market.
    Your task is to generate a hyper-detailed, execution-ready JSON prompt for the Nano Banana image model.

    ${imageInputsPrompt}

    ${brandFidelityPrompt}

    ${creativeMode ? creativeModePrompt : ""}

    ${textRulesPrompt}

    ${getOutputFormatPrompt(aspectRatio)}

    ═══════════════════════════════════════════
    CONTEXT
    ═══════════════════════════════════════════

    ⚠️ BEFORE EXTRACTING HEADLINE FROM USER REQUEST:
    Remember: Pick the MAIN OFFER/SERVICE, never rhetorical questions like "အခက်အခဲလား?"
    Look for: "Free X", "Special Offer", Event Names, Service Names
    
    Aspect Ratio: ${aspectRatio}
    Brand Context: ${JSON.stringify(brandContext)}
    Reference Images Context (optional): ${referenceContext ? JSON.stringify(referenceContext) : "none"}
    User Request: ${userPrompt}

    ${(() => {
            const contactInfo = brandContext?.contact_info;
            if (!contactInfo) return "";

            const hasContactInPrompt = /\d{2,}[-\s]?\d{3,}|\.com|@|facebook|viber|telegram/i.test(userPrompt);
            const isShortPrompt = userPrompt.length < 200;

            if (isShortPrompt && !hasContactInPrompt) {
                const parts: string[] = [];
                if (contactInfo.phone_numbers?.length) parts.push(`Phone: ${contactInfo.phone_numbers.join(" / ")}`);
                if (contactInfo.website) parts.push(`Website: ${contactInfo.website}`);
                if (contactInfo.social_media?.length) parts.push(`Social: ${contactInfo.social_media.join(", ")}`);
                if (contactInfo.email) parts.push(`Email: ${contactInfo.email}`);
                if (contactInfo.address) parts.push(`Address: ${contactInfo.address}`);

                if (parts.length > 0) {
                    return `
    BRAND CONTACT INFO (auto-injected from brand profile — include in footer/bottom area):
    ${parts.join("\\n    ")}
    Place this contact info in a small footer section at the bottom of the design,
    matching the brand's existing contact layout style.
          `;
                }
            }
            return "";
        })()}

    ${getReferenceRulesPrompt(referenceContext, referenceInfluence)}
  `;
}

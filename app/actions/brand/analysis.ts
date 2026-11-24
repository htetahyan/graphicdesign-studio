import "server-only";

import { analyzeBrandImages, analyzeBrandImagesStyleOnly } from "@/lib/gemini";
import { fetchInspirationTemplates } from "../inspirations";
import { logger } from "@/lib/logger";

export async function processBrandAnalysis(params: {
  userId: string;
  images: File[];
  referenceImages: File[];
  logo: File | null;
  designSource: string;
  industry: string | null;
  brandVoice: string | null;
  manualDescription: string | null;
  preferredCtas: string | null;
  inspirationTemplateIds: string[] | null;
}) {
  // designSource is stored on the brand later. It does not choose the analyzer:
  // previous designs supply color and text, inspiration supplies layout and style.
  const {
    userId, images, referenceImages, logo, industry,
    brandVoice, manualDescription, preferredCtas, inspirationTemplateIds,
  } = params;

  let styleContext: any = null;
  const analysisBuffers: { buffer: Buffer; mimeType: string }[] = [];
  let logoAnalysisBuffer: { buffer: Buffer; mimeType: string } | null = null;

  try {
    if (!logo || logo.size === 0) throw new Error("Logo ကို မဖြစ်မနေ တင်ပါ (Logo required)");

    const referenceBuffers: { buffer: Buffer; mimeType: string }[] = [];
    for (const img of images) {
      if (img.size > 0) analysisBuffers.push({ buffer: Buffer.from(await img.arrayBuffer()), mimeType: img.type });
    }
    for (const img of referenceImages) {
      if (img.size > 0) referenceBuffers.push({ buffer: Buffer.from(await img.arrayBuffer()), mimeType: img.type });
    }

    if (logo && logo.size > 0) {
      logoAnalysisBuffer = { buffer: Buffer.from(await logo.arrayBuffer()), mimeType: logo.type };
      analysisBuffers.unshift(logoAnalysisBuffer);
    }

    if (analysisBuffers.length > 0) {
      logger.info("Analyzing previous brand images for color and text", { userId, imageCount: analysisBuffers.length });
      styleContext = await analyzeBrandImages(analysisBuffers);
    } else if (manualDescription || preferredCtas) {
      logger.info("Creating brand context from manual description", { userId });
      styleContext = getFallbackStyleContext(industry, brandVoice, manualDescription, preferredCtas);
    }

    if (referenceBuffers.length > 0) {
      logger.info("Analyzing inspiration uploads for layout and style only", { userId, imageCount: referenceBuffers.length });
      const layoutOnly = await analyzeBrandImagesStyleOnly(referenceBuffers);
      styleContext = applyLayoutAndStyleOnly(
        styleContext || getFallbackStyleContext(industry, brandVoice, manualDescription, preferredCtas),
        layoutOnly,
      );
    }

    if (inspirationTemplateIds && inspirationTemplateIds.length > 0) {
      const allTemplates = await fetchInspirationTemplates();
      const templates = allTemplates.filter((t) => inspirationTemplateIds.includes(t.id));
      if (templates.length > 0) {
        styleContext = applyLayoutAndStyleOnly(
          styleContext || getFallbackStyleContext(industry, brandVoice, manualDescription, preferredCtas),
          extractInspirationStyle(templates),
        );
      }
    }

    if (analysisBuffers.length === 1 && logoAnalysisBuffer) {
      try {
        const logoContext = await analyzeBrandImages([logoAnalysisBuffer]);
        const logoColors = logoContext?.colors;
        if (logoColors) {
          const ex = styleContext?.colors;
          const isDefault = ex && ex.primary === "#3B82F6" && ex.secondary === "#6366F1" && ex.accent === "#F59E0B";
          if (!ex || isDefault) {
            styleContext = {
              ...(styleContext || getFallbackStyleContext(industry, brandVoice, manualDescription, preferredCtas)),
              colors: { ...ex, ...logoColors },
              _logoPalette: true,
            };
          }
        }
      } catch (e) {
        logger.warn("Logo color analysis failed", { userId, error: e });
      }
    }
  } catch (error: any) {
    throw new Error(`Brand အချက်အလက် စစ်ဆေးမှု မအောင်မြင်ပါ: ${error.message || "Unknown error"}`);
  }

  return styleContext;
}

function getFallbackStyleContext(ind: string | null, voice: string | null, desc: string | null, ctas: string | null) {
  const inds: Record<string, string> = {
    restaurant: "Food & Beverage Modern", retail: "Retail Commercial",
    beauty: "Beauty & Wellness", service: "Service Professional"
  };
  const ctaList = ctas ? ctas.split(/[,\n]/).map((s) => s.trim()).filter(Boolean) : [];
  return {
    style: inds[ind || ""] || "Modern Commercial Design",
    curated_aesthetic_archetype: ind === "restaurant" ? "3d_studio" : ind === "beauty" ? "glassmorphism" : "editorial",
    complexity: "moderate",
    text_density: "medium",
    dimensional_quality: {
      type: "photo-composite",
      has_floating_elements: true,
      shadow_style: "soft-drop",
      depth_layers: 3,
      material_feel: "glossy",
    },
    colors: { primary: "#3B82F6", secondary: "#6366F1", accent: "#F59E0B", background: "#FFFFFF", glow_rim_color: "#60A5FA" },
    layout_patterns: ind === "restaurant" ? "Appetizing food-focused layouts with high-impact hero imagery" : "Clean Pinterest-inspired dynamic layouts with high contrast and layered depth",
    typography: {
      feel: voice || "Professional and approachable",
      burmese_style: "Clear readable Burmese with modern sans-serif",
      weight: "Bold for headlines, regular for body",
      text_effect: "glow",
      headline_scale: "large",
    },
    brand_visual_dna: {
      summary: desc || `A ${ind || "business"} brand with a ${voice || "professional"} style.`,
      distinctive_signatures: ["High-contrast hero visual placement", "Clean brand logo anchor", "Layered card container design"],
      curated_aesthetic_archetype: ind === "restaurant" ? "3d_studio" : ind === "beauty" ? "glassmorphism" : "editorial",
      creative_execution_rationale: "Position the hero subject in the main foreground zone with multi-layer depth, using high contrast typography and clean brand colors.",
    },
    extracted_texts: { headlines: ctaList, slogans: desc ? [desc.substring(0, 100)] : [], ctas: ctaList },
    call_to_actions: {
      common_text: ctaList.length ? ctaList : ["Shop Now", "Contact Us"],
      button_style: "Rounded with brand colors", placement: "Bottom or center-right",
    },
    brand_summary: desc || `A ${ind || "business"} brand with ${voice || "professional"} style.`,
    _manualInput: true,
  };
}

function withoutColorValues(value: unknown): string {
  return String(value || "")
    .replace(/#(?:[0-9a-fA-F]{3,8})\b/g, "")
    .replace(/\b(?:rgb|rgba|hsl|hsla)\([^)]*\)/gi, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

/** Keep brand colors and wording. Copy only layout and visual style from an inspiration analysis. */
function applyLayoutAndStyleOnly(brandContext: any, inspiration: any) {
  if (!inspiration) return brandContext;
  const next = { ...brandContext };
  const style = withoutColorValues(inspiration.style);
  const layout = withoutColorValues(inspiration.layout_patterns);
  if (style) next.style = style;
  if (layout) next.layout_patterns = layout;
  if (inspiration.complexity) next.complexity = inspiration.complexity;
  if (inspiration.text_density) next.text_density = inspiration.text_density;
  if (inspiration.composition) next.composition = inspiration.composition;
  if (inspiration.element_types) next.element_types = inspiration.element_types;
  if (inspiration.decorative_structure) next.decorative_structure = inspiration.decorative_structure;
  if (inspiration.dimensional_quality) next.dimensional_quality = inspiration.dimensional_quality;
  if (inspiration.lighting) next.lighting = inspiration.lighting;
  const scale = inspiration.typography_composition?.headline_scale;
  const effect = inspiration.typography_composition?.text_effect;
  if ((scale || effect) && next.typography) {
    next.typography = {
      ...next.typography,
      ...(scale ? { headline_scale: scale } : {}),
      ...(effect ? { text_effect: effect } : {}),
    };
  }
  return next;
}

function extractInspirationStyle(templates: any[]) {
  const styles = templates
    .map((t) => withoutColorValues(t.designData?.design_core?.visual_style))
    .filter(Boolean);
  const layouts = templates.map((t) => {
    const composition = t.designData?.visual_composition;
    const typeStyle = t.designData?.typography_and_text;
    const overlays = Array.isArray(composition?.graphic_overlays?.elements)
      ? composition.graphic_overlays.elements.map((item: { type?: string }) => item?.type).filter(Boolean).join(", ")
      : "";
    const headlineStyle = withoutColorValues(typeStyle?.headlines?.main_title?.style);
    const listStyle = withoutColorValues(typeStyle?.informational_list?.style);
    return [
      composition?.hero_element?.placement && `hero sits ${composition.hero_element.placement}`,
      overlays && `overlay shapes: ${overlays}`,
      headlineStyle && `headline treatment: ${headlineStyle}`,
      listStyle && `list layout: ${listStyle}`,
    ].filter(Boolean).join("; ");
  }).filter(Boolean);

  return {
    style: styles.join(", "),
    layout_patterns: layouts.join(" | "),
    complexity: "moderate",
    text_density: "medium",
  };
}

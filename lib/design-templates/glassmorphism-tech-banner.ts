import { DesignTemplate } from "./types";

export const glassmorphismTechBannerTemplate: DesignTemplate = {
  id: "glassmorphism-tech-banner",
  name: "Modern Glassmorphism Tech",
  nameMy: "ခေတ်မှီ ဖန်ကြည်ရောင် နည်းပညာဒီဇိုင်း",
  description:
    "Sleek modern layout featuring translucent frosted glass panels, vibrant neon ambient glows, and clean typography.",
  descriptionMy:
    "ကြည်လင်သော Glassmorphism ကဒ်ပြားများ၊ Neon Glow များနှင့် ခေတ်မှီ နည်းပညာစတိုင် ဂရပ်ဖစ်ဒီဇိုင်း။",
  thumbnailStyle: "commercial-3d",
  defaultAspectRatio: "1:1",
  category: "educational",
  prompt: {
    design_composition: {
      lighting: "Vibrant neon backlight bleed through frosted glass container panel",
      perspective: "Layered 3/4 depth perspective",
      overall_style: "Modern Glassmorphism with translucent frosted blur panels",
    },
    raw_data_transcription: {
      contact_info: "{{contactInfo}}",
      all_prices_detected: [],
      all_programs_detected: ["{{services}}"],
      instruction: "Strictly use variable replacements for all text.",
    },
    visual_elements_detailed: {
      floating_props: [
        {
          item: "Translucent frosted 3D glass pill",
          position: "Floating top-right highlight",
        },
        {
          item: "Neon glowing particle dots",
          position: "Scattered in background plane",
        },
      ],
      background_layer: {
        elements: "Deep navy gradient with vibrant cyan and magenta ambient light glows",
        sky: "Dark ambient tech environment",
      },
      foreground_subject: {
        description: "Modern professional cutout or high-tech product showcase",
        pose: "Standing proudly beside the frosted glass info card",
        placement: "Foreground left-aligned",
      },
      graphic_shapes: {
        main_info_box: {
          color: "Translucent white with 1px light rim border and backdrop blur",
          shape: "Large rounded frosted glass card",
        },
        program_pills: {
          color: "Brand Accent Neon Glow",
          shape: "Rounded glass pills",
          alignment: "Horizontal row inside card",
        },
      },
    },
    typography_specifications: {
      headlines: {
        main: {
          text: "{{headline}}",
          style: "Clean crisp white typography with subtle drop shadow for depth",
        },
      },
      content_blocks: [
        {
          category: "Key Highlights",
          items: [
            {
              item_name: "{{features}}",
              price: "",
              duration: "",
              style: "High-contrast clean sans-serif text on glass panel",
            },
          ],
        },
      ],
      footer_or_contact: {
        text: "{{contactInfo}}",
        style: "Subtle glowing contact pill button at bottom",
      },
    },
    color_and_gradient_details: {
      primary: "USE BRAND PRIMARY COLOR",
      secondary: "USE BRAND SECONDARY COLOR",
      accent_color: "USE BRAND ACCENT COLOR",
      instruction: "Adapt to user brand color palette completely.",
    },
  },
  variables: {
    headline: "ခေတ်မှီဆန်းသစ်သော နည်းပညာဝန်ဆောင်မှု",
    features: ["⚡ မြန်ဆန်သော ဝန်ဆောင်မှု", "🔒 100% လုံခြုံစိတ်ချရမှု"],
    services: ["Tech Solution", "Cloud Infrastructure"],
    contactInfo: "📞 09-123456789 | www.brand.com",
  },
};

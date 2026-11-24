import { DesignTemplate } from "./types";

export const pinterestEditorialPromoTemplate: DesignTemplate = {
  id: "pinterest-editorial-promo",
  name: "Pinterest Editorial Poster",
  nameMy: "Pinterest အက်ဒီတိုရီယယ် ပိုစတာ",
  description:
    "High-fashion magazine poster with dynamic kinetic typography, split background tones, and cut-out hero interaction.",
  descriptionMy:
    "အမိုက်စား မဂ္ဂဇင်းစတိုင် Kinetic Typography နှင့် အနုပညာဆန်သော စပလစ် နောက်ခံ ဂရပ်ဖစ်ဒီဇိုင်း။",
  thumbnailStyle: "commercial-3d",
  defaultAspectRatio: "9:16",
  category: "educational",
  prompt: {
    design_composition: {
      lighting: "Soft directional studio light with subtle warm film grain finish",
      perspective: "Asymmetrical split-screen grid layout",
      overall_style: "Pinterest Editorial Kinetic Poster with multi-plane Z-depth layering",
    },
    raw_data_transcription: {
      contact_info: "{{contactInfo}}",
      all_prices_detected: [],
      all_programs_detected: ["{{services}}"],
      instruction: "Strictly use variable replacements for all text and numbers.",
    },
    visual_elements_detailed: {
      floating_props: [
        {
          item: "Minimal hairline rule lines",
          position: "Framing top and bottom corners",
        },
        {
          item: "Floating issue edition tag",
          position: "Top right badge",
        },
      ],
      background_layer: {
        elements: "Split color tone (matte noir background with rich beige/gold diagonal block)",
        sky: "Warm studio shadow gradient",
      },
      foreground_subject: {
        description: "User-uploaded character or stylish model in smart attire",
        pose: "Dynamic pose slightly overlapping the hero headline for 3D Z-depth effect",
        placement: "Center-right foreground",
      },
      graphic_shapes: {
        main_info_box: {
          color: "Brand Accent Color",
          shape: "Clean pill card container",
        },
        program_pills: {
          color: "Secondary Brand Palette",
          shape: "Rounded oblong badges",
          alignment: "Asymmetric stack",
        },
      },
    },
    typography_specifications: {
      headlines: {
        main: {
          text: "{{headline}}",
          style: "Oversized bold kinetic editorial typography wrapping around subject",
        },
      },
      content_blocks: [
        {
          category: "Program Features",
          items: [
            {
              item_name: "{{features}}",
              price: "",
              duration: "",
              style: "Clean high-contrast sans-serif inside information pill",
            },
          ],
        },
      ],
      footer_or_contact: {
        text: "{{contactInfo}}",
        style: "Clean serial-style minimal footer at bottom",
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
    headline: "အနာဂတ်အတွက် မြင့်မားသော ပညာရေးစနစ်",
    features: ["၁၀၀% ယုံကြည်စိတ်ချရမှု", "ခေတ်မှီသင်ရိုးညွှန်းတမ်း"],
    services: ["Special Training Program", "Global Certification"],
    contactInfo: "📞 09-987654321 | www.brand.com",
  },
};

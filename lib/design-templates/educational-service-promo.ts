import { DesignTemplate } from "./types";

export const educationalServicePromoTemplate: DesignTemplate = {
  id: "educational-service-promo",
  name: "Educational & Visa Services",
  nameMy: "ပညာရေးနှင့် ဗီဇာဝန်ဆောင်မှု",
  description:
    "Photo composite flyer with vivid graphic overlays, perfect for educational programs and services.",
  descriptionMy:
    "ပညာရေးနှင့် ဗီဇာဝန်ဆောင်မှုများအတွက် သင့်လျော်သော ဓာတ်ပုံနှင့် ဂရပ်ဖစ်ဒီဇိုင်း။",
  thumbnailStyle: "commercial-3d",
  defaultAspectRatio: "3:4",
  category: "educational",
  prompt: {
    design_composition: {
      lighting:
        "Bright studio lighting mixed with vibrant natural ambient light",
      perspective: "Eye-level straight-on dynamic composite layout",
      overall_style:
        "CRITICAL: ONLY USE THE DESIGN TEMPLATE'S STRUCTURAL LAYOUT AND COMPOSITION. DO NOT extract or use the specific phone numbers, raw text, or specific brand names from the template image. ALL colors must adapt to the user's provided brand style context. Photo Composite with Graphic Overlays.",
    },
    raw_data_transcription: {
      contact_info: "{{contactInfo}}",
      all_prices_detected: [],
      all_programs_detected: ["{{services}}"],
      instruction:
        "Do NOT extract raw text from reference image. Strictly use variable replacements for all text and numbers.",
    },
    visual_elements_detailed: {
      floating_props: [
        {
          item: "3D pen icon",
          position: "Attached floating on the top left of the main info box",
        },
        {
          item: "3D notebook icon",
          position:
            "Attached floating on the bottom right of the main info box",
        },
      ],
      background_layer: {
        elements:
          "Faded photographic collage relevant to context (e.g. elegant temple architecture) and subtle wave/flag motifs",
        sky: "Bright blue fading to white",
      },
      foreground_subject: {
        description:
          "Young confident Asian woman in a modern hoodie or smart casual attire",
        pose: "Smiling warmly, holding a passport holder and boarding pass or relevant documents",
        placement: "Foreground, prominently left-aligned",
      },
      graphic_shapes: {
        main_info_box: {
          color: "User Brand Primary Color (Fallback: Vibrant Red)",
          shape: "Large rounded rectangle with a slight dynamic tilt",
        },
        program_pills: {
          color: "User Brand Secondary Color (Fallback: Mustard/Gold)",
          shape: "Rounded oblong pills",
          alignment: "Horizontally aligned stack next to the main info box",
        },
      },
    },
    typography_specifications: {
      headlines: {
        main: {
          text: "{{headline}}",
          style:
            "Bold, highly legible prominent text applying the user's brand typography",
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
              style:
                "Clean white text with checkmarks or bullet points contained inside the main info box",
            },
          ],
        },
        {
          category: "Available Services",
          items: [
            {
              item_name: "{{services}}",
              price: "",
              duration: "",
              style: "Clean text inside the rounded oblong pills",
            },
          ],
        },
      ],
      footer_or_contact: {
        text: "{{contactInfo}}",
        style: "Clear, highly legible contact footer at the bottom",
      },
    },
    color_and_gradient_details: {
      primary: "USE BRAND PRIMARY COLOR",
      secondary: "USE BRAND SECONDARY COLOR",
      accent_color: "USE BRAND ACCENT COLOR",
      instruction:
        "Adapt to user brand color palette completely. The original colors are structural placeholders only.",
    },
  },
  variables: {
    headline: "ယုံကြည်စိတ်ချရသော ဝန်ဆောင်မှုဖြင့် အနာဂတ်ကို တည်ဆောက်ပါ",
    features: [
      "100% Visa Support",
      "စာမေးပွဲမဖြေရ",
      "လွယ်ကူမြန်ဆန်သော ဝန်ဆောင်မှု",
    ],
    services: [
      "Language School Program",
      "Culture Exchange Program",
      "Marketing Management",
    ],
    contactInfo: "📞 09-123456789 | www.example.com | 📍 Address",
  },
};

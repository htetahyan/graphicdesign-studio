import { DesignTemplate } from "./types";

export const realEstateArchvizTemplate: DesignTemplate = {
  id: "real-estate-archviz",
  name: "Luxury Real Estate ArchViz",
  nameMy: "ဇိမ်ခံအိမ်ရာ အိမ်ခြံမြေ",
  description:
    "High-End 3D Architectural Visualization showcasing luxury and premium lifestyle amenities.",
  descriptionMy:
    "ဇိမ်ခံအိမ်ရာများကို ဆွဲဆောင်မှုရှိစွာ ပြသသော 3D ကြော်ငြာဒီဇိုင်း။",
  thumbnailStyle: "professional-3d",
  defaultAspectRatio: "3:4",
  category: "commercial",
  prompt: {
    design_composition: {
      lighting:
        "Bright sunlight, clear vibrant outdoor lighting with realistic structural shadows",
      perspective:
        "Eye-level or slight low-angle architectural photography looking at the villa",
      overall_style:
        "CRITICAL: DO NOT use specific developer names, project names, or text from the reference template. Use ONLY the layout structure. Use user brand colors and styles. High-End 3D ArchViz, Luxurious, Peaceful, Modern.",
      layout_strategy:
        "Clear gradient sky occupies the top 60% for clean text and floating cards. Building occupies the bottom 40%.",
    },
    raw_data_transcription: {
      contact_info: "{{contactInfo}}",
      all_prices_detected: [],
      all_programs_detected: [],
      instruction:
        "Do NOT extract raw text from reference image. Use variable replacements.",
    },
    visual_elements_detailed: {
      floating_props: [
        {
          item: "Four vertical rounded-rectangle glass panels showcasing lifestyle amenities",
          position: "Floating in the top sky area above the building",
          style:
            "Soft white glow and subtle drop shadow to cleanly separate them from the sky background",
        },
      ],
      background_layer: {
        elements:
          "Clear, vibrant gradient sky indicating a perfect sunny day",
        sky: "Gradient from brand primary (or deep blue) fading downwards",
      },
      foreground_subject: {
        description:
          "Photorealistic 3D render of a modern luxury two-story villa. Contemporary geometric design featuring flat roofs, light concrete, and vertical wooden slatted panels. Includes landscaped front yard, paved street, parked luxury vehicles (e.g., dark SUV, luxury sedan), and a couple standing near the entrance for scale.",
        placement: "Bottom half of the composition",
      },
    },
    typography_specifications: {
      headlines: {
        main: {
          text: "{{headline}}",
          style:
            "Elegant serif font, large and centered at the top, high contrast with sky",
        },
        sub_headline: {
          text: "{{subHeadline}}",
          style:
            "Clean sans-serif subtitle placed directly below the main headline",
        },
      },
      content_blocks: [
        {
          category: "Amenities",
          items: [
            {
              item_name: "{{features}}",
              price: "",
              duration: "",
              style:
                "Clean bold label text centered inside each floating glass panel",
            },
          ],
        },
      ],
      footer_or_contact: {
        text: "{{contactInfo}}",
        style:
          "Bottom center, overlaid directly onto the street shadows. Clean sans-serif, using brand colors.",
      },
    },
    color_and_gradient_details: {
      primary: "USE BRAND PRIMARY OR ARCHITECTURE WHITE",
      secondary: "USE BRAND SECONDARY OR WOOD ACCENTS",
      background_gradient: "USE BRAND APPROPRIATE SKY GRADIENT",
      instruction:
        "Adapt overall tones to the user's brand identity while strictly maintaining a realistic luxury architecture feel.",
    },
  },
  variables: {
    headline: "MORE THAN A HOME",
    subHeadline: "A Complete Lifestyle",
    features: [
      "SPACIOUS VILLAS",
      "AMUSEMENT PARK",
      "PRIVATE POOL",
      "YOGA COURT",
    ],
    contactInfo: "LUXURY DEVELOPER | PREMIUM LIVING",
  },
};

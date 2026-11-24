export type ImageStyle =
  | "professional-3d"
  | "commercial-3d"
  | "vibrant-3d"
  | "corporate-flat"
  | "minimalist"
  | "modern"
  | "artistic";

export type AspectRatio = "1:1" | "4:3" | "16:9" | "9:16" | "3:4" | "3:2" | "4:5";

export interface DesignTemplate {
  id: string;
  name: string;
  nameMy: string;
  description: string;
  descriptionMy: string;
  thumbnailStyle: ImageStyle;
  defaultAspectRatio: AspectRatio;
  category:
    | "promotional"
    | "service"
    | "educational"
    | "commercial"
    | "event"
    | "social"
    | "product";
  previewImage?: string;
  prompt: {
    design_composition: {
      lighting: string;
      perspective: string;
      overall_style: string;
      layout_strategy?: string;
      layout_structure?: string;
    };
    raw_data_transcription?: {
      contact_info?: string;
      all_prices_detected: string[];
      all_programs_detected: string[];
      instruction?: string;
    };
    visual_elements_detailed: {
      floating_props: Array<{
        item: string;
        position?: string;
        style?: string;
        effect?: string;
        orientation?: string;
        pose?: string;
      }>;
      background_layer: {
        elements: string;
        sky?: string;
        visibility?: string;
      };
      foreground_subject: {
        description: string;
        pose?: string;
        attire?: string;
        placement?: string;
        treatment?: string;
      };
      graphic_shapes?: {
        main_info_box?: {
          color: string;
          shape: string;
          orientation?: string;
        };
        program_pills?: {
          color: string;
          shape: string;
          alignment: string;
        };
      };
    };
    typography_specifications: {
      headlines: {
        main?: {
          text: string;
          style: string;
          color?: string;
        };
        sub_headline?: {
          text: string;
          style: string;
          color?: string;
        };
      };
      content_blocks?: Array<{
        category: string;
        items: Array<{
          item_name: string;
          price: string;
          duration: string;
          style: string;
        }>;
        container_style?: string;
      }>;
      footer_or_contact?: {
        text: string;
        style: string;
      };
      footer_text?: {
        text?: string;
        style: string;
        alignment?: string;
      };
      feature_list?: {
        font: string;
        bullets: string;
        container: string;
        special_highlight?: string;
      };
    };
    color_and_gradient_details: {
      primary: string;
      secondary?: string;
      accent_color?: string;
      tertiary?: string;
      background_gradient?: string;
      instruction?: string;
    };
  };
  variables: {
    headline: string;
    subHeadline?: string;
    contactInfo?: string;
    services?: string[];
    prices?: string[];
    features?: string[];
    serviceName?: string;
    discountText?: string;
    productName?: string;
    eventName?: string;
    price1?: string;
  };
}

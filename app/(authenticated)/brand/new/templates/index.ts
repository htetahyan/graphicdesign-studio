

// InspirationTemplate interface - defines the structure for design templates
export interface InspirationTemplate {
  id: string;
  industryId: string;
  name: string;
  /** Path to the preview image — replace with your real assets */
  imageUrl: string;
  /**
   * Rich JSON metadata containing detailed design information
   */
  designData: {
    design_core: {
      type: string;
      industry: string;
      brand_name?: string;
      product_name?: string;
      visual_style: string;
      color_palette: {
        background: string;
        [key: string]: string | undefined;
      };
    };
    visual_composition?: {
      background_layer?: {
        elements: string;
      };
      hero_element?: {
        description: string;
        [key: string]: any;
      };
      [key: string]: any;
    };
    typography_and_text?: {
      [key: string]: any;
    };
  };
}

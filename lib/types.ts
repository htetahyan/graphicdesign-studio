export interface NanobannaPrompt {
    generation_settings?: {
        aspect_ratio?: string
        safe_area_padding_percent?: number
        text_language_priority?: string
        logo_placement?: string
    }
    layout_map?: {
        grid?: {
            type?: string
            columns?: number
            rows?: number
            gutter_percent?: number
            outer_margin_percent?: number
        }
        elements?: Array<{
            id: string
            role: string
            bbox_percent: { x: number; y: number; w: number; h: number }
            anchor?: string
            alignment?: string
            rotation_deg?: number
            z_index?: number
            notes?: string
        }>
    }
    design_composition: {
        overall_style: string
        layout_strategy: string // e.g., 'Multi-item Grid', 'Single Hero Focus'
        perspective: string
        lighting: string
        whitespace_usage?: string
        complexity_level?: string
    }
    visual_elements_detailed: {
        background_layer: {
            elements?: string
            description?: string
            complexity_note?: string
        }
        foreground_subject: {
            description: string
            pose?: string
            treatment?: string
        }
        floating_props?: Array<{
            item: string
            position: string
            style?: string
        }>
        decorative_elements?: string
    }
    typography_specifications: {
        text_volume?: string
        headlines: {
            [key: string]: any
            text?: string
            style?: string
            layout?: {
                max_lines?: number
                line_height?: string
                tracking?: string
                bbox_percent?: { x: number; y: number; w: number; h: number }
                alignment?: string
            }
        }
        supporting_text?: {
            text: string
            style: string
            layout?: {
                max_lines?: number
                bbox_percent?: { x: number; y: number; w: number; h: number }
                alignment?: string
            }
        }
        content_blocks?: Array<{
            category: string
            items: Array<{
                item_name: string
                price: string
                duration?: string
                style?: string
            }>
        }>
        footer_or_contact?: {
            text: string
            style: string
            layout?: {
                bbox_percent?: { x: number; y: number; w: number; h: number }
                alignment?: string
            }
        }
    }
    color_and_gradient_details: {
        primary: string
        secondary: string
        accent?: string
        usage_notes?: string
        [key: string]: string | undefined
    }
    raw_data_transcription?: {
        all_prices_detected: string[]
        all_programs_detected: string[]
        contact_info?: string
    }
}

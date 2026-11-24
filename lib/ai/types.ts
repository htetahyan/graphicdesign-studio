export type ImageInput = string | { buffer: Buffer; mimeType: string };

export interface AIProvider {
    /**
     * Generates a structural JSON response based on the prompt and provided images.
     * @param systemPrompt The overarching instructions for the AI model.
     * @param images The images to analyze or use as reference.
     * @param maxTokens The maximum tokens to output.
     * @returns An untyped JSON object parsed from the AI's response.
     */
    generateJson(
        systemPrompt: string,
        images: ImageInput[],
        maxTokens?: number
    ): Promise<any>;
}

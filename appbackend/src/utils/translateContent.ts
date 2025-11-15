import { GeminiAI } from "../services/GeminiAi"
import { Get_propmt } from "../prompts/translateContent"

export const translateContent = async (content: string, target_lan: string): Promise<string | null> => {
    try {
        const prompt = Get_propmt(content, target_lan)

        const response = await GeminiAI.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });

        return response.text ?? null;
    } catch (error) {
        console.error("Translation error:", error);
        return null;
    }
}
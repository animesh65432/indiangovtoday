import { groq } from "../services/Groq";

export async function GetBriefIndiaAnnouncements(system: string, prompt: string) {
    try {
        const response = await groq.chat.completions.create({
            model: "openai/gpt-oss-120b",
            messages: [
                {
                    role: "system",
                    content: system,
                },
                {
                    role: "user",
                    content: prompt,
                },
            ],
            temperature: 0.5,
            max_tokens: 300,
        });

        return response?.choices?.[0]?.message?.content || "";
    } catch (error) {
        console.error("Groq API Error:", error);
        return "Failed to fetch summary";
    }
}
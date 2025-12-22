import { groq } from "../services/Groq"
import { Get_Prompt } from "../prompts/translateannouncements"
import { ObjectId } from 'mongodb';

interface Announcement {
    title: string;
    source: string;
    _id: ObjectId,
    type: string
    content: string,
    summary: string
}

export interface TranslatedAnnouncement {
    title: string;
    source: string;
    _id: ObjectId;
    type: string
    content: string
    summary: string
}

export const translateannouncements = async (
    announcements: Announcement[],
    target_lan: string
): Promise<TranslatedAnnouncement[]> => {

    const prompt = Get_Prompt(announcements, target_lan);

    try {

        const response = await groq.chat.completions.create({
            messages: [{ role: "system", content: prompt }],
            model: "openai/gpt-oss-20b",
            response_format: { type: "json_object" }
        });

        const text = response.choices?.[0]?.message?.content;

        if (!text) {
            throw new Error("No response content received from API");
        }


        const translatedData = JSON.parse(text);


        if (!translatedData.announcements || !Array.isArray(translatedData.announcements)) {
            throw new Error("Invalid response format: expected announcements array");
        }


        const result: TranslatedAnnouncement[] = translatedData.announcements.map((item: any, index: number) => {
            if (!item.title || !item.link) {
                console.warn(`Missing title or link for announcement at index ${index}`);
            }

            return {
                title: item.title || announcements[index]?.title || "Untitled",
                link: item.link || announcements[index]?.source || "",
                _id: item._id || announcements[index]?._id || "",
                type: item.type || announcements[index]?.type || "",
                summary: item.content || announcements[index]?.content || ""
            };
        });

        return result;

    } catch (error) {
        console.error("Translation error:", error);

        return announcements
    }
}

export default translateannouncements;
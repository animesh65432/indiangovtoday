import { groq } from "../services/Groq"
import { Get_propmt } from "../prompts/translateannouncement"
import { ObjectId } from "mongodb"

interface Announcement {
    content: string
    title: string,
    _id: ObjectId,
    source: string;
}

export interface translatedAnnouncementTypes {
    content: string
    title: string,
    _id: ObjectId,
    source: string;
}

export const translateannouncement = async (
    announcement: Announcement,
    target_lan: string
): Promise<translatedAnnouncementTypes> => {

    const prompt = Get_propmt(announcement.content, announcement.title, announcement._id, target_lan);

    try {
        const response = await groq.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "openai/gpt-oss-20b",
            response_format: { type: "json_object" }
        });

        const text = response.choices?.[0]?.message?.content;

        if (!text) {
            throw new Error("No response content received from API");
        }


        const translatedData = JSON.parse(text);


        if (!translatedData.title || !translatedData.content || !translatedData._id || !translatedData.source) {
            throw new Error("Invalid response format: missing required fields");
        }


        return {
            title: translatedData.title,
            content: translatedData.content,
            _id: translatedData._id,
            source: announcement.source
        };

    } catch (error) {
        console.error("Translation error:", error);
        return announcement;
    }
}

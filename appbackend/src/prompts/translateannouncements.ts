import { ObjectId } from 'mongodb'

interface Announcement {
    title: string;
    source: string;
    _id: ObjectId
}

export const Get_Prompt = (announcements: Announcement[], target_language: string): string => {

    const formatted_announcements = announcements.map(announcement =>
        `title: ${announcement.title}\nsource: ${announcement.source}\n_id:${announcement._id}`
    );

    const announcements_text = formatted_announcements.join("\n---\n");

    const prompt = `Translate government announcement titles to ${target_language} using simple words.

Rules:
- Use simple words that anyone can understand
- Keep the meaning clear and accurate
- Make title short and clear
- Use everyday language that common people understand

CRITICAL - Do NOT translate or modify:
- Links/URLs (keep EXACTLY as provided)
- Website addresses
- File paths or references
- Any technical identifiers

Format your response EXACTLY as shown:
title: [Simple translated title in ${target_language}]
link: [paste the exact original link - DO NOT CHANGE]
_id:[paste the exact original _id - DO NOT CHANGE]

Announcements to translate:
${announcements_text}

Target Language: ${target_language}

IMPORTANT: Translate ONLY the titles. Keep all links exactly the same as provided.`;

    return prompt;
}
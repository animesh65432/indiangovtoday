import { ObjectId } from 'mongodb'

interface Announcement {
  title: string;
  source: string;
  _id: ObjectId;
  type: string,
  content: string
}

export const Get_Prompt = (announcements: Announcement[], target_language: string): string => {

  const formatted_announcements = announcements.map(announcement =>
    `title: ${announcement.title}\nsource: ${announcement.source}\ntype: ${announcement.type}\n_id: ${announcement._id}\ncontent:${announcement.content.slice(0, 150) + "..."}`
  );

  const announcements_text = formatted_announcements.join("\n---\n");

  const prompt = `You are translating government announcement titles and types to ${target_language}. Use the simplest, most common words that ordinary people use in everyday conversation.

Translation Guidelines:

FOR TITLES:
- Use simple, everyday words
- Keep the core meaning clear
- Make it short and easy to understand
- Avoid complex or formal language

FOR TYPES:
- Use the SIMPLEST common word format
- Add the local word for "announcement" or "news" after the category
- Pattern: [simple category word] + [word for announcement in ${target_language}]
- Examples:
  * Bengali: "International" → "আন্তর্জাতিক ঘোষণা" (category + ঘোষণা)
  * Hindi: "International" → "अंतर्राष्ट्रीय घोषणा" (category + घोषणा)
  * Tamil: "International" → "சர்வதேச அறிவிப்பு" (category + அறிவிப்பு)
  * Telugu: "International" → "అంతర్జాతీయ ప్రకటన" (category + ప్రకటన)
- Common type translations:
  * "Press Release" → [News/Press] + [announcement word]
  * "International" → [International/World] + [announcement word]
  * "Obituary" → [Mourning/Death news] + [announcement word]
- Use words that everyone knows and commonly uses

CRITICAL - NEVER change these:
- source/link URLs (copy EXACTLY as given)
- _id values (copy EXACTLY as given)
- Any technical codes or references

Required JSON format:
{
  "announcements": [
    {
      "title": "translated title here",
      "link": "exact original source - DO NOT MODIFY",
      "_id": "exact original _id - DO NOT MODIFY",
      "type": "simple category  + announcement word",
      "content":"translated content here"
    }
  ]
}

Announcements to translate:
${announcements_text}

Target Language: ${target_language}

Remember: 
- Translate title and type to simple everyday language
- For types, use: [category in ${target_language}] + [word for announcement/news in ${target_language}]
- Copy link and _id EXACTLY as provided
- Return ONLY the JSON object, nothing else`;

  return prompt;
}
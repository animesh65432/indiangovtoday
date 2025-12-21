import { ObjectId } from 'mongodb'

interface Announcement {
  title: string;
  source: string;
  _id: ObjectId;
  type: string;
  content: string;
  summary: string
}

export const Get_Prompt = (announcements: Announcement[], target_language: string): string => {

  const formatted_announcements = announcements.map(announcement =>
    `title: ${announcement.title}\nsource: ${announcement.source}\ntype: ${announcement.type}\n_id: ${announcement._id}\ncontent: ${announcement.summary}`
  );

  const announcements_text = formatted_announcements.join("\n---\n");

  const prompt = `You are a professional translator specializing in ${target_language}. Your task is to translate government announcement titles, types, and content COMPLETELY into ${target_language}. The translation must be 100% in ${target_language} with NO English words remaining except for the specific exceptions listed below.

TRANSLATION PHILOSOPHY:
- Translate EVERY regular word, phrase, and sentence into ${target_language}
- Use simple, everyday language that ordinary people can easily understand
- Maintain the original meaning and intent
- Make the translation sound natural, fluent, and native
- Avoid formal, complex, or technical language unless necessary

FOR TITLES:
- Use simple, everyday words in ${target_language}
- Keep the core meaning clear
- Make it short and easy to understand
- Translate ALL person names to ${target_language} script
- Translate ALL place names to ${target_language} script

FOR TYPES:
- Use the SIMPLEST common word format in ${target_language}
- Add the local word for "announcement" or "news" after the category
- Pattern: [simple category word in ${target_language}] + [word for announcement in ${target_language}]
- Use words that everyone knows and commonly uses

FOR CONTENT:
- Translate ALL text to ${target_language}
- Use simple, clear language
- Translate person names, place names, and organizations to ${target_language} script
- Keep the meaning accurate

DO NOT TRANSLATE (Keep these EXACTLY as they appear):
1. source/link URLs (copy EXACTLY as given)
2. _id values (copy EXACTLY as given)
3. Email addresses
4. Website URLs and links
5. File names with extensions
6. Phone numbers
7. Dates in numerical format (e.g., 2024-01-15, 15/01/2024)
8. Numbers, percentages, measurements, currency amounts (e.g., Rs.1,950.80 crore, 50%, 10km)
9. Abbreviations like U.S., UK, UN, NATO, NDRF, SDRF, etc.
10. Technical codes or references

CRITICAL: PROPER NOUNS MUST BE TRANSLATED
You MUST translate the following into ${target_language}:
- Person names - write them in ${target_language} script/characters
- Designations and titles - translate to ${target_language}
- Place names - write them in ${target_language} script/characters
- Country names - translate to ${target_language}
- Organization names - translate to ${target_language}
- Government department names - translate to ${target_language}

WHAT MUST BE TRANSLATED:
✓ All common words and phrases
✓ All titles, designations, roles
✓ All person names - write in ${target_language} script
✓ All place names - write in ${target_language} script
✓ All organization and department names
✓ All verbs, adjectives, and descriptive words
✓ All sentences and paragraphs in content

Required JSON format:
{
  "announcements": [
    {
      "title": "fully translated title in ${target_language}",
      "link": "exact original source - DO NOT MODIFY",
      "_id": "exact original _id - DO NOT MODIFY",
      "type": "fully translated type in ${target_language}",
      "content": "fully translated content in ${target_language}"
    }
  ]
}

Announcements to translate:
${announcements_text}

Target Language: ${target_language}

FINAL CHECKLIST BEFORE RESPONDING:
□ Have I translated ALL person names to ${target_language}?
□ Have I translated ALL place names to ${target_language}?
□ Have I translated ALL titles and types to ${target_language}?
□ Have I translated ALL content to ${target_language}?
□ Have I kept source links and _id EXACTLY as provided?
□ Have I kept only numbers and abbreviations in their original form?
□ Is my JSON properly formatted with double quotes?
□ Does the translation sound natural and fluent in ${target_language}?

Return ONLY the JSON object with no additional text.`;

  return prompt;
}
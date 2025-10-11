import { ObjectId } from "mongodb"

export const Get_propmt = (content: string, title: string, _id: ObjectId, source: string, target_language: string) => `You are a professional translator. Translate the following English title and content COMPLETELY to ${target_language}. Respond in JSON format.

Requirements:
- Translate ALL regular text to ${target_language} - no English words should remain except for the exceptions listed below
- Use simple, easy words that common people understand
- Keep the meaning the same
- Make it sound natural and fluent
- IMPORTANT: Keep the entire translated content under 2500 characters
- If content is too long, summarize while keeping key information
- Use everyday language, not complex or formal words

CRITICAL - Do NOT translate these elements (keep them EXACTLY as they are):
- Email addresses (e.g., example@email.com, contact@domain.com)
- Website URLs and links (e.g., www.example.com, https://example.com, http://site.org)
- Domain names and web addresses
- File names and extensions (e.g., document.pdf, report.docx, image.jpg)
- Phone numbers and contact numbers
- Dates in standard format (e.g., 2024-01-15, 15/01/2024)
- Numbers, percentages, and measurements
- Official program/scheme names (e.g., "Comprehensive Global Strategic Partnership")
- Technical terms, API endpoints, and code snippets
- Usernames and social media handles (e.g., @username)
- Proper nouns: Person names, place names, organization names, country names
- Abbreviations like U.S., UK, UN, etc.
- Twitter handles and social media references

TRANSLATION RULES:
1. Translate EVERY common word and phrase to ${target_language}
2. Only keep the items listed above in English
3. Make sure the translation reads naturally and fluently
4. Common words like "Prime Minister", "met", "today", "said", etc. MUST be translated
5. Don't leave any translatable words in English

Original content to translate:

Title: ${title}

Content: ${content}

Target Language: ${target_language}

Respond with a valid JSON object using this exact structure:
{
  "title": "Fully translated title in ${target_language}",
  "content": "Fully translated content in ${target_language} - only keep emails, URLs, proper nouns, and technical terms in English"
}

IMPORTANT:
- Return ONLY valid JSON format
- Use proper JSON syntax with double quotes
- Translate ALL regular text to ${target_language}
- Keep only technical elements (emails, links, files, numbers, proper nouns) in their original form
- No additional text outside the JSON object
- Ensure the translation is complete and natural`
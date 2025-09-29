import { ObjectId } from "mongodb"

export const Get_propmt = (content: string, title: string, _id: ObjectId, source: string, target_language: string) => `Translate the following English title and content to ${target_language}. Respond in JSON format.

Requirements:
- Use simple, easy words that common people understand
- Keep the meaning the same
- Make it sound natural
- IMPORTANT: Keep the entire translated content under 2500 characters
- If content is too long, summarize while keeping key information
- Use everyday language, not complex words

CRITICAL - Do NOT translate these elements (keep them EXACTLY as they are):
- Email addresses (e.g., example@email.com, contact@domain.com)
- Website URLs and links (e.g., www.example.com, https://example.com, http://site.org)
- File names and extensions (e.g., document.pdf, report.docx, image.jpg)
- Phone numbers and contact numbers
- Dates in standard format (e.g., 2024-01-15, 15/01/2024)
- Numbers, percentages, and measurements
- Brand names, company names, and proper nouns
- Technical terms, API endpoints, and code snippets
- Usernames and handles (e.g., @username)

Original content to translate:

Title: ${title}

Content: ${content}

Target Language: ${target_language}

Respond with a valid JSON object using this exact structure:
{
  "title": "Translated title in ${target_language}",
  "content": "Translated content in ${target_language} - keep all emails, URLs, and file names unchanged"
}

IMPORTANT:
- Return ONLY valid JSON format
- Use proper JSON syntax with double quotes
- Keep all technical elements (emails, links, files, numbers) in their original form
- Only translate the regular text
- No additional text outside the JSON object`
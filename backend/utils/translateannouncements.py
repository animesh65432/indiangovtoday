import json
from typing import List, TypedDict
from ai import GroqClient
from prompts.translatetranslateannouncements import GetPrompt

from typing import Optional

class Announcement(TypedDict, total=False): 
    title: str
    link: str
    id: Optional[str]


async def translate_announcements(
    announcements: List[Announcement], target_language: str
) -> List[dict]:
    try:
        if not announcements:
            return []

        prompt = GetPrompt(announcements, target_language)

        response = GroqClient.chat.completions.create(
            model="openai/gpt-oss-20b",
            messages=[
                {
                    "role": "system",
                    "content": f"You are an expert translator for Indian government documents. "
                               f"Translate accurately into {target_language} while maintaining official tone and terminology. "
                               f"Respond ONLY in valid JSON format."
                },
                {
                    "role": "user",
                    "content": (
                        f"{prompt}\n\nReturn output strictly as a JSON object with this structure:\n"
                        "{ \"translations\": [ {\"title\": \"...\", \"link\": \"...\"} ] }"
                    )
                }
            ],
            response_format={"type": "json_object"}
        )

        content = getattr(response.choices[0].message, "content", None)
        if not content:
            print("Translation API returned empty content")
            return []

        try:
            data = json.loads(content)
        except json.JSONDecodeError as e:
            print(f"JSON parsing failed: {e}, content: {content}")
            return []

        translated = data.get("translations", [])

      
        results = []
        for original, trans in zip(announcements, translated):
            results.append({
                "original_title": original.get("title"),  
                "title": trans.get("title"),           
                "link": trans.get("link"),
                "id": original.get("id") if "id" in original else None
            })

        return results

    except Exception as e:
        print(f"Translation error: {e}")
        return []

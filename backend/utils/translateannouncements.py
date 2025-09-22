import json
from typing import List, TypedDict
from ai import GroqClient
from prompts.translatetranslateannouncements import GetPrompt

class Announcement(TypedDict):
    title: str
    link: str

async def translate_announcements(announcements: List[Announcement], target_language) -> str:
    try:
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
                    "content": f"{prompt}\n\nReturn output strictly as a JSON object with this structure:\n"
                               "{ \"translations\": [ {\"title\": \"...\", \"link\": \"...\"} ] }"
                }
            ],
            response_format={ "type": "json_object" }
        )

        content = response.choices[0].message.content  

        
        data = json.loads(content)
        return data.get("translations", [])

    except Exception as e:
        return f"Translation error: {str(e)}"

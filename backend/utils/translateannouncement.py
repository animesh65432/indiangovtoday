import json
from prompts.translateannouncement import GetPrompt
from models.announcement import Announcement
from ai import GroqClient


async def translateannouncement(announcement: Announcement, target_language: str):
    try:
        prompt = GetPrompt(announcement, target_language)

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
                        "{ \"translations\": [ {\"title\": \"...\", \"content\": \"...\"} ] }"
                    )
                }
            ],
            response_format={"type": "json_object"}
        )

        content = response.choices[0].message.content

        data = json.loads(content)

        return data.get("translations", [])

    except Exception as e:
        return {"error": f"Translation error: {str(e)}"}

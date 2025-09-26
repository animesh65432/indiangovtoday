import json
from prompts.translatetranslateannouncement import GetPrompt
from ai import GroqClient

async def translateannouncement(title: str, content: str, target_lan: str):
    try:
        prompt = GetPrompt(content, title, target_lan)

        response = GroqClient.chat.completions.create(
            model="openai/gpt-oss-20b",
            messages=[
                {
                    "role": "system",
                    "content": (
                        f"You are an expert translator for Indian government documents. "
                        f"Translate accurately into {target_lan} while maintaining official tone and terminology. "
                        f"Respond ONLY in valid JSON format."
                    )
                },
                {
                    "role": "user",
                    "content": (
                        f"{prompt}\n\nReturn output strictly as a JSON object with this structure:\n"
                    )
                }
            ],
            response_format={"type": "json_object"}
        )

        data = json.loads(response.choices[0].message.content)

        return data

    except Exception as e:
        return f"Translation error: {str(e)}"

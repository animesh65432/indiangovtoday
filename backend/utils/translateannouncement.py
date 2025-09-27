import asyncio
import json
from prompts.translatetranslateannouncement import GetPrompt
from ai import GroqClient

async def translateannouncement(title: str, content: str, target_lan: str):
    try:
        prompt = GetPrompt(content, title, target_lan)
        
        response = await asyncio.to_thread(
            GroqClient.chat.completions.create,
            model="openai/gpt-oss-20b",
            messages=[
                {"role": "system", "content": "You are an expert translator..."},
                {"role": "user", "content": f"{prompt}\n\nReturn output strictly as a JSON object"}
            ],
            response_format={"type": "json_object"}
        )

        data = json.loads(response.choices[0].message.content)
        return data
    except Exception as e:
        return {"error": f"Translation error: {str(e)}"}

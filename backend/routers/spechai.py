import base64
from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from groq import BaseModel
from sarvam import SarvamAIClient

router = APIRouter()

LANGUAGE_CODES = {
    "हिन्दी": "hi-IN",
    "বাংলা": "bn-IN",
    "தமிழ்": "ta-IN",
    "తెలుగు": "te-IN",
    "मराठी": "mr-IN",
    "ગુજરાતી": "gu-IN",
    "ಕನ್ನಡ": "kn-IN",
    "മലയാളം": "ml-IN",
    "ਪੰਜਾਬੀ": "pa-IN",
    "ଓଡ଼ିଆ": "or-IN",
    "English": "en-IN"
}

class TTSRequest(BaseModel):
    text: str
    target_language: str = "English"


@router.post("/texttospeech")
async def text_to_speech(req: TTSRequest):
    text = req.text
    target_language = req.target_language

    if not text or not text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty")

    if target_language not in LANGUAGE_CODES:
        raise HTTPException(
            status_code=404,
            detail=f"Unsupported language '{target_language}'. Supported languages: {list(LANGUAGE_CODES.keys())}"
        )

    target_language_code = LANGUAGE_CODES[target_language]

    try:
        response = SarvamAIClient.text_to_speech.convert(
            text=text,
            target_language_code=target_language_code,
            model="bulbul:v2",
            speaker="anushka"
        )
        
        
        audio_data = response.audios[0]
        
        if isinstance(audio_data, bytes):
            audio_base64 = base64.b64encode(audio_data).decode("utf-8")
        else:
            audio_base64 = audio_data

        
        return JSONResponse({
            "success": True,
            "message": "Text converted to speech successfully",
            "audioContent": audio_base64
        })
       
    except Exception as e:
        print(f"Error in text_to_speech: {str(e)}")
        return JSONResponse(f"Internal server error: {str(e)}",500)

from fastapi import APIRouter, HTTPException
from fastapi.responses import  FileResponse
from sarvamai import SarvamAIclient
from sarvamai.play import save
import os
import uuid

router = APIRouter()


LANGUAGE_CODES = {
    "hi": {"label": "हिन्दी", "code": "hi-IN"},
    "bn": {"label": "বাংলা", "code": "bn-IN"},
    "ta": {"label": "தமிழ்", "code": "ta-IN"},
    "te": {"label": "తెలుగు", "code": "te-IN"},
    "mr": {"label": "मराठी", "code": "mr-IN"},
    "gu": {"label": "ગુજરાતી", "code": "gu-IN"},
    "kn": {"label": "ಕನ್ನಡ", "code": "kn-IN"},
    "ml": {"label": "മലയാളം", "code": "ml-IN"},
    "pa": {"label": "ਪੰਜਾਬੀ", "code": "pa-IN"},
    "or": {"label": "ଓଡ଼ିଆ", "code": "or-IN"},
    "ur": {"label": "اردو", "code": "ur-IN"},
    "as": {"label": "অসমীয়া", "code": "as-IN"},
    "sa": {"label": "संस्कृतम्", "code": "sa-IN"},
    "mai": {"label": "मैथिली", "code": "mai-IN"},
    "sat": {"label": "संथाली", "code": "sat-IN"},
    "ne": {"label": "नेपाली", "code": "ne-IN"},
    "doi": {"label": "डोगरी", "code": "doi-IN"},
    "brx": {"label": "बोडो", "code": "brx-IN"},
    "mni": {"label": "मणिपुरी", "code": "mni-IN"},
    "en": {"label": "English", "code": "en-IN"}
}

@router.post("/texttospeech")
async def text_to_speech(text: str, target_language: str = "English"):
    """
    Convert text to speech using Sarvam AI
    
    Args:
        text: The text to convert to speech
        target_language: Target language label (default: "English")
    
    Returns:
        Audio file or JSON response with file path
    """
    try:
        # Validate input
        if not text or not text.strip():
            raise HTTPException(status_code=400, detail="Text cannot be empty")
        
        # Get language code
        if target_language not in LANGUAGE_CODES:
            raise HTTPException(
                status_code=400, 
                detail=f"Unsupported language '{target_language}'. Supported languages: {list(LANGUAGE_CODES.keys())}"
            )
        
        target_language_code = LANGUAGE_CODES[target_language]
        
        # Generate unique filename
        unique_filename = f"output_{uuid.uuid4().hex[:8]}.wav"
        
        # Convert text to speech
        audio = SarvamAIclient.text_to_speech.convert(
            target_language_code=target_language_code,
            text=text,  # Use the actual input text
            model="bulbul:v2",
            speaker="anushka"
        )
        
        # Save audio file
        save(audio, unique_filename)
        
        # Check if file was created successfully
        if not os.path.exists(unique_filename):
            raise HTTPException(status_code=500, detail="Failed to create audio file")
        
        # Return the audio file directly
        return FileResponse(
            path=unique_filename,
            media_type="audio/wav",
            filename=unique_filename,
            headers={"Content-Disposition": f"attachment; filename={unique_filename}"}
        )
        
        # Alternative: Return JSON with file info
        # return JSONResponse({
        #     "success": True,
        #     "message": "Text converted to speech successfully",
        #     "file_path": unique_filename,
        #     "text": text,
        #     "language": target_language
        # })
        
    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        # Log the error (you might want to use proper logging)
        print(f"Error in text_to_speech: {str(e)}")
        raise HTTPException(
            status_code=500, 
            detail=f"Internal server error: {str(e)}"
        )


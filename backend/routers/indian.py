import json
from fastapi import APIRouter,HTTPException
from services.news import get_all_announcements
from redis import redis
from utils.translateannouncements import translate_announcements
router = APIRouter()

@router.get("/indian-announcements")
async def get_indian_news(target_lan:str="English"):
    try:
        cached_data = redis.get(f"indianannouncements{target_lan}")

        if cached_data:
            return json.loads(cached_data)
        
        
        indian_announcements = await get_all_announcements()
        
        
        if target_lan != "English":
            indian_announcements = await translate_announcements(indian_announcements, target_lan)

        
        if indian_announcements:
            redis.set(f"indianannouncements{target_lan}", json.dumps(indian_announcements), ex=1800)
        
        return indian_announcements if indian_announcements else []
    
    except Exception as e:
        print("Error fetching Indian news:", e)
        raise HTTPException(status_code=500, detail="Internal Server Error")


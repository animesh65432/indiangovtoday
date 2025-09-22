import json
from fastapi import APIRouter,HTTPException
from services.news import get_all_announcements
from redis import redis
router = APIRouter()

@router.get("/indian-announcements")
async def get_indian_news():
    try:
        cached_data = redis.get("indianannouncements")

        if cached_data:
            return json.loads(cached_data)

        Indianannouncements = await get_all_announcements()

        if Indianannouncements :

            redis.set("indianannouncements", json.dumps(Indianannouncements),ex=1800)
        
        return Indianannouncements if Indianannouncements else []
    
    except Exception as e:
        print("Error fetching Indian news:", e)
        raise HTTPException(status_code=500, detail="Internal Server Error")
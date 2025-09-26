import json
from fastapi import APIRouter,HTTPException
from fastapi.responses import JSONResponse 
from bson import ObjectId
from redis import redis
from utils.translateannouncements import translate_announcements
from database import announcements
from utils.translateannouncement import translateannouncement

router = APIRouter()

@router.get("/indian-announcements")
async def get_indian_news(target_lan:str="English"):
    try:
        cached_data = redis.get(f"indianannouncements{target_lan}")

        if cached_data:
            return json.loads(cached_data)
        
        cursor = announcements.find({})
        
        indian_announcements = []
        async for item in cursor:
          indian_announcements.append({
                "id": str(item["_id"]),
                "title": item.get("title"),
                "content": item.get("content")
            })
          
        if target_lan != "English":
            print(target_lan)
            indian_announcements = await translate_announcements(indian_announcements, target_lan)

        if indian_announcements:
            redis.set(f"indianannouncements{target_lan}", json.dumps(indian_announcements), ex=3600)
        
        return indian_announcements
    
    except Exception as e:
        print("Error fetching Indian news:", e)
        raise HTTPException(status_code=500, detail="Internal Server Error")
    

@router.get("/indian-announcement")
async def get_announcement(id: str, target_lan: str = "English"):
    try:
        if not ObjectId.is_valid(id):
            raise HTTPException(status_code=400, detail="Invalid announcement ID format")
        
        cache_key = f"indianannouncement:{id}:{target_lan}"
        cached_data = redis.get(cache_key)
        if cached_data:
            print("from redis")
            return json.loads(cached_data)

        announcement = await announcements.find_one({"_id": ObjectId(id)})
        if not announcement:
            raise HTTPException(status_code=404, detail="Announcement not found")
        
        announcement["_id"] = str(announcement["_id"])

        print(announcement["title"])

        if target_lan != "English":
            trans_announcement = await translateannouncement(announcement["title"],announcement["content"],target_lan)
            announcement["title"]=trans_announcement['Title']
            announcement["content"]=trans_announcement['Content']


        redis.set(cache_key, json.dumps(announcement), ex=3600)
        return announcement

    except Exception as e:
        print(f"Error fetching Indian announcement: {e}")
        return JSONResponse("Internal Server Error", status_code=500)

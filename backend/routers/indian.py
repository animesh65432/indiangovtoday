import json
from fastapi import APIRouter,HTTPException
from fastapi.responses import JSONResponse 
from bson import ObjectId
from redis import redis
from utils.translateannouncements import translate_announcements
from database import get_database
from utils.translateannouncement import translateannouncement
import asyncio
import traceback

original_close = None

def patch_event_loop():
    try:
        loop = asyncio.get_event_loop()
        global original_close
        original_close = loop.close
        
        def debug_close():
            print("🚨 EVENT LOOP CLOSING! Stack trace:")
            traceback.print_stack()
            print("=" * 50)
            return original_close()
        
        loop.close = debug_close
    except:
        pass



def check_loop(where):
    try:
        loop = asyncio.get_event_loop()
        print(f"✅ {where}: Loop OK (closed: {loop.is_closed()})")
    except Exception as e:
        print(f"❌ {where}: Loop ERROR - {e}")

router = APIRouter()

@router.get("/indian-announcements")
async def get_indian_news(target_lan:str="English"):
    try:
        cached_data = await redis.get(f"indianannouncements{target_lan}")

        if cached_data:
            return json.loads(cached_data)
        
        db = await get_database()

        announcements=db["announcements"]

        cursor = announcements.find({})
        
        indian_announcements = []
        async for item in cursor:
          print(item)
          indian_announcements.append({
                "id": str(item["_id"]),
                "title": item.get("title"),
                "content": item.get("content"),
                "link" : item.get("source")
            })
          
        if target_lan != "English":
            print(target_lan)
            indian_announcements = await translate_announcements(indian_announcements, target_lan)

        if indian_announcements:
            await redis.set(f"indianannouncements{target_lan}", json.dumps(indian_announcements), ex=3600)
        
        return indian_announcements
    
    except Exception as e:
        print("Error fetching Indian news:", e)
        raise HTTPException(status_code=500, detail="Internal Server Error")
    

@router.get("/indian-announcement")
async def get_announcement(id: str, target_lan: str = "English"):
    check_loop("START endpoint")
    
    try:
        if not ObjectId.is_valid(id):
            raise HTTPException(status_code=400, detail="Invalid announcement ID format")
        
        cache_key = f"indianannouncement:{id}:{target_lan}"
        
        check_loop("Before Redis")
        cached_data = await redis.get(cache_key)
        check_loop("After Redis")
        
        if cached_data:
            print("from redis")
            return json.loads(cached_data)

        check_loop("Before DB")
        db = await get_database()
        announcements = db["announcements"]
        announcement = await announcements.find_one({"_id": ObjectId(id)})
        check_loop("After DB")

        if not announcement:
            raise HTTPException(status_code=404, detail="Announcement not found")
        
        announcement["_id"] = str(announcement["_id"])

        if target_lan != "English":
            check_loop("Before Translation")
            trans_announcement = await translateannouncement(
                announcement["title"],
                announcement["content"],
                target_lan
            )
            check_loop("After Translation")
            
            announcement["title"] = trans_announcement['Title']
            announcement["content"] = trans_announcement['Content']

        check_loop("Before Redis Set")
        await redis.set(cache_key, json.dumps(announcement), ex=3600)
        check_loop("After Redis Set")

        return announcement

    except Exception as e:
        check_loop("ERROR occurred")
        print(f"Error fetching Indian announcement: {e}")
        return JSONResponse("Internal Server Error", status_code=500)
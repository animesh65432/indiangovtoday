import json
from fastapi import APIRouter,HTTPException
from fastapi.responses import JSONResponse 
from config import config
from redis import redis
from utils.translateannouncements import translate_announcements
from models.Indianannouncements import IndianannouncementModel
from utils.scrapeannouncementsreleases import scrape_announcements
from utils.scrapeannouncement import scrapeannouncement
from utils.translateannouncement import translateannouncement

router = APIRouter()

@router.get("/indian-announcements")
async def get_indian_news(target_lan:str="English"):
    try:
        cached_data = redis.get(f"indianannouncements{target_lan}")

        if cached_data:
            return json.loads(cached_data)
        
        indian_announcements = scrape_announcements(config["INDIAN_GOVERMENT_BASE_URL"])

        if not indian_announcements :
            return JSONResponse([],status_code=200)
        
        
        indian_announcements = await translate_announcements(indian_announcements, target_lan)

        
        if indian_announcements:
            redis.set(f"indianannouncements{target_lan}", json.dumps(indian_announcements), ex=3600)
        
        return indian_announcements
    
    except Exception as e:
        print("Error fetching Indian news:", e)
        raise HTTPException(status_code=500, detail="Internal Server Error")
    
    

@router.post("/indian-announcement")
async def Getannouncement(body:IndianannouncementModel):
    try :
        cached_data = redis.get(f"indianannouncement{body.target_lan}{body.link}")

        if cached_data:
            print("from redis")
            return json.loads(cached_data)
        
        announcement_scraped = scrapeannouncement(body.link)

        if not announcement_scraped :
            return HTTPException(status_code=404, detail="announcement not found")

        translate_announcement = await translateannouncement(announcement_scraped,body.target_lan)
        
        redis.set(f"indianannouncement{body.target_lan}{body.link}", json.dumps(translate_announcement), ex=3600)
        
        return translate_announcement
    except Exception as e:
        print("Error fetching Indian news:", e)
        raise HTTPException(status_code=500, detail="Internal Server Error")


from fastapi import APIRouter,HTTPException
from utils.scrape_press_releases import scrape_press_releases
from config import config 
from services.news import get_all_announcements ,Get_announcement_by_id
router = APIRouter()

@router.get("/indian-news")
async def get_indian_news():
    try :
        IndianNews = await get_all_announcements()
        return {"news": IndianNews} 
    except Exception as e:
        print("Error fetching Indian news",e)
        raise HTTPException(status_code=500, detail="Internal Server Error")


@router.get("/indian-news/{id}")
async def get_indian_news_by_id(id: str):
    print("ID received:", id)  # Debugging line to check the received ID
    try:
        if not id:
            raise HTTPException(status_code=400, detail="ID parameter is required")
        announcement = await Get_announcement_by_id(id)  
        if announcement:
            return {"announcement": announcement}
        else:
            raise HTTPException(status_code=404, detail="Announcement not found")
    except Exception as e:
        print("Error fetching Indian news by id", e)
        raise HTTPException(status_code=500, detail="Internal Server Error")
    





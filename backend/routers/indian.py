from fastapi import APIRouter,HTTPException
from utils.scrape_press_releases import scrape_press_releases
from config import config   

router = APIRouter()

@router.get("/indian-news")
async def get_indian_news():
    try :
        IndianNews = scrape_press_releases(config["INDIAN_GOVERMENT_BASE_URL"])
        
        if not IndianNews:
            raise HTTPException(status_code=404, detail="No news found")
        
        return {"news": IndianNews} 
    
    except Exception as e:
        print("Error fetching Indian news",e)
        raise HTTPException(status_code=500, detail="Internal Server Error")



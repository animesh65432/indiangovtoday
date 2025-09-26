from fastapi import APIRouter
from fastapi.responses import JSONResponse
from  utils.schedulerscrapeannouncementsreleases import scrape_and_store_announcements


router = APIRouter()

@router.post("/updateannouncements")
async def updateannouncements():
    try :
        scrape_and_store_announcements()
        return JSONResponse("update it",200)
    except : 
        return JSONResponse("internal server errors",500)
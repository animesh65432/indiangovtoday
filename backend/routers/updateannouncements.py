from fastapi import APIRouter
from fastapi.responses import JSONResponse
from  utils.schedulerscrapeannouncementsreleases import scrape_and_store_announcements


router = APIRouter()

@router.post("/updateannouncements")
async def updateannouncements():
    try :
        Flag = await scrape_and_store_announcements()
        if Flag:
            return JSONResponse("update it",200)
        else :
            return JSONResponse("didn't update it",400)
    except : 
        return JSONResponse("internal server errors",500)
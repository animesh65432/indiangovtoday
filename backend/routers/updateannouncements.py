from fastapi import APIRouter, BackgroundTasks
from fastapi.responses import JSONResponse
from utils.schedulerscrapeannouncementsreleases import scrape_and_store_announcements

router = APIRouter()

@router.post("/updateannouncements")
async def updateannouncements(background_tasks: BackgroundTasks):
    try:
       
        background_tasks.add_task(scrape_and_store_announcements)
    
        return JSONResponse(
            content={"message": "Update started in background"},
            status_code=200
        )
    except Exception as e:
        return JSONResponse(
            content={"error": str(e)},
            status_code=500
        )

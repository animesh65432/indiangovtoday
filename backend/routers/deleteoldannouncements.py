from fastapi import APIRouter, BackgroundTasks
from fastapi.responses import JSONResponse 
from database import get_database

router = APIRouter()

async def delete_all_announcements():
    try:
        db = await get_database()
        announcements=db["announcementss"]
        result = await announcements.delete_many({})
        print(f"Deleted {result.deleted_count} announcements")
    except Exception as e:
        print("delete_all_announcements error:", e)

@router.delete("/deleteoldannouncements")
async def delete_old_announcements(background_tasks: BackgroundTasks):
    try:
        background_tasks.add_task(delete_all_announcements)
        
        return JSONResponse(
            content={"message": "Deletion started in background"},
            status_code=200
        )
    except Exception as e:
        print("deleteoldannouncements error:", e)
        return JSONResponse(
            content={"error": str(e)},
            status_code=500
        )

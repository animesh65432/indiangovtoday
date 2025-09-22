from fastapi import APIRouter,HTTPException
from services.news import get_all_announcements ,Get_announcement_by_id
router = APIRouter()

@router.get("/indian-announcements")
async def get_indian_news():
    try :
        Indianannouncements = await get_all_announcements()
        return Indianannouncements
    except Exception as e:
        print("Error fetching Indian news",e)
        raise HTTPException(status_code=500, detail="Internal Server Error")


@router.get("/indian-announcement/{id}")
async def get_indian_news_by_id(id: str):
    print("ID received:", id) 
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
    





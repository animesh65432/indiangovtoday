from fastapi import APIRouter
from fastapi.responses import JSONResponse 
from database import announcements

router = APIRouter()

@router.delete("/deleteoldannouncements")
async def delete_old_announcements():
    try:
        result = await announcements.delete_many({})
        return JSONResponse(
            content={"deleted_count": result.deleted_count},
            status_code=200
        )
    except Exception :
        return JSONResponse("internal server errors",500)
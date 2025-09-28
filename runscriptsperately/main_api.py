import json
from fastapi import APIRouter
from fastapi.responses import JSONResponse
from redis import redis

router = APIRouter()

@router.post("/updateannouncements")
async def updateannouncements():
    try:
        await redis.lpush("task_queue", json.dumps({"task": "scrape_announcements"}))
        return JSONResponse({"message": "Task queued"}, status_code=200)
    except Exception as e:
        return JSONResponse(
            content={"error": str(e)},
            status_code=500
        )

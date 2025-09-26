from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse
from database import saves
from models.SaveModel import AddSave

router = APIRouter()

@router.post("/save")
async def add(payload: AddSave, request: Request):
    user = getattr(request.state, "user", None)
    if not user:
        return JSONResponse({"detail": "Unauthorized"}, status_code=401)

    try:
       
        checkalready = await saves.find_one({"title": payload.title, "userId": user["id"]})
        if checkalready:
            return JSONResponse({"detail": "Already saved"}, status_code=400)

     
        await saves.insert_one({
            "title": payload.title,
            "content": payload.content,
            "userId": user["id"],
            "source": payload.source
        })

        return JSONResponse({"detail": "Successfully saved"}, status_code=201)

    except Exception as e:
        print(f"Save error: {e}")
        return JSONResponse({"detail": "Internal server error"}, status_code=500)


@router.get("/saves")
async def get_saves(request: Request):
    user = getattr(request.state, "user", None)
    if not user:
        return JSONResponse({"detail": "Unauthorized"}, status_code=401)

    try:
        cursor = saves.find({"userId": user["id"]})
        users_saves = []
        async for item in cursor:
            users_saves.append({
                "id": str(item["_id"]),
                "title": item.get("title"),
                "content": item.get("content"),
                "source": item.get("source")
            })

        return users_saves

    except Exception as e:
        print(f"Get saves error: {e}")
        return JSONResponse({"detail": "Internal server error"}, status_code=500)

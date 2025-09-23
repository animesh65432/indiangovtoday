from fastapi import APIRouter, HTTPException, Request, status
from fastapi.responses import JSONResponse
from database import saves
from models.SaveModel import AddSave

router = APIRouter()

@router.post("/save")
async def add (payload:AddSave,request: Request):
    user = getattr(request.state, "user", None)
    try :
        saves.insert_one({"title":payload.title,"content":payload.content,"userId": user["id"],"source":payload.source})
        return JSONResponse("sucessfully save it",status_code=201)
    except Exception :
        return JSONResponse("internal server error",status_code=500)

@router.get("/saves")
async def Get (request: Request):
    user = getattr(request.state, "user", None)
    try:
        UsersSaves = saves.find({"userId": user["id"]})
        return  UsersSaves
    except Exception :
        return JSONResponse("internal server error",status_code=500)
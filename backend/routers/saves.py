from fastapi import APIRouter, HTTPException, status
from fastapi.responses import JSONResponse
from database import saves

router = APIRouter()

@router.post("/save")
async def add ():
    return ""

@router.get("/saves")
async def add ():
    return ""
from fastapi import FastAPI
from routers.indian import router as indian_router
from utils.updateannouncements import update_announcements_everyday
from fastapi.middleware.cors import CORSMiddleware
import asyncio


app = FastAPI()

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],          
    allow_headers=["*"], 
)

app.include_router(indian_router)

@app.on_event("startup")
async def start_background_tasks():
    async def scheduler():
        while True:
            await update_announcements_everyday()
            await asyncio.sleep(24 * 60 * 60) 
    asyncio.create_task(scheduler())
    

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1")

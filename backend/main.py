from dotenv import load_dotenv
from fastapi import FastAPI
from routers.indian import router as indian_router
from utils.updateannouncements import update_announcements_everyday

load_dotenv()

app = FastAPI()

app.include_router(indian_router)

if __name__ == "__main__":
    update_announcements_everyday()
    import uvicorn
    uvicorn.run(app, host="127.0.0.1")

from dotenv import load_dotenv
from fastapi import FastAPI
from routers.indian import router as indian_router
load_dotenv()

app = FastAPI()

app.include_router(indian_router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1")

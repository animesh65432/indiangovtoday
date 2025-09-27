from fastapi import FastAPI
from routers.indian import router as indian_router
from routers.saves import router as saves_router
from routers.users import router as users_router
from routers.spechai import router as spechai_router
from routers.updateannouncements import router as updateannouncements_router
from routers.deleteoldannouncements import router as deleteoldannouncements_router
from fastapi.middleware.cors import CORSMiddleware
from Middlewares.AuthMiddleware import AuthMiddleware
from Middlewares.ratelimiter import RateLimiterMiddleware

app = FastAPI()

origins = ["http://localhost:3000","https://indiangovtoday.app"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,           
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.add_middleware(RateLimiterMiddleware, limit=20, window_ms=10_000)

app.add_middleware(AuthMiddleware)

@app.get("/")
def Check():
    return "Okay"

app.include_router(indian_router)
app.include_router(users_router)
app.include_router(saves_router)
app.include_router(spechai_router)
app.include_router(updateannouncements_router)
app.include_router(deleteoldannouncements_router)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000, reload=True)


from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from routers.indian import router as indian_router
from routers.saves import router as saves_router
from routers.users import router as users_router
from fastapi.middleware.cors import CORSMiddleware
from Middlewares.AuthMiddleware import AuthMiddleware
from slowapi.middleware import SlowAPIMiddleware
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


app.add_middleware(RateLimiterMiddleware, limit=5, window_ms=10_000)

app.add_middleware(AuthMiddleware)


app.include_router(indian_router)
app.include_router(users_router)
app.include_router(saves_router)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000, reload=True)


from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from routers.indian import router as indian_router
from routers.saves import router as saves_router
from routers.users import router as users_router
from fastapi.middleware.cors import CORSMiddleware
from Middlewares.AuthMiddleware import AuthMiddleware
from slowapi import Limiter
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware

app = FastAPI()

origins = ["http://localhost:3000","https://indiangovtoday.app"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],          
    allow_headers=["*"], 
)

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter

app.add_middleware(SlowAPIMiddleware)

app.add_middleware(AuthMiddleware)


@app.exception_handler(RateLimitExceeded)
async def rate_limit_handler(request: Request, exc: RateLimitExceeded):
    return JSONResponse("to many request",status_code=429)

app.include_router(indian_router)
app.include_router(users_router)
app.include_router(saves_router)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000, reload=True)


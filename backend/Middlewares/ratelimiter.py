from fastapi import Request
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from redis import redis  

class RateLimiterMiddleware(BaseHTTPMiddleware):
    def __init__(self, app, limit: int = 5, window_ms: int = 10_000):
        super().__init__(app)
        self.limit = limit
        self.window_sec = window_ms // 1000

    async def dispatch(self, request: Request, call_next):
        if redis is None:
            print("Redis client not initialized!")
            return await call_next(request)

        # Get real client IP
        ip = (
            request.headers.get("x-forwarded-for", "").split(",")[0]
            or request.headers.get("cf-connecting-ip")
            or request.client.host
        )

        key = f"rate-limit:{ip}"

        try:
            count = await redis.get(key)
            if count:
                current = int(count)
                ttl = await redis.ttl(key)
                if ttl == -1:
                    await redis.expire(key, self.window_sec)
                if current >= self.limit:
                    return JSONResponse(
                        status_code=429,
                        content={"message": "Too many requests, please try again later."},
                        headers={"Retry-After": str(self.window_sec)}
                    )
                await redis.incr(key)
            else:
                await redis.set(key, "1", ex=self.window_sec)
        except Exception as e:
            print(f"Redis rate limiter error: {e}")
           
        response = await call_next(request)
        return response
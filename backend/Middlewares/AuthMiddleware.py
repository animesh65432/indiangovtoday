from fastapi import Request
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
import jwt
from config import config
from database import users  

SECRET_KEY = config["JWT_SECRET"]
ALGORITHM = "HS256"


class AuthMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        if request.url.path.startswith("/auth") or request.url.path.startswith("/signup") or request.url.path.startswith("/signin"):
            return await call_next(request)
        

        token = request.headers.get("Authorization")

        if not token:
              return JSONResponse(status_code=401, content={"detail": "Missing authorization token"})

        try:

            scheme, _, token_value = token.partition(" ")
            if scheme.lower() != "bearer":
                return JSONResponse(status_code=401, content={"detail": "Invaild auth errors"})

          
            payload = jwt.decode(token_value, SECRET_KEY, algorithms=[ALGORITHM])
            email = payload.get("sub")
            if not email:
                return JSONResponse(status_code=401, content={"detail": "email not found"})

    
            user = users.find_one({"email": email})
            if not user:
                return JSONResponse(status_code=401, content={"detail": "user not found"})


            request.state.user = {
                "id": str(user.get("_id")),
                "email": user.get("email"),
                "name": user.get("name"),
            }

        except jwt.ExpiredSignatureError:
            return JSONResponse(status_code=401, content={"detail": "token is experied"})
        except jwt.InvalidTokenError:
            JSONResponse(status_code=401, content={"detail": "invaild token"})

        return await call_next(request)

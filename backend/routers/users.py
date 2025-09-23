from fastapi import APIRouter, HTTPException, status
from fastapi.responses import JSONResponse
from database import users
from google.oauth2 import id_token
from google.auth.transport import requests
from utils import create_token
from models.AuthModel import GoogleAuthRequest, SingingRequest, SingupRequest
from utils.security import hash_password, verify_password

router = APIRouter()

@router.post("/signup")
async def signup(body: SingupRequest):
    try:
        user = users.find_one({"email": body.email})

        if user:
            raise HTTPException(status_code=400, detail="User already exists")

        new_user = {
            "email": body.email,
            "password": hash_password(body.password),
            "name": body.name,
        }
        users.insert_one(new_user)

        return JSONResponse(
            content={"message": "Successfully created user"},
            status_code=status.HTTP_201_CREATED,
        )

    except Exception as e:
        print(e, "errors in signup controller")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.post("/signin")
async def signin(body: SingingRequest):
    try:
        user = users.find_one({"email": body.email})

        if not user:
            raise HTTPException(status_code=400, detail="User not found")

        if not verify_password(body.password, user["password"]):
            raise HTTPException(status_code=401, detail="Invalid credentials")

        token = create_token(user["email"])

        return {"message": "Successfully logged in", "token": token}

    except Exception as e:
        print(e, "errors in signin controller")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.post("/google")
async def google_auth(body: GoogleAuthRequest):
    credential = body.credential
    client_id = body.clientId

    if not credential or not client_id:
        raise HTTPException(status_code=400, detail="Missing credential or client ID")

    try:
        payload = id_token.verify_oauth2_token(
            credential, requests.Request(), client_id
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid Google token: {str(e)}")

    email = payload.get("email")
    if not email:
        raise HTTPException(status_code=400, detail="Invalid Google token payload")

    user = users.find_one({"email": email})

    if not user:
        users.insert_one({"email": email})
        message = "Account created and logged in"
        code = status.HTTP_201_CREATED
    else:
        message = "Successfully logged in"
        code = status.HTTP_200_OK

    token = create_token(email)

    return JSONResponse(content={"message": message, "token": token}, status_code=code)

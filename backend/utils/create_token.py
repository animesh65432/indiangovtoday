import jwt
import datetime
from config import config

SECRET_KEY = config["JWT_SECRET"]   
ALGORITHM = "HS256"

def create_token(email: str) -> str:
    """Generate JWT token for a given email"""
    payload = {
        "sub": email,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=12),  # expires in 12h
        "iat": datetime.datetime.utcnow()
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
    return token

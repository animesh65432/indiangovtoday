from pydantic import BaseModel


class GoogleAuthRequest(BaseModel):
    credential: str
    clientId: str

class SingupRequest(BaseModel):
    name : str
    email:str
    password:str

class SingingRequest(BaseModel):
    email:str
    password:str
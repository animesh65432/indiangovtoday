from pydantic import BaseModel, EmailStr
from typing import Optional

class UserModel(BaseModel):
    id: Optional[str] 
    name : Optional[str]
    email: EmailStr
    password: Optional[str]

    

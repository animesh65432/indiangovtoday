from pydantic import BaseModel

class IndianannouncementModel(BaseModel):
    id:str
    target_lan: str
    

from pydantic import BaseModel

class IndianannouncementModel(BaseModel):
    link : str
    target_lan: str
    

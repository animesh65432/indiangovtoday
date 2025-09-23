from pydantic import BaseModel

class SaveModel(BaseModel):
    id : str
    UserId : str 
    lan : str
    link : str
    
    
from pydantic import BaseModel

class AddSave(BaseModel):
    title:str
    content:str
    source:str
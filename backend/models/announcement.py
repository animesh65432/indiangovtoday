from pydantic import BaseModel
from typing import Optional

class Announcement(BaseModel):
    title: Optional[str]
    content: Optional[str]
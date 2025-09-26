from pydantic import BaseModel
from typing import Optional

class Announcement(BaseModel):
    content: Optional[str]
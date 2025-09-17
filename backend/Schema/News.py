from pydantic import BaseModel


class AnnouncementsModel(BaseModel):
    title: str
    source: str

class Announcements(AnnouncementsModel):
    id: str

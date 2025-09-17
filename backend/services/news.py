from typing import List, Optional
from Schema import AnnouncementsModel,Announcements
from database import announcements_collection
from bson import ObjectId

def insert_announcements(announcements: List[AnnouncementsModel]):
    
    announcements = [AnnouncementsModel(**doc) for doc in announcements]
    docs = [announcement.dict() for announcement in announcements]
    result = announcements_collection.insert_many(docs)

    return {"inserted_count": len(result.inserted_ids)}

async def get_all_announcements() -> List[Announcements]:
    cursor = announcements_collection.find({})
    docs = cursor.to_list(length=None)

    return [
        Announcements(
            id=str(doc["_id"]),
            title=doc["title"],
            source=doc["source"]
        )
        for doc in docs
    ]

async def Get_announcement_by_id(announcement_id: str) -> Optional[Announcements]:
    doc = announcements_collection.find_one({"_id": ObjectId(announcement_id)})  
    if doc:
        return Announcements(
            id=str(doc["_id"]),
            title=doc["title"],
            source=doc["source"]
        )
    return None


def clear_announcements():
    announcements_collection.delete_many({})
    return {"message": "All announcements cleared."}
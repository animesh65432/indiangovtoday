from config import config
from motor.motor_asyncio import AsyncIOMotorClient

_client: AsyncIOMotorClient | None = None
_db = None

async def get_database():
    global _client, _db

    if _client is None:
        _client = AsyncIOMotorClient(config["MONGODB_URL"])
        _db = _client["IndianGovtAnnouncements"]

    return _db

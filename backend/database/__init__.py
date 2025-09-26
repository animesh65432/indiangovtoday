from config import config
from motor.motor_asyncio import AsyncIOMotorClient

client = AsyncIOMotorClient(config["MONGODB_URL"])
db = client["IndianGovtAnnouncements"]

users = db["users"]
saves = db["saves"]
announcements = db["announcements"]

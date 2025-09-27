from http.client import HTTPException
from config import config
from motor.motor_asyncio import AsyncIOMotorClient


async def get_database():
    try:
        # Create fresh client each time (temporary fix)
        client = AsyncIOMotorClient(
            config["MONGODB_URL"],
            serverSelectionTimeoutMS=5000
        )
        db = client["IndianGovtAnnouncements"]
        
      
        await client.admin.command('ping')
        
        return db
        
    except Exception as e:
        print(f"Fresh client error: {e}")
        raise HTTPException(status_code=503, detail=f"Database error: {str(e)}")
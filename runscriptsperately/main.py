import asyncio
import json
from upstash_redis.asyncio import Redis
from config import config
from utils.schedulerscrapeannouncementsreleases import scrape_and_store_announcements

redis = Redis(url=config["UPSTASH_REDIS_REST_URL"], token=config["UPSTASH_REDIS_REST_TOKEN"])

async def worker():
    while True:
        task_json = await redis.rpop("task_queue")
        if task_json:
            task = json.loads(task_json)
            if task["task"] == "scrape_announcements":
                await scrape_and_store_announcements()
        else:
            await asyncio.sleep(5)  
if __name__ == "__main__":
    asyncio.run(worker())

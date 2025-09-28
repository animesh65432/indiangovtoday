import asyncio
import json
from utils.schedulerscrapeannouncementsreleases import scrape_and_store_announcements
from redis import redis

async def worker():
    print("call function")
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

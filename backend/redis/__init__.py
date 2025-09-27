from upstash_redis.asyncio import Redis
from config import config

redis = Redis(
    url=config["UPSTASH_REDIS_REST_URL"], 
    token=config["UPSTASH_REDIS_REST_TOKEN"]
)

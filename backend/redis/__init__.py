from config import config
from upstash_redis import Redis


redis = Redis(
    url=config["UPSTASH_REDIS_REST_URL"], 
    token=config["UPSTASH_REDIS_REST_TOKEN"]
)

import os
import redis_om

redis_client = redis_om.get_redis_connection(
    host=os.getenv("REDIS_HOST"),
    port=os.getenv("REDIS_portT"),
    password=os.getenv("REDIS_PASSWORD"),
    decode_responses=True
)

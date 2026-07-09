from motor.motor_asyncio import AsyncIOMotorClient
import redis.asyncio as redis
from app.core.Settings import settings


class Database:
    client: AsyncIOMotorClient | None = None
    db = None


class RedisClient:
    client: redis.Redis | None = None


database = Database()
redis_client = RedisClient()


async def connect_to_mongo():
    database.client = AsyncIOMotorClient(settings.MONGO_URI)
    database.db = database.client[settings.MONGO_DB_NAME]
    await database.db.users.create_index("email", unique=True)
    await database.db.users.create_index("phone_number", unique=True)
    await database.db.drivers.create_index("email", unique=True)
    await database.db.drivers.create_index("phone_number", unique=True)
    await database.db.admins.create_index("email", unique=True)


async def close_mongo_connection():
    if database.client:
        database.client.close()


async def connect_to_redis():
    redis_client.client = redis.Redis(
        host=settings.REDIS_HOST,
        port=settings.REDIS_PORT,
        db=settings.REDIS_DB,
        password=settings.REDIS_PASSWORD or None,
        decode_responses=True,
    )


async def close_redis_connection():
    if redis_client.client:
        await redis_client.client.close()


def get_db():
    return database.db


def get_redis():
    return redis_client.client

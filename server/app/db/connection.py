from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from app.core.Settings import settings


class Database:
    client: AsyncIOMotorClient | None = None
    db: AsyncIOMotorDatabase | None = None

database = Database()

async def connect_to_mongo() -> None:
    if database.client is None:
        database.client = AsyncIOMotorClient(settings.MONGO_URI)
        database.db = database.client[settings.MONGO_DB_NAME]
        print("✅ MongoDB Connected")


async def close_mongo_connection() -> None:
    if database.client:
        database.client.close()
        database.client = None
        database.db = None
        print("❌ MongoDB Disconnected")


def get_db() -> AsyncIOMotorDatabase:
    if database.db is None:
        raise RuntimeError("Database is not connected.")
    return database.db
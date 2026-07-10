from motor.motor_asyncio import AsyncIOMotorClient
from app.core.Settings import settings


class Database:
    client: AsyncIOMotorClient | None = None
    db = None


database = Database()


async def connect_to_mongo():
    database.client = AsyncIOMotorClient(settings.MONGO_URI)
    database.db = database.client[settings.MONGO_DB_NAME]
    await database.db.users.create_index("email", unique=True)
    await database.db.users.create_index("phone_number", unique=True)
    await database.db.drivers.create_index("email", unique=True)
    await database.db.drivers.create_index("phone_number", unique=True)
    await database.db.admins.create_index("email", unique=True)

    await database.db.otp_registrations.create_index(
        [("role", 1), ("email", 1)], unique=True
    )
    await database.db.otp_registrations.create_index(
        "created_at", expireAfterSeconds=settings.TEMP_REGISTRATION_TTL_SECONDS
    )


async def close_mongo_connection():
    if database.client:
        database.client.close()


def get_db():
    return database.db

from datetime import datetime
from app.db.connection import get_db


class TempRegistrationRepository:

    @staticmethod
    async def upsert(email: str, data: dict):
        db = get_db()
        data["email"] = email
        data["created_at"] = datetime.utcnow()
        return await db.temp_registrations.update_one(
            {"email": email},
            {"$set": data},
            upsert=True
        )

    @staticmethod
    async def get(email: str):
        db = get_db()
        return await db.temp_registrations.find_one({"email": email})

    @staticmethod
    async def delete(email: str):
        db = get_db()
        return await db.temp_registrations.delete_one({"email": email})

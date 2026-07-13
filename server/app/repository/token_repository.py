from datetime import datetime
from app.db.connection import get_db


class TokenRepository:

    @staticmethod
    async def store(user_id: str, refresh_token: str, expires_at: datetime):
        db = get_db()
        return await db.refresh_tokens.insert_one(
            {
                "user_id": user_id,
                "refresh_token": refresh_token,
                "expires_at": expires_at,
                "created_at": datetime.utcnow()
            }
        )

    @staticmethod
    async def get(refresh_token: str):
        db = get_db()
        return await db.refresh_tokens.find_one({"refresh_token": refresh_token})

    @staticmethod
    async def delete(refresh_token: str):
        db = get_db()
        return await db.refresh_tokens.delete_one({"refresh_token": refresh_token})

    @staticmethod
    async def delete_all_for_user(user_id: str):
        db = get_db()
        return await db.refresh_tokens.delete_many({"user_id": user_id})

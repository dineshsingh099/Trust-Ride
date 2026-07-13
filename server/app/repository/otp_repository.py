from datetime import datetime
from app.db.connection import get_db


class OTPRepository:

    @staticmethod
    async def upsert_otp(email: str, purpose: str, otp_hash: str, expires_at: datetime):
        db = get_db()
        return await db.otps.update_one(
            {"email": email, "purpose": purpose},
            {
                "$set": {
                    "email": email,
                    "purpose": purpose,
                    "otp_hash": otp_hash,
                    "expires_at": expires_at,
                    "created_at": datetime.utcnow()
                }
            },
            upsert=True
        )

    @staticmethod
    async def get_otp(email: str, purpose: str):
        db = get_db()
        return await db.otps.find_one({"email": email, "purpose": purpose})

    @staticmethod
    async def delete_otp(email: str, purpose: str):
        db = get_db()
        return await db.otps.delete_one({"email": email, "purpose": purpose})

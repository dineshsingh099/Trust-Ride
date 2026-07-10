from datetime import datetime, timedelta, timezone
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.core.Settings import settings
from app.utils.otp_generator import generate_otp
from app.utils.security import hash_password
from app.services.email_service import send_otp_email

COLLECTION = "otp_registrations"


def _now() -> datetime:
    return datetime.now(timezone.utc)


async def create_temp_registration(db: AsyncIOMotorDatabase, role: str, email: str, data: dict) -> str:
    payload = dict(data)
    payload["password"] = hash_password(payload["password"])
    otp = generate_otp()
    otp_expires_at = _now() + timedelta(seconds=settings.OTP_EXPIRE_SECONDS)

    await db[COLLECTION].update_one(
        {"role": role, "email": email},
        {
            "$set": {
                "role": role,
                "email": email,
                "temp_data": payload,
                "otp": otp,
                "otp_expires_at": otp_expires_at,
                "created_at": _now(),
            }
        },
        upsert=True,
    )
    await send_otp_email(email, otp, data.get("name", ""))
    return otp


async def resend_otp(db: AsyncIOMotorDatabase, role: str, email: str) -> bool:
    doc = await db[COLLECTION].find_one({"role": role, "email": email})
    if not doc:
        return False
    otp = generate_otp()
    otp_expires_at = _now() + timedelta(seconds=settings.OTP_EXPIRE_SECONDS)
    await db[COLLECTION].update_one(
        {"role": role, "email": email},
        {"$set": {"otp": otp, "otp_expires_at": otp_expires_at}},
    )
    await send_otp_email(email, otp, doc["temp_data"].get("name", ""))
    return True


async def verify_otp(db: AsyncIOMotorDatabase, role: str, email: str, otp: str) -> dict | None:
    doc = await db[COLLECTION].find_one({"role": role, "email": email})
    if not doc:
        return None
    if doc["otp"] != otp:
        return None
    if doc["otp_expires_at"].replace(tzinfo=timezone.utc) < _now():
        return None
    await db[COLLECTION].delete_one({"_id": doc["_id"]})
    return doc["temp_data"]

import json
from redis.asyncio import Redis
from app.core.Settings import settings
from app.utils.otp_generator import generate_otp
from app.utils.security import hash_password
from app.services.email_service import send_otp_email


def _otp_key(role: str, email: str) -> str:
    return f"otp:{role}:{email}"


def _temp_data_key(role: str, email: str) -> str:
    return f"temp_registration:{role}:{email}"


async def create_temp_registration(redis: Redis, role: str, email: str, data: dict) -> str:
    payload = dict(data)
    payload["password"] = hash_password(payload["password"])
    await redis.set(_temp_data_key(role, email), json.dumps(payload), ex=settings.TEMP_REGISTRATION_TTL_SECONDS)
    otp = generate_otp()
    await redis.set(_otp_key(role, email), otp, ex=settings.OTP_EXPIRE_SECONDS)
    await send_otp_email(email, otp, data.get("name", ""))
    return otp


async def resend_otp(redis: Redis, role: str, email: str) -> bool:
    temp_data_raw = await redis.get(_temp_data_key(role, email))
    if not temp_data_raw:
        return False
    temp_data = json.loads(temp_data_raw)
    otp = generate_otp()
    await redis.set(_otp_key(role, email), otp, ex=settings.OTP_EXPIRE_SECONDS)
    await send_otp_email(email, otp, temp_data.get("name", ""))
    return True


async def verify_otp(redis: Redis, role: str, email: str, otp: str) -> dict | None:
    stored_otp = await redis.get(_otp_key(role, email))
    if not stored_otp or stored_otp != otp:
        return None
    temp_data_raw = await redis.get(_temp_data_key(role, email))
    if not temp_data_raw:
        return None
    await redis.delete(_otp_key(role, email))
    await redis.delete(_temp_data_key(role, email))
    return json.loads(temp_data_raw)

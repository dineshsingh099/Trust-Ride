from motor.motor_asyncio import AsyncIOMotorDatabase
from redis.asyncio import Redis
from bson import ObjectId
from fastapi import HTTPException, status
from app.schemas.user_schemas import UserRegisterRequest
from app.schemas.auth_schemas import LoginRequest, OTPVerifyRequest, ResendOTPRequest, ForgotPasswordRequest, ResetPasswordRequest
import app.services.user_service as user_service


async def register(db: AsyncIOMotorDatabase, redis: Redis, payload: UserRegisterRequest):
    return await user_service.register_user(db, redis, payload)


async def send_otp(redis: Redis, payload: ResendOTPRequest):
    return await user_service.resend_user_otp(redis, payload.email)


async def resend_otp(redis: Redis, payload: ResendOTPRequest):
    return await user_service.resend_user_otp(redis, payload.email)


async def verify_otp(db: AsyncIOMotorDatabase, redis: Redis, payload: OTPVerifyRequest):
    return await user_service.verify_user_otp(db, redis, payload.email, payload.otp)


async def login(db: AsyncIOMotorDatabase, payload: LoginRequest):
    return await user_service.login_user(db, payload.email, payload.password)


async def get_profile(db: AsyncIOMotorDatabase, user_id: str):
    user = await db.users.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "User not found")
    return {
        "name": user["name"],
        "email": user["email"],
        "phone_number": user["phone_number"],
        "role": user["role"],
        "created_at": user["created_at"],
    }


async def forgot_password(db: AsyncIOMotorDatabase, payload: ForgotPasswordRequest):
    return await user_service.forgot_password_user(db, payload.email)


async def reset_password(db: AsyncIOMotorDatabase, payload: ResetPasswordRequest):
    return await user_service.reset_password_user(db, payload.token, payload.new_password)

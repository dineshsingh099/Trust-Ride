from motor.motor_asyncio import AsyncIOMotorDatabase
from redis.asyncio import Redis
from bson import ObjectId
from fastapi import HTTPException, status
from app.schemas.driver_schemas import (
    DriverRegisterRequest,
    DriverProfileFormRequest,
    DriverDocumentResubmitRequest,
)
from app.schemas.auth_schemas import LoginRequest, OTPVerifyRequest, ResendOTPRequest, ForgotPasswordRequest, ResetPasswordRequest
import app.services.driver_service as driver_service


async def register(db: AsyncIOMotorDatabase, redis: Redis, payload: DriverRegisterRequest):
    return await driver_service.register_driver(db, redis, payload)


async def send_otp(redis: Redis, payload: ResendOTPRequest):
    return await driver_service.resend_driver_otp(redis, payload.email)


async def resend_otp(redis: Redis, payload: ResendOTPRequest):
    return await driver_service.resend_driver_otp(redis, payload.email)


async def verify_otp(db: AsyncIOMotorDatabase, redis: Redis, payload: OTPVerifyRequest):
    return await driver_service.verify_driver_otp(db, redis, payload.email, payload.otp)


async def login(db: AsyncIOMotorDatabase, payload: LoginRequest):
    return await driver_service.login_driver(db, payload.email, payload.password)


async def submit_profile_form(db: AsyncIOMotorDatabase, driver_id: str, payload: DriverProfileFormRequest):
    return await driver_service.submit_driver_profile_form(db, driver_id, payload)


async def resubmit_documents(db: AsyncIOMotorDatabase, driver_id: str, payload: DriverDocumentResubmitRequest):
    return await driver_service.resubmit_driver_documents(db, driver_id, payload)


async def get_profile(db: AsyncIOMotorDatabase, driver_id: str):
    driver = await db.drivers.find_one({"_id": ObjectId(driver_id)})
    if not driver:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Driver not found")
    return {
        "name": driver["name"],
        "email": driver["email"],
        "phone_number": driver["phone_number"],
        "role": driver["role"],
        "profile_completed": driver["profile_completed"],
        "document_status": driver["documents"]["status"],
        "rejection_reason": driver["documents"].get("rejection_reason"),
        "created_at": driver["created_at"],
    }


async def forgot_password(db: AsyncIOMotorDatabase, payload: ForgotPasswordRequest):
    return await driver_service.forgot_password_driver(db, payload.email)


async def reset_password(db: AsyncIOMotorDatabase, payload: ResetPasswordRequest):
    return await driver_service.reset_password_driver(db, payload.token, payload.new_password)

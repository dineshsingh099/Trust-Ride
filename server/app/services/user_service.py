from datetime import datetime, timezone
from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorDatabase
from fastapi import HTTPException, Response, status
from app.schemas.user_schemas import UserRegisterRequest
from app.services.otp_service import create_temp_registration, resend_otp, verify_otp
from app.services.token_service import issue_tokens
from app.utils.security import verify_password, hash_password
from app.utils.jwt_handler import create_password_reset_token, decode_token
from app.utils.cookies import set_auth_cookies
from app.services.email_service import send_password_reset_email
from app.core.Settings import settings


async def register_user(db: AsyncIOMotorDatabase, payload: UserRegisterRequest):
    existing = await db.users.find_one({"email": payload.email})
    if existing:
        raise HTTPException(status.HTTP_409_CONFLICT, "Email already registered")
    existing_phone = await db.users.find_one({"phone_number": payload.phone_number})
    if existing_phone:
        raise HTTPException(status.HTTP_409_CONFLICT, "Phone number already registered")
    await create_temp_registration(db, "user", payload.email, payload.model_dump())
    return {"message": "OTP sent to your email. Please verify to complete registration."}


async def resend_user_otp(db: AsyncIOMotorDatabase, email: str):
    ok = await resend_otp(db, "user", email)
    if not ok:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "No pending registration found or it has expired")
    return {"message": "OTP resent successfully"}


async def verify_user_otp(db: AsyncIOMotorDatabase, response: Response, email: str, otp: str):
    data = await verify_otp(db, "user", email, otp)
    if not data:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Invalid or expired OTP")
    user_doc = {
        "name": data["name"],
        "email": data["email"],
        "phone_number": data["phone_number"],
        "password_hash": data["password"],
        "is_verified": True,
        "role": "user",
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc),
        "last_login": None,
    }
    result = await db.users.insert_one(user_doc)
    tokens = await issue_tokens(db, str(result.inserted_id), "user")
    set_auth_cookies(response, tokens["access_token"], tokens["refresh_token"])
    return {"message": "Account verified successfully", "role": "user"}


async def login_user(db: AsyncIOMotorDatabase, response: Response, email: str, password: str):
    user = await db.users.find_one({"email": email})
    if not user or not verify_password(password, user["password_hash"]):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid email or password")
    if not user.get("is_verified"):
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Account not verified")
    await db.users.update_one({"_id": user["_id"]}, {"$set": {"last_login": datetime.now(timezone.utc)}})
    tokens = await issue_tokens(db, str(user["_id"]), "user")
    set_auth_cookies(response, tokens["access_token"], tokens["refresh_token"])
    return {"message": "Login successful", "role": "user"}


async def forgot_password_user(db: AsyncIOMotorDatabase, email: str):
    user = await db.users.find_one({"email": email})
    if not user:
        return {"message": "If the email exists, a reset link has been sent"}
    token, _ = create_password_reset_token(str(user["_id"]), "user")
    reset_link = f"{settings.FRONTEND_URL}/user/reset-password?token={token}"
    await send_password_reset_email(email, reset_link, user["name"])
    return {"message": "If the email exists, a reset link has been sent"}


async def reset_password_user(db: AsyncIOMotorDatabase, token: str, new_password: str):
    try:
        payload = decode_token(token)
    except ValueError:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Invalid or expired token")
    if payload.get("type") != "password_reset" or payload.get("role") != "user":
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Invalid token")
    result = await db.users.update_one(
        {"_id": ObjectId(payload["sub"])},
        {"$set": {"password_hash": hash_password(new_password), "updated_at": datetime.now(timezone.utc)}},
    )
    if result.matched_count == 0:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "User not found")
    return {"message": "Password reset successfully"}

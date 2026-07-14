from datetime import datetime, timedelta
from fastapi import Request, Response
from app.repository.auth_repository import UserRepository
from app.repository.otp_repository import OTPRepository
from app.repository.token_repository import TokenRepository
from app.schemas.admin_schema import (
    AdminLoginSchema,
    AdminForgotPasswordSchema,
    AdminResetPasswordSchema
)
from app.core.security import hash_password, verify_password, generate_otp
from app.core.jwt import create_access_token, create_refresh_token, decode_token
from app.core.cookies import set_auth_cookies, clear_auth_cookies, extract_bearer_token
from app.core.Settings import settings
from app.utils.email_utils import send_admin_otp_email

RESET_PURPOSE = "admin_reset_password"


class AdminService:
    """
    Admin only has: login, logout, refresh-token, forgot-password, reset-password, profile.
    There is NO admin register and NO admin verify-otp (registration) route.
    Admin accounts are created manually (directly in the database / via a seed script).
    OTP is only used here for the forgot-password -> reset-password flow.
    """

    @staticmethod
    async def login(data: AdminLoginSchema, response: Response):
        admin = await UserRepository.get_by_email(data.email)

        if not admin or admin.get("role") != "admin":
            raise Exception("Invalid email or password")

        if not verify_password(data.password, admin["password"]):
            raise Exception("Invalid email or password")

        if not admin.get("is_active"):
            raise Exception("Admin account is inactive")

        admin_id = str(admin["_id"])

        access_token = create_access_token({"user_id": admin_id, "role": "admin"})
        refresh_token = create_refresh_token({"user_id": admin_id, "role": "admin"})
        refresh_expires_at = datetime.utcnow() + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)

        await TokenRepository.store(admin_id, refresh_token, refresh_expires_at)
        await UserRepository.update_last_login(admin_id)
        set_auth_cookies(response, access_token, refresh_token)

        return {
            "access_token": access_token,
            "token_type": "bearer",
            "message": "Admin login successful"
        }

    @staticmethod
    async def logout(request: Request, response: Response):
        refresh_token = request.cookies.get("refresh_token")
        access_token = request.cookies.get("access_token")

        if not access_token:
            access_token = extract_bearer_token(request.headers.get("Authorization"))

        if not access_token and not refresh_token:
            raise Exception("You are already logged out")

        if access_token and await TokenRepository.is_blacklisted(access_token):
            raise Exception("You are already logged out")

        if refresh_token:
            refresh_payload = decode_token(refresh_token)
            refresh_expires_at = (
                datetime.utcfromtimestamp(refresh_payload["exp"])
                if refresh_payload
                else datetime.utcnow() + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
            )
            await TokenRepository.delete(refresh_token)
            await TokenRepository.blacklist_token(refresh_token, refresh_expires_at)

        if access_token:
            access_payload = decode_token(access_token)
            access_expires_at = (
                datetime.utcfromtimestamp(access_payload["exp"])
                if access_payload
                else datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
            )
            await TokenRepository.blacklist_token(access_token, access_expires_at)

        clear_auth_cookies(response)

        return {"message": "Admin logged out successfully"}

    @staticmethod
    async def refresh_token(request: Request, response: Response):
        refresh_token = request.cookies.get("refresh_token")

        if not refresh_token:
            raise Exception("Refresh token not found")

        if await TokenRepository.is_blacklisted(refresh_token):
            clear_auth_cookies(response)
            raise Exception("Refresh token has been revoked")

        token_doc = await TokenRepository.get(refresh_token)
        if not token_doc:
            clear_auth_cookies(response)
            raise Exception("Invalid or expired refresh token")

        payload = decode_token(refresh_token)
        if not payload or payload.get("type") != "refresh" or payload.get("role") != "admin":
            await TokenRepository.delete(refresh_token)
            clear_auth_cookies(response)
            raise Exception("Invalid refresh token")

        admin_id = payload.get("user_id")

        await TokenRepository.delete(refresh_token)
        await TokenRepository.blacklist_token(refresh_token, datetime.utcfromtimestamp(payload["exp"]))

        access_token = create_access_token({"user_id": admin_id, "role": "admin"})
        new_refresh_token = create_refresh_token({"user_id": admin_id, "role": "admin"})
        refresh_expires_at = datetime.utcnow() + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)

        await TokenRepository.store(admin_id, new_refresh_token, refresh_expires_at)
        set_auth_cookies(response, access_token, new_refresh_token)

        return {
            "access_token": access_token,
            "token_type": "bearer",
            "message": "Admin token refreshed successfully"
        }

    @staticmethod
    async def forgot_password(data: AdminForgotPasswordSchema):
        admin = await UserRepository.get_by_email(data.email)
        if not admin or admin.get("role") != "admin":
            raise Exception("No admin account found with this email")

        otp = generate_otp(settings.OTP_LENGTH)
        otp_hash = hash_password(otp)
        expires_at = datetime.utcnow() + timedelta(seconds=settings.OTP_EXPIRE_SECONDS)

        await OTPRepository.upsert_otp(data.email, RESET_PURPOSE, otp_hash, expires_at)
        await send_admin_otp_email(data.email, otp, "admin password reset")

        return {"message": "OTP sent to admin email for password reset"}

    @staticmethod
    async def reset_password(data: AdminResetPasswordSchema, request: Request, response: Response):
        otp_doc = await OTPRepository.get_otp(data.email, RESET_PURPOSE)
        if not otp_doc:
            raise Exception("No OTP request found for this admin email")

        if otp_doc["expires_at"] < datetime.utcnow():
            await OTPRepository.delete_otp(data.email, RESET_PURPOSE)
            raise Exception("OTP expired, please request again")

        if not verify_password(data.otp, otp_doc["otp_hash"]):
            raise Exception("Invalid OTP")

        admin = await UserRepository.get_by_email(data.email)
        if not admin or admin.get("role") != "admin":
            raise Exception("No admin account found with this email")

        hashed_password = hash_password(data.new_password)
        admin_id = str(admin["_id"])

        await UserRepository.update(admin_id, {"password": hashed_password})
        await OTPRepository.delete_otp(data.email, RESET_PURPOSE)

        # password reset ho te hi saare purane tokens (refresh + access) turant delete/invalid
        await TokenRepository.delete_all_for_user(admin_id)

        access_token = request.cookies.get("access_token")
        if not access_token:
            access_token = extract_bearer_token(request.headers.get("Authorization"))

        if access_token:
            access_payload = decode_token(access_token)
            access_expires_at = (
                datetime.utcfromtimestamp(access_payload["exp"])
                if access_payload
                else datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
            )
            await TokenRepository.blacklist_token(access_token, access_expires_at)

        refresh_token = request.cookies.get("refresh_token")
        if refresh_token:
            refresh_payload = decode_token(refresh_token)
            refresh_expires_at = (
                datetime.utcfromtimestamp(refresh_payload["exp"])
                if refresh_payload
                else datetime.utcnow() + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
            )
            await TokenRepository.delete(refresh_token)
            await TokenRepository.blacklist_token(refresh_token, refresh_expires_at)

        clear_auth_cookies(response)

        return {"message": "Admin password reset successfully, please login again"}

    @staticmethod
    async def get_profile(admin: dict):
        return {
            "id": str(admin["_id"]),
            "full_name": admin["full_name"],
            "email": admin["email"],
            "phone": admin["phone"],
            "role": admin.get("role", "admin"),
            "is_verified": admin.get("is_verified", False),
            "is_active": admin.get("is_active", True),
            "last_login": admin.get("last_login"),
        }

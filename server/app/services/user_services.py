from datetime import datetime, timedelta
from app.repository.auth_repository import UserRepository
from app.repository.otp_repository import OTPRepository
from app.repository.temp_registration_repository import TempRegistrationRepository
from app.repository.token_repository import TokenRepository
from app.schemas.user_schema import (
    RegisterSchema,
    LoginSchema,
    SendOTPSchema,
    VerifyOTPSchema,
    ForgotPasswordSchema,
    ResetPasswordSchema,
    RefreshTokenSchema,
    LogoutSchema
)
from app.models.user_model import UserModel
from app.core.security import hash_password, verify_password, generate_otp
from app.core.jwt import create_access_token, create_refresh_token, decode_token
from app.core.Settings import settings
from app.utils.email_utils import send_otp_email


class AuthService:

    @staticmethod
    async def register(data: RegisterSchema):
        existing_user = await UserRepository.get_by_email(data.email)
        if existing_user and existing_user.get("is_verified"):
            raise Exception("Email already exists")

        otp = generate_otp(settings.OTP_LENGTH)
        otp_hash = hash_password(otp)
        hashed_password = hash_password(data.password)
        expires_at = datetime.utcnow() + timedelta(seconds=settings.OTP_EXPIRE_SECONDS)

        await TempRegistrationRepository.upsert(
            data.email,
            {
                "full_name": data.full_name,
                "phone": data.phone,
                "password": hashed_password,
                "otp_hash": otp_hash,
                "otp_expires_at": expires_at
            }
        )

        await send_otp_email(data.email, otp, "registration")

        return {"message": "OTP sent to email, please verify to complete registration"}

    @staticmethod
    async def verify_otp(data: VerifyOTPSchema):
        temp = await TempRegistrationRepository.get(data.email)
        if not temp:
            raise Exception("No pending registration found for this email")

        if temp["otp_expires_at"] < datetime.utcnow():
            await TempRegistrationRepository.delete(data.email)
            raise Exception("OTP expired, please register again")

        if not verify_password(data.otp, temp["otp_hash"]):
            raise Exception("Invalid OTP")

        new_user = UserModel(
            full_name=temp["full_name"],
            email=data.email,
            phone=temp["phone"],
            password=temp["password"],
            is_verified=True
        )

        user_id = await UserRepository.create(new_user)
        await TempRegistrationRepository.delete(data.email)

        access_token = create_access_token({"user_id": user_id})
        refresh_token = create_refresh_token({"user_id": user_id})
        refresh_expires_at = datetime.utcnow() + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)

        await TokenRepository.store(user_id, refresh_token, refresh_expires_at)

        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer"
        }

    @staticmethod
    async def send_otp(data: SendOTPSchema):
        temp = await TempRegistrationRepository.get(data.email)
        if not temp:
            raise Exception("No pending registration found for this email")

        otp = generate_otp(settings.OTP_LENGTH)
        otp_hash = hash_password(otp)
        expires_at = datetime.utcnow() + timedelta(seconds=settings.OTP_EXPIRE_SECONDS)

        await TempRegistrationRepository.upsert(
            data.email,
            {
                "full_name": temp["full_name"],
                "phone": temp["phone"],
                "password": temp["password"],
                "otp_hash": otp_hash,
                "otp_expires_at": expires_at
            }
        )

        await send_otp_email(data.email, otp, "registration")

        return {"message": "OTP sent successfully"}

    @staticmethod
    async def login(data: LoginSchema):
        user = await UserRepository.get_by_email(data.email)

        if not user:
            raise Exception("Invalid email or password")

        if not verify_password(data.password, user["password"]):
            raise Exception("Invalid email or password")

        if not user.get("is_verified"):
            raise Exception("Please verify your email before logging in")

        if not user.get("is_active") or user.get("is_deleted"):
            raise Exception("Account is inactive")

        user_id = str(user["_id"])

        access_token = create_access_token({"user_id": user_id})
        refresh_token = create_refresh_token({"user_id": user_id})
        refresh_expires_at = datetime.utcnow() + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)

        await TokenRepository.store(user_id, refresh_token, refresh_expires_at)
        await UserRepository.update_last_login(user_id)

        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer"
        }

    @staticmethod
    async def logout(data: LogoutSchema):
        token_doc = await TokenRepository.get(data.refresh_token)
        if not token_doc:
            raise Exception("Invalid refresh token")

        await TokenRepository.delete(data.refresh_token)

        return {"message": "Logged out successfully"}

    @staticmethod
    async def refresh_token(data: RefreshTokenSchema):
        token_doc = await TokenRepository.get(data.refresh_token)
        if not token_doc:
            raise Exception("Invalid or expired refresh token")

        payload = decode_token(data.refresh_token)
        if not payload or payload.get("type") != "refresh":
            await TokenRepository.delete(data.refresh_token)
            raise Exception("Invalid refresh token")

        user_id = payload.get("user_id")

        await TokenRepository.delete(data.refresh_token)

        access_token = create_access_token({"user_id": user_id})
        new_refresh_token = create_refresh_token({"user_id": user_id})
        refresh_expires_at = datetime.utcnow() + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)

        await TokenRepository.store(user_id, new_refresh_token, refresh_expires_at)

        return {
            "access_token": access_token,
            "refresh_token": new_refresh_token,
            "token_type": "bearer"
        }

    @staticmethod
    async def forgot_password(data: ForgotPasswordSchema):
        user = await UserRepository.get_by_email(data.email)
        if not user:
            raise Exception("No account found with this email")

        otp = generate_otp(settings.OTP_LENGTH)
        otp_hash = hash_password(otp)
        expires_at = datetime.utcnow() + timedelta(seconds=settings.OTP_EXPIRE_SECONDS)

        await OTPRepository.upsert_otp(data.email, "reset_password", otp_hash, expires_at)
        await send_otp_email(data.email, otp, "password reset")

        return {"message": "OTP sent to email for password reset"}

    @staticmethod
    async def reset_password(data: ResetPasswordSchema):
        otp_doc = await OTPRepository.get_otp(data.email, "reset_password")
        if not otp_doc:
            raise Exception("No OTP request found for this email")

        if otp_doc["expires_at"] < datetime.utcnow():
            await OTPRepository.delete_otp(data.email, "reset_password")
            raise Exception("OTP expired, please request again")

        if not verify_password(data.otp, otp_doc["otp_hash"]):
            raise Exception("Invalid OTP")

        user = await UserRepository.get_by_email(data.email)
        if not user:
            raise Exception("No account found with this email")

        hashed_password = hash_password(data.new_password)
        user_id = str(user["_id"])

        await UserRepository.update(user_id, {"password": hashed_password})
        await OTPRepository.delete_otp(data.email, "reset_password")
        await TokenRepository.delete_all_for_user(user_id)

        return {"message": "Password reset successfully"}

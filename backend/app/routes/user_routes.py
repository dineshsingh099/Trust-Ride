from fastapi import APIRouter, Request, Depends
from app.db.connection import get_db, get_redis
from app.middlewares.auth_middleware import get_current_user
from app.middlewares.rate_limit_middleware import limiter
from app.schemas.user_schemas import UserRegisterRequest, UserProfileResponse
from app.schemas.auth_schemas import (
    LoginRequest,
    OTPVerifyRequest,
    ResendOTPRequest,
    ForgotPasswordRequest,
    ResetPasswordRequest,
    RefreshTokenRequest,
    TokenResponse,
    AccessTokenResponse,
    MessageResponse,
)
import app.controllers.user_controller as user_controller
import app.services.token_service as token_service

router = APIRouter(prefix="/api/v1/user", tags=["User"])


@router.post("/register", response_model=MessageResponse)
@limiter.limit("5/minute")
async def register(request: Request, payload: UserRegisterRequest):
    return await user_controller.register(get_db(), get_redis(), payload)


@router.post("/send-otp", response_model=MessageResponse)
@limiter.limit("5/minute")
async def send_otp(request: Request, payload: ResendOTPRequest):
    return await user_controller.send_otp(get_redis(), payload)


@router.post("/resend-otp", response_model=MessageResponse)
@limiter.limit("3/minute")
async def resend_otp(request: Request, payload: ResendOTPRequest):
    return await user_controller.resend_otp(get_redis(), payload)


@router.post("/verify-otp")
@limiter.limit("10/minute")
async def verify_otp(request: Request, payload: OTPVerifyRequest):
    return await user_controller.verify_otp(get_db(), get_redis(), payload)


@router.post("/login", response_model=TokenResponse)
@limiter.limit("10/minute")
async def login(request: Request, payload: LoginRequest):
    return await user_controller.login(get_db(), payload)


@router.get("/dashboard")
async def dashboard(current_user: dict = Depends(get_current_user)):
    return {"message": "Welcome to your dashboard", "user_id": current_user["sub"]}


@router.post("/refresh-token", response_model=AccessTokenResponse)
async def refresh_token(payload: RefreshTokenRequest):
    access_token = await token_service.rotate_access_token(get_db(), payload.refresh_token)
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/forgot-password", response_model=MessageResponse)
@limiter.limit("5/minute")
async def forgot_password(request: Request, payload: ForgotPasswordRequest):
    return await user_controller.forgot_password(get_db(), payload)


@router.post("/reset-password", response_model=MessageResponse)
@limiter.limit("5/minute")
async def reset_password(request: Request, payload: ResetPasswordRequest):
    return await user_controller.reset_password(get_db(), payload)


@router.get("/profile", response_model=UserProfileResponse)
async def profile(current_user: dict = Depends(get_current_user)):
    return await user_controller.get_profile(get_db(), current_user["sub"])

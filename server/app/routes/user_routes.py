from fastapi import APIRouter, Depends, Request, Response
from app.db.connection import get_db
from app.middlewares.auth_middleware import get_current_user
from app.utils.rate_limiter import rate_limit
from app.schemas.user_schemas import UserRegisterRequest, UserProfileResponse
from app.schemas.auth_schemas import (
    LoginRequest,
    OTPVerifyRequest,
    ResendOTPRequest,
    ForgotPasswordRequest,
    ResetPasswordRequest,
    MessageResponse,
    AuthResponse,
)
import app.controllers.user_controller as user_controller
import app.services.session_service as session_service

router = APIRouter(prefix="/api/v1/user", tags=["User"])


@router.post("/register", response_model=MessageResponse, dependencies=[Depends(rate_limit(5, 60))])
async def register(payload: UserRegisterRequest):
    return await user_controller.register(get_db(), payload)


@router.post("/send-otp", response_model=MessageResponse, dependencies=[Depends(rate_limit(5, 60))])
async def send_otp(payload: ResendOTPRequest):
    return await user_controller.send_otp(get_db(), payload)


@router.post("/resend-otp", response_model=MessageResponse, dependencies=[Depends(rate_limit(3, 60))])
async def resend_otp(payload: ResendOTPRequest):
    return await user_controller.resend_otp(get_db(), payload)


@router.post("/verify-otp", response_model=AuthResponse, dependencies=[Depends(rate_limit(10, 60))])
async def verify_otp(response: Response, payload: OTPVerifyRequest):
    return await user_controller.verify_otp(get_db(), response, payload)


@router.post("/login", response_model=AuthResponse, dependencies=[Depends(rate_limit(10, 60))])
async def login(response: Response, payload: LoginRequest):
    return await user_controller.login(get_db(), response, payload)


@router.get("/dashboard")
async def dashboard(current_user: dict = Depends(get_current_user)):
    return {"message": "Welcome to your dashboard", "user_id": current_user["sub"]}


@router.post("/refresh-token", response_model=MessageResponse)
async def refresh_token(request: Request, response: Response):
    return await session_service.refresh_session(get_db(), request, response)


@router.post("/logout", response_model=MessageResponse)
async def logout(request: Request, response: Response):
    return await session_service.logout_session(get_db(), request, response)


@router.post("/forgot-password", response_model=MessageResponse, dependencies=[Depends(rate_limit(5, 60))])
async def forgot_password(payload: ForgotPasswordRequest):
    return await user_controller.forgot_password(get_db(), payload)


@router.post("/reset-password", response_model=MessageResponse, dependencies=[Depends(rate_limit(5, 60))])
async def reset_password(payload: ResetPasswordRequest):
    return await user_controller.reset_password(get_db(), payload)


@router.get("/profile", response_model=UserProfileResponse)
async def profile(current_user: dict = Depends(get_current_user)):
    return await user_controller.get_profile(get_db(), current_user["sub"])

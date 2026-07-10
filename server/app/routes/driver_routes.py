from fastapi import APIRouter, Depends, Request, Response
from app.db.connection import get_db
from app.middlewares.auth_middleware import get_current_driver
from app.utils.rate_limiter import rate_limit
from app.schemas.driver_schemas import (
    DriverRegisterRequest,
    DriverProfileFormRequest,
    DriverDocumentResubmitRequest,
    DriverProfileResponse,
)
from app.schemas.auth_schemas import (
    LoginRequest,
    OTPVerifyRequest,
    ResendOTPRequest,
    ForgotPasswordRequest,
    ResetPasswordRequest,
    MessageResponse,
    AuthResponse,
)
import app.controllers.driver_controller as driver_controller
import app.services.session_service as session_service

router = APIRouter(prefix="/api/v1/driver", tags=["Driver"])


@router.post("/register", response_model=MessageResponse, dependencies=[Depends(rate_limit(5, 60))])
async def register(payload: DriverRegisterRequest):
    return await driver_controller.register(get_db(), payload)


@router.post("/send-otp", response_model=MessageResponse, dependencies=[Depends(rate_limit(5, 60))])
async def send_otp(payload: ResendOTPRequest):
    return await driver_controller.send_otp(get_db(), payload)


@router.post("/resend-otp", response_model=MessageResponse, dependencies=[Depends(rate_limit(3, 60))])
async def resend_otp(payload: ResendOTPRequest):
    return await driver_controller.resend_otp(get_db(), payload)


@router.post("/verify-otp", response_model=AuthResponse, dependencies=[Depends(rate_limit(10, 60))])
async def verify_otp(response: Response, payload: OTPVerifyRequest):
    return await driver_controller.verify_otp(get_db(), response, payload)


@router.post("/login", dependencies=[Depends(rate_limit(10, 60))])
async def login(response: Response, payload: LoginRequest):
    return await driver_controller.login(get_db(), response, payload)


@router.post("/profile-form", response_model=MessageResponse)
async def submit_profile_form(payload: DriverProfileFormRequest, current_driver: dict = Depends(get_current_driver)):
    return await driver_controller.submit_profile_form(get_db(), current_driver["sub"], payload)


@router.post("/documents/resubmit", response_model=MessageResponse)
async def resubmit_documents(payload: DriverDocumentResubmitRequest, current_driver: dict = Depends(get_current_driver)):
    return await driver_controller.resubmit_documents(get_db(), current_driver["sub"], payload)


@router.get("/dashboard")
async def dashboard(current_driver: dict = Depends(get_current_driver)):
    return {"message": "Welcome to your dashboard", "driver_id": current_driver["sub"]}


@router.post("/refresh-token", response_model=MessageResponse)
async def refresh_token(request: Request, response: Response):
    return await session_service.refresh_session(get_db(), request, response)


@router.post("/logout", response_model=MessageResponse)
async def logout(request: Request, response: Response):
    return await session_service.logout_session(get_db(), request, response)


@router.post("/forgot-password", response_model=MessageResponse, dependencies=[Depends(rate_limit(5, 60))])
async def forgot_password(payload: ForgotPasswordRequest):
    return await driver_controller.forgot_password(get_db(), payload)


@router.post("/reset-password", response_model=MessageResponse, dependencies=[Depends(rate_limit(5, 60))])
async def reset_password(payload: ResetPasswordRequest):
    return await driver_controller.reset_password(get_db(), payload)


@router.get("/profile", response_model=DriverProfileResponse)
async def profile(current_driver: dict = Depends(get_current_driver)):
    return await driver_controller.get_profile(get_db(), current_driver["sub"])

from fastapi import APIRouter
from app.controllers.auth_controller import AuthController
from app.schemas.user_schema import (
    RegisterSchema,
    LoginSchema,
    SendOTPSchema,
    VerifyOTPSchema,
    ForgotPasswordSchema,
    ResetPasswordSchema,
    RefreshTokenSchema,
    LogoutSchema,
    TokenResponseSchema,
    MessageResponseSchema
)

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/register", response_model=MessageResponseSchema)
async def register(data: RegisterSchema):
    return await AuthController.register(data)


@router.post("/verify-otp", response_model=TokenResponseSchema)
async def verify_otp(data: VerifyOTPSchema):
    return await AuthController.verify_otp(data)


@router.post("/send-otp", response_model=MessageResponseSchema)
async def send_otp(data: SendOTPSchema):
    return await AuthController.send_otp(data)


@router.post("/login", response_model=TokenResponseSchema)
async def login(data: LoginSchema):
    return await AuthController.login(data)


@router.post("/logout", response_model=MessageResponseSchema)
async def logout(data: LogoutSchema):
    return await AuthController.logout(data)


@router.post("/refresh-token", response_model=TokenResponseSchema)
async def refresh_token(data: RefreshTokenSchema):
    return await AuthController.refresh_token(data)


@router.post("/forgot-password", response_model=MessageResponseSchema)
async def forgot_password(data: ForgotPasswordSchema):
    return await AuthController.forgot_password(data)


@router.post("/reset-password", response_model=MessageResponseSchema)
async def reset_password(data: ResetPasswordSchema):
    return await AuthController.reset_password(data)

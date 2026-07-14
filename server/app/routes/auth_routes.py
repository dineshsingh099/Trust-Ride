from fastapi import APIRouter, Request, Response
from app.controllers.auth_controller import AuthController
from app.core.limiter import limiter
from app.schemas.user_schema import (
    RegisterSchema,
    LoginSchema,
    SendOTPSchema,
    VerifyOTPSchema,
    ForgotPasswordSchema,
    ResetPasswordSchema,
    TokenResponseSchema,
    MessageResponseSchema
)

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/register", response_model=MessageResponseSchema)
@limiter.limit("5/minute")
async def register(request: Request, data: RegisterSchema):
    return await AuthController.register(data)


@router.post("/verify-otp", response_model=TokenResponseSchema)
@limiter.limit("10/minute")
async def verify_otp(request: Request, data: VerifyOTPSchema, response: Response):
    return await AuthController.verify_otp(data, response)


@router.post("/send-otp", response_model=MessageResponseSchema)
@limiter.limit("5/minute")
async def send_otp(request: Request, data: SendOTPSchema):
    return await AuthController.send_otp(data)


@router.post("/login", response_model=TokenResponseSchema)
@limiter.limit("10/minute")
async def login(request: Request, data: LoginSchema, response: Response):
    return await AuthController.login(data, response)


@router.post("/logout", response_model=MessageResponseSchema)
async def logout(request: Request, response: Response):
    return await AuthController.logout(request, response)


@router.post("/refresh-token", response_model=TokenResponseSchema)
async def refresh_token(request: Request, response: Response):
    return await AuthController.refresh_token(request, response)


@router.post("/forgot-password", response_model=MessageResponseSchema)
@limiter.limit("5/minute")
async def forgot_password(request: Request, data: ForgotPasswordSchema):
    return await AuthController.forgot_password(data)


@router.post("/reset-password", response_model=MessageResponseSchema)
@limiter.limit("10/minute")
async def reset_password(request: Request, data: ResetPasswordSchema, response: Response):
    return await AuthController.reset_password(data, request, response)

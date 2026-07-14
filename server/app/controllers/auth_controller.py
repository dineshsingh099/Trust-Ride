from fastapi import HTTPException, Request, Response, status
from app.services.user_services import AuthService
from app.schemas.user_schema import (
    RegisterSchema,
    LoginSchema,
    SendOTPSchema,
    VerifyOTPSchema,
    ForgotPasswordSchema,
    ResetPasswordSchema
)


class AuthController:

    @staticmethod
    async def register(data: RegisterSchema):
        try:
            return await AuthService.register(data)
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

    @staticmethod
    async def verify_otp(data: VerifyOTPSchema, response: Response):
        try:
            return await AuthService.verify_otp(data, response)
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

    @staticmethod
    async def send_otp(data: SendOTPSchema):
        try:
            return await AuthService.send_otp(data)
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

    @staticmethod
    async def login(data: LoginSchema, response: Response):
        try:
            return await AuthService.login(data, response)
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(e))

    @staticmethod
    async def logout(request: Request, response: Response):
        try:
            return await AuthService.logout(request, response)
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

    @staticmethod
    async def refresh_token(request: Request, response: Response):
        try:
            return await AuthService.refresh_token(request, response)
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(e))

    @staticmethod
    async def forgot_password(data: ForgotPasswordSchema):
        try:
            return await AuthService.forgot_password(data)
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

    @staticmethod
    async def reset_password(data: ResetPasswordSchema, request: Request, response: Response):
        try:
            return await AuthService.reset_password(data, request, response)
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

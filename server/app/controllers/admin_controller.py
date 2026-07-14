from fastapi import HTTPException, Request, Response, status
from app.services.admin_services import AdminService
from app.schemas.admin_schema import (
    AdminLoginSchema,
    AdminForgotPasswordSchema,
    AdminResetPasswordSchema
)


class AdminController:

    @staticmethod
    async def login(data: AdminLoginSchema, response: Response):
        try:
            return await AdminService.login(data, response)
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(e))

    @staticmethod
    async def logout(request: Request, response: Response):
        try:
            return await AdminService.logout(request, response)
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

    @staticmethod
    async def refresh_token(request: Request, response: Response):
        try:
            return await AdminService.refresh_token(request, response)
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(e))

    @staticmethod
    async def forgot_password(data: AdminForgotPasswordSchema):
        try:
            return await AdminService.forgot_password(data)
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

    @staticmethod
    async def reset_password(data: AdminResetPasswordSchema, request: Request, response: Response):
        try:
            return await AdminService.reset_password(data, request, response)
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

    @staticmethod
    async def get_profile(admin: dict):
        try:
            return await AdminService.get_profile(admin)
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

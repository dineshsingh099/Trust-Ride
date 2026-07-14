from fastapi import APIRouter, Depends, Request, Response
from app.controllers.admin_controller import AdminController
from app.core.limiter import limiter
from app.middlewares.admin_middleware import get_current_admin
from app.schemas.admin_schema import (
    AdminLoginSchema,
    AdminForgotPasswordSchema,
    AdminResetPasswordSchema,
    AdminResponseSchema
)
from app.schemas.user_schema import TokenResponseSchema, MessageResponseSchema

router = APIRouter(prefix="/admin", tags=["Admin"])


@router.post("/login", response_model=TokenResponseSchema)
@limiter.limit("5/minute")
async def admin_login(request: Request, data: AdminLoginSchema, response: Response):
    return await AdminController.login(data, response)


@router.post("/logout", response_model=MessageResponseSchema)
async def admin_logout(request: Request, response: Response):
    return await AdminController.logout(request, response)


@router.post("/refresh-token", response_model=TokenResponseSchema)
async def admin_refresh_token(request: Request, response: Response):
    return await AdminController.refresh_token(request, response)


@router.post("/forgot-password", response_model=MessageResponseSchema)
@limiter.limit("5/minute")
async def admin_forgot_password(request: Request, data: AdminForgotPasswordSchema):
    return await AdminController.forgot_password(data)


@router.post("/reset-password", response_model=MessageResponseSchema)
@limiter.limit("10/minute")
async def admin_reset_password(request: Request, data: AdminResetPasswordSchema, response: Response):
    return await AdminController.reset_password(data, request, response)


@router.get("/profile", response_model=AdminResponseSchema)
async def admin_profile(admin: dict = Depends(get_current_admin)):
    return await AdminController.get_profile(admin)

from fastapi import APIRouter, Depends, Request, Response
from app.db.connection import get_db
from app.middlewares.auth_middleware import get_current_admin
from app.utils.rate_limiter import rate_limit
from app.schemas.auth_schemas import LoginRequest, ChangePasswordRequest, MessageResponse, AuthResponse
from app.schemas.admin_schemas import AdminDocumentReviewRequest
import app.controllers.admin_controller as admin_controller
import app.services.session_service as session_service

router = APIRouter(prefix="/api/v1/admin", tags=["Admin"])


@router.post("/login", response_model=AuthResponse, dependencies=[Depends(rate_limit(10, 60))])
async def login(response: Response, payload: LoginRequest):
    return await admin_controller.login(get_db(), response, payload)


@router.post("/refresh-token", response_model=MessageResponse)
async def refresh_token(request: Request, response: Response):
    return await session_service.refresh_session(get_db(), request, response)


@router.post("/logout", response_model=MessageResponse)
async def logout(request: Request, response: Response):
    return await session_service.logout_session(get_db(), request, response)


@router.post("/change-password", response_model=MessageResponse)
async def change_password(payload: ChangePasswordRequest, current_admin: dict = Depends(get_current_admin)):
    return await admin_controller.change_password(get_db(), current_admin["sub"], payload)


@router.get("/dashboard")
async def dashboard(current_admin: dict = Depends(get_current_admin)):
    return {"message": "Welcome to the Admin dashboard"}


@router.get("/drivers/pending")
async def pending_drivers(current_admin: dict = Depends(get_current_admin)):
    return await admin_controller.list_pending_drivers(get_db())


@router.post("/drivers/review", response_model=MessageResponse)
async def review_driver(payload: AdminDocumentReviewRequest, current_admin: dict = Depends(get_current_admin)):
    return await admin_controller.review_driver(get_db(), payload)

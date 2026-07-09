from fastapi import APIRouter, Request, Depends
from app.db.connection import get_db
from app.middlewares.auth_middleware import get_current_admin
from app.middlewares.rate_limit_middleware import limiter
from app.schemas.auth_schemas import LoginRequest, ChangePasswordRequest, MessageResponse, RefreshTokenRequest, AccessTokenResponse
from app.schemas.admin_schemas import AdminDocumentReviewRequest
import app.controllers.admin_controller as admin_controller
import app.services.token_service as token_service

router = APIRouter(prefix="/api/v1/admin", tags=["Admin"])


@router.post("/login")
@limiter.limit("10/minute")
async def login(request: Request, payload: LoginRequest):
    return await admin_controller.login(get_db(), payload)


@router.post("/refresh-token", response_model=AccessTokenResponse)
async def refresh_token(payload: RefreshTokenRequest):
    access_token = await token_service.rotate_access_token(get_db(), payload.refresh_token)
    return {"access_token": access_token, "token_type": "bearer"}


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

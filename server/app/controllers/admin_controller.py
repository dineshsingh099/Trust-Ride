from motor.motor_asyncio import AsyncIOMotorDatabase
from fastapi import Response
from app.schemas.auth_schemas import LoginRequest, ChangePasswordRequest
from app.schemas.admin_schemas import AdminDocumentReviewRequest
import app.services.admin_service as admin_service


async def login(db: AsyncIOMotorDatabase, response: Response, payload: LoginRequest):
    return await admin_service.login_admin(db, response, payload.email, payload.password)


async def change_password(db: AsyncIOMotorDatabase, admin_id: str, payload: ChangePasswordRequest):
    return await admin_service.change_admin_password(db, admin_id, payload.old_password, payload.new_password)


async def list_pending_drivers(db: AsyncIOMotorDatabase):
    return await admin_service.list_pending_drivers(db)


async def review_driver(db: AsyncIOMotorDatabase, payload: AdminDocumentReviewRequest):
    return await admin_service.review_driver_documents(db, payload.driver_id, payload.decision, payload.rejection_reason)

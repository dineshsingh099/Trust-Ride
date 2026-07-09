from datetime import datetime, timezone
from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorDatabase
from fastapi import HTTPException, status
from app.utils.security import verify_password, hash_password
from app.services.token_service import issue_tokens
from app.services.email_service import send_document_status_email
from app.core.Settings import settings


async def ensure_default_admin(db: AsyncIOMotorDatabase):
    existing = await db.admins.find_one({"email": settings.ADMIN_DEFAULT_EMAIL})
    if existing:
        return
    await db.admins.insert_one(
        {
            "name": "Super Admin",
            "email": settings.ADMIN_DEFAULT_EMAIL,
            "password_hash": hash_password(settings.ADMIN_DEFAULT_PASSWORD),
            "role": "admin",
            "must_change_password": True,
            "created_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc),
            "last_login": None,
        }
    )


async def login_admin(db: AsyncIOMotorDatabase, email: str, password: str):
    admin = await db.admins.find_one({"email": email})
    if not admin or not verify_password(password, admin["password_hash"]):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid email or password")
    await db.admins.update_one({"_id": admin["_id"]}, {"$set": {"last_login": datetime.now(timezone.utc)}})
    tokens = await issue_tokens(db, str(admin["_id"]), "admin")
    return {"tokens": tokens, "must_change_password": admin.get("must_change_password", False)}


async def change_admin_password(db: AsyncIOMotorDatabase, admin_id: str, old_password: str, new_password: str):
    admin = await db.admins.find_one({"_id": ObjectId(admin_id)})
    if not admin:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Admin not found")
    if not verify_password(old_password, admin["password_hash"]):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Old password is incorrect")
    await db.admins.update_one(
        {"_id": ObjectId(admin_id)},
        {
            "$set": {
                "password_hash": hash_password(new_password),
                "must_change_password": False,
                "updated_at": datetime.now(timezone.utc),
            }
        },
    )
    return {"message": "Password changed successfully"}


async def list_pending_drivers(db: AsyncIOMotorDatabase):
    cursor = db.drivers.find({"documents.status": "pending_review"})
    drivers = []
    async for d in cursor:
        drivers.append(
            {
                "id": str(d["_id"]),
                "name": d["name"],
                "email": d["email"],
                "vehicle_info": d.get("vehicle_info"),
                "documents": d.get("documents"),
            }
        )
    return drivers


async def review_driver_documents(db: AsyncIOMotorDatabase, driver_id: str, decision: str, rejection_reason: str | None):
    driver = await db.drivers.find_one({"_id": ObjectId(driver_id)})
    if not driver:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Driver not found")
    if decision == "approve":
        update = {
            "documents.status": "approved",
            "documents.rejection_reason": None,
            "documents.reviewed_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc),
        }
        await db.drivers.update_one({"_id": ObjectId(driver_id)}, {"$set": update})
        await send_document_status_email(driver["email"], driver["name"], approved=True)
        return {"message": "Driver documents approved"}
    if not rejection_reason:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Rejection reason is required")
    update = {
        "documents.status": "rejected",
        "documents.rejection_reason": rejection_reason,
        "documents.reviewed_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc),
    }
    await db.drivers.update_one({"_id": ObjectId(driver_id)}, {"$set": update})
    await send_document_status_email(driver["email"], driver["name"], approved=False, reason=rejection_reason)
    return {"message": "Driver documents rejected"}

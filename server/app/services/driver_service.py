from datetime import datetime, timezone
from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorDatabase
from fastapi import HTTPException, Response, status
from app.schemas.driver_schemas import DriverRegisterRequest, DriverProfileFormRequest, DriverDocumentResubmitRequest
from app.services.otp_service import create_temp_registration, resend_otp, verify_otp
from app.services.token_service import issue_tokens
from app.utils.security import verify_password, hash_password
from app.utils.jwt_handler import create_password_reset_token, decode_token
from app.utils.cookies import set_auth_cookies
from app.services.email_service import send_password_reset_email
from app.core.Settings import settings


async def register_driver(db: AsyncIOMotorDatabase, payload: DriverRegisterRequest):
    existing = await db.drivers.find_one({"email": payload.email})
    if existing:
        raise HTTPException(status.HTTP_409_CONFLICT, "Email already registered")
    existing_phone = await db.drivers.find_one({"phone_number": payload.phone_number})
    if existing_phone:
        raise HTTPException(status.HTTP_409_CONFLICT, "Phone number already registered")
    await create_temp_registration(db, "driver", payload.email, payload.model_dump())
    return {"message": "OTP sent to your email. Please verify to complete registration."}


async def resend_driver_otp(db: AsyncIOMotorDatabase, email: str):
    ok = await resend_otp(db, "driver", email)
    if not ok:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "No pending registration found or it has expired")
    return {"message": "OTP resent successfully"}


async def verify_driver_otp(db: AsyncIOMotorDatabase, response: Response, email: str, otp: str):
    data = await verify_otp(db, "driver", email, otp)
    if not data:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Invalid or expired OTP")
    driver_doc = {
        "name": data["name"],
        "email": data["email"],
        "phone_number": data["phone_number"],
        "password_hash": data["password"],
        "is_verified": True,
        "role": "driver",
        "profile_completed": False,
        "vehicle_info": None,
        "documents": {
            "driving_license_url": None,
            "rc_url": None,
            "insurance_url": None,
            "vehicle_image_urls": [],
            "identity_document_urls": [],
            "other_document_urls": [],
            "status": "not_submitted",
            "rejection_reason": None,
            "submitted_at": None,
            "reviewed_at": None,
        },
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc),
        "last_login": None,
    }
    result = await db.drivers.insert_one(driver_doc)
    tokens = await issue_tokens(db, str(result.inserted_id), "driver")
    set_auth_cookies(response, tokens["access_token"], tokens["refresh_token"])
    return {"message": "Account verified successfully", "role": "driver"}


async def login_driver(db: AsyncIOMotorDatabase, response: Response, email: str, password: str):
    driver = await db.drivers.find_one({"email": email})
    if not driver or not verify_password(password, driver["password_hash"]):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid email or password")
    if not driver.get("is_verified"):
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Account not verified")
    await db.drivers.update_one({"_id": driver["_id"]}, {"$set": {"last_login": datetime.now(timezone.utc)}})
    tokens = await issue_tokens(db, str(driver["_id"]), "driver")
    set_auth_cookies(response, tokens["access_token"], tokens["refresh_token"])
    return {
        "message": "Login successful",
        "role": "driver",
        "profile_completed": driver.get("profile_completed", False),
        "auto_filled": {"name": driver["name"], "email": driver["email"], "phone_number": driver["phone_number"]},
    }


async def submit_driver_profile_form(db: AsyncIOMotorDatabase, driver_id: str, payload: DriverProfileFormRequest):
    driver = await db.drivers.find_one({"_id": ObjectId(driver_id)})
    if not driver:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Driver not found")
    if driver.get("profile_completed"):
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Profile form already submitted")
    payload_data = payload.model_dump(mode="json")
    update = {
        "vehicle_info": payload_data["vehicle_info"],
        "documents": {
            "driving_license_url": payload_data["driving_license_url"],
            "rc_url": payload_data["rc_url"],
            "insurance_url": payload_data["insurance_url"],
            "vehicle_image_urls": payload_data["vehicle_image_urls"],
            "identity_document_urls": payload_data["identity_document_urls"],
            "other_document_urls": payload_data["other_document_urls"],
            "status": "pending_review",
            "rejection_reason": None,
            "submitted_at": datetime.now(timezone.utc),
            "reviewed_at": None,
        },
        "profile_completed": True,
        "updated_at": datetime.now(timezone.utc),
    }
    await db.drivers.update_one({"_id": ObjectId(driver_id)}, {"$set": update})
    return {"message": "Profile submitted successfully. Documents are pending Admin review."}


async def resubmit_driver_documents(db: AsyncIOMotorDatabase, driver_id: str, payload: DriverDocumentResubmitRequest):
    driver = await db.drivers.find_one({"_id": ObjectId(driver_id)})
    if not driver:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Driver not found")
    if driver["documents"]["status"] != "rejected":
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Documents are not in a rejected state")
    updates = {k: v for k, v in payload.model_dump(mode="json").items() if v is not None}
    updates["status"] = "pending_review"
    updates["rejection_reason"] = None
    updates["submitted_at"] = datetime.now(timezone.utc)
    updates["reviewed_at"] = None
    set_fields = {f"documents.{k}": v for k, v in updates.items()}
    set_fields["updated_at"] = datetime.now(timezone.utc)
    await db.drivers.update_one({"_id": ObjectId(driver_id)}, {"$set": set_fields})
    return {"message": "Documents resubmitted for Admin review"}


async def forgot_password_driver(db: AsyncIOMotorDatabase, email: str):
    driver = await db.drivers.find_one({"email": email})
    if not driver:
        return {"message": "If the email exists, a reset link has been sent"}
    token, _ = create_password_reset_token(str(driver["_id"]), "driver")
    reset_link = f"{settings.FRONTEND_URL}/driver/reset-password?token={token}"
    await send_password_reset_email(email, reset_link, driver["name"])
    return {"message": "If the email exists, a reset link has been sent"}


async def reset_password_driver(db: AsyncIOMotorDatabase, token: str, new_password: str):
    try:
        payload = decode_token(token)
    except ValueError:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Invalid or expired token")
    if payload.get("type") != "password_reset" or payload.get("role") != "driver":
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Invalid token")
    result = await db.drivers.update_one(
        {"_id": ObjectId(payload["sub"])},
        {"$set": {"password_hash": hash_password(new_password), "updated_at": datetime.now(timezone.utc)}},
    )
    if result.matched_count == 0:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Driver not found")
    return {"message": "Password reset successfully"}

from motor.motor_asyncio import AsyncIOMotorDatabase
from app.utils.jwt_handler import create_access_token, create_refresh_token, decode_token


async def issue_tokens(db: AsyncIOMotorDatabase, user_id: str, role: str) -> dict:
    access_token = create_access_token(user_id, role)
    refresh_token, expires_at = create_refresh_token(user_id, role)
    await db.refresh_tokens.insert_one(
        {
            "user_id": user_id,
            "role": role,
            "token": refresh_token,
            "expires_at": expires_at,
            "revoked": False,
        }
    )
    return {"access_token": access_token, "refresh_token": refresh_token, "token_type": "bearer"}


async def rotate_access_token(db: AsyncIOMotorDatabase, refresh_token: str) -> str:
    payload = decode_token(refresh_token)
    if payload.get("type") != "refresh":
        raise ValueError("Invalid token type")
    stored = await db.refresh_tokens.find_one({"token": refresh_token, "revoked": False})
    if not stored:
        raise ValueError("Refresh token not recognized or revoked")
    return create_access_token(payload["sub"], payload["role"])


async def revoke_refresh_token(db: AsyncIOMotorDatabase, refresh_token: str):
    await db.refresh_tokens.update_one({"token": refresh_token}, {"$set": {"revoked": True}})

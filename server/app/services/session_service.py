from fastapi import HTTPException, Request, Response, status
from motor.motor_asyncio import AsyncIOMotorDatabase
import app.services.token_service as token_service
from app.utils.cookies import REFRESH_COOKIE, set_access_cookie, clear_auth_cookies


async def refresh_session(db: AsyncIOMotorDatabase, request: Request, response: Response):
    refresh_token_value = request.cookies.get(REFRESH_COOKIE)
    if not refresh_token_value:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Refresh token missing")
    try:
        access_token = await token_service.rotate_access_token(db, refresh_token_value)
    except ValueError:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid or expired refresh token")
    set_access_cookie(response, access_token)
    return {"message": "Token refreshed successfully"}


async def logout_session(db: AsyncIOMotorDatabase, request: Request, response: Response):
    refresh_token_value = request.cookies.get(REFRESH_COOKIE)
    if refresh_token_value:
        await token_service.revoke_refresh_token(db, refresh_token_value)
    clear_auth_cookies(response)
    return {"message": "Logged out successfully"}

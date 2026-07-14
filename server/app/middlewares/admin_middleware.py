from fastapi import Request, HTTPException, status
from app.core.jwt import decode_token
from app.core.cookies import extract_bearer_token
from app.repository.auth_repository import UserRepository
from app.repository.token_repository import TokenRepository


async def get_current_admin(request: Request):
    token = request.cookies.get("access_token")

    if not token:
        token = extract_bearer_token(request.headers.get("Authorization"))

    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")

    if await TokenRepository.is_blacklisted(token):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token has been revoked")

    payload = decode_token(token)

    if not payload or payload.get("type") != "access":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token")

    if payload.get("role") != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin access required")

    user_id = payload.get("user_id")
    admin = await UserRepository.get_by_id(user_id)

    if not admin or not admin.get("is_active"):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Admin not found or inactive")

    if admin.get("role") != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin access required")

    return admin

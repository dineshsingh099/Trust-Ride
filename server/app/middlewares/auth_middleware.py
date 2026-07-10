from fastapi import Request, HTTPException, status
from app.utils.jwt_handler import decode_token
from app.utils.cookies import ACCESS_COOKIE


def _decode_and_check(request: Request, expected_role: str) -> dict:
    token = request.cookies.get(ACCESS_COOKIE)
    if not token:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Not authenticated")
    try:
        payload = decode_token(token)
    except ValueError:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid or expired token")
    if payload.get("type") != "access":
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid token type")
    if payload.get("role") != expected_role:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Insufficient permissions")
    return payload


def get_current_user(request: Request) -> dict:
    return _decode_and_check(request, "user")


def get_current_driver(request: Request) -> dict:
    return _decode_and_check(request, "driver")


def get_current_admin(request: Request) -> dict:
    return _decode_and_check(request, "admin")

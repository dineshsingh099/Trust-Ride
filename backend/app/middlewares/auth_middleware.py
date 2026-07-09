from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.utils.jwt_handler import decode_token

bearer_scheme = HTTPBearer()


def _decode_and_check(credentials: HTTPAuthorizationCredentials, expected_role: str) -> dict:
    try:
        payload = decode_token(credentials.credentials)
    except ValueError:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid or expired token")
    if payload.get("type") != "access":
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid token type")
    if payload.get("role") != expected_role:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Insufficient permissions")
    return payload


def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme)) -> dict:
    return _decode_and_check(credentials, "user")


def get_current_driver(credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme)) -> dict:
    return _decode_and_check(credentials, "driver")


def get_current_admin(credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme)) -> dict:
    return _decode_and_check(credentials, "admin")

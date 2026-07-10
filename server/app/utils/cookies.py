from fastapi import Response
from app.core.Settings import settings

ACCESS_COOKIE = "access_token"
REFRESH_COOKIE = "refresh_token"


def set_access_cookie(response: Response, access_token: str):
    response.set_cookie(
        key=ACCESS_COOKIE,
        value=access_token,
        httponly=True,
        secure=True,
        samesite="none",
        max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        path="/",
    )


def set_refresh_cookie(response: Response, refresh_token: str):
    response.set_cookie(
        key=REFRESH_COOKIE,
        value=refresh_token,
        httponly=True,
        secure=True,
        samesite="none",
        max_age=settings.REFRESH_TOKEN_EXPIRE_DAYS * 86400,
        path="/",
    )


def set_auth_cookies(response: Response, access_token: str, refresh_token: str):
    set_access_cookie(response, access_token)
    set_refresh_cookie(response, refresh_token)


def clear_auth_cookies(response: Response):
    response.delete_cookie(ACCESS_COOKIE, path="/")
    response.delete_cookie(REFRESH_COOKIE, path="/")

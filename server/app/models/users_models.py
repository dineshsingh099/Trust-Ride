from datetime import datetime, timezone
from typing import Optional
from pydantic import BaseModel, EmailStr, Field


class UserModel(BaseModel):
    name: str
    email: EmailStr
    phone_number: str
    password_hash: str
    is_verified: bool = True
    role: str = "user"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    last_login: Optional[datetime] = None


class RefreshTokenModel(BaseModel):
    user_id: str
    token: str
    role: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    expires_at: datetime
    revoked: bool = False


class PasswordResetModel(BaseModel):
    email: EmailStr
    token: str
    role: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    expires_at: datetime
    used: bool = False

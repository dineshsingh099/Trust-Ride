from datetime import datetime, timezone
from typing import Optional
from pydantic import BaseModel, EmailStr, Field


class AdminModel(BaseModel):
    name: str = "Super Admin"
    email: EmailStr
    password_hash: str
    role: str = "admin"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    last_login: Optional[datetime] = None

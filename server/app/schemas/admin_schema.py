from datetime import datetime
from pydantic import BaseModel, ConfigDict, EmailStr, Field


class AdminLoginSchema(BaseModel):
    email: EmailStr
    password: str


class AdminForgotPasswordSchema(BaseModel):
    email: EmailStr


class AdminResetPasswordSchema(BaseModel):
    email: EmailStr
    otp: str
    new_password: str = Field(min_length=8)


class AdminResponseSchema(BaseModel):
    id: str
    full_name: str
    email: EmailStr
    phone: str
    role: str = "admin"
    is_verified: bool
    is_active: bool
    last_login: datetime | None = None

    model_config = ConfigDict(from_attributes=True)

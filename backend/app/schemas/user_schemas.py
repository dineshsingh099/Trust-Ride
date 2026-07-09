from datetime import datetime
from pydantic import BaseModel, EmailStr, Field


class UserRegisterRequest(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    email: EmailStr
    phone_number: str = Field(min_length=8, max_length=15)
    password: str = Field(min_length=8)


class UserProfileResponse(BaseModel):
    name: str
    email: EmailStr
    phone_number: str
    role: str
    created_at: datetime

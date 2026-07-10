from datetime import datetime
from pydantic import BaseModel, EmailStr, Field, field_validator
from app.utils.validators import validate_password_strength, validate_name, validate_phone_number


class UserRegisterRequest(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    email: EmailStr
    phone_number: str
    password: str

    @field_validator("name")
    @classmethod
    def check_name(cls, value: str) -> str:
        return validate_name(value)

    @field_validator("phone_number")
    @classmethod
    def check_phone_number(cls, value: str) -> str:
        return validate_phone_number(value)

    @field_validator("password")
    @classmethod
    def check_password(cls, value: str) -> str:
        return validate_password_strength(value)


class UserProfileResponse(BaseModel):
    name: str
    email: EmailStr
    phone_number: str
    role: str
    created_at: datetime

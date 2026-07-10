from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, Field, HttpUrl, field_validator
from app.utils.validators import validate_password_strength, validate_name, validate_phone_number


class DriverRegisterRequest(BaseModel):
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


class VehicleInfoRequest(BaseModel):
    vehicle_type: str = Field(min_length=2, max_length=50)
    make: str = Field(min_length=1, max_length=50)
    model: str = Field(min_length=1, max_length=50)
    year: str = Field(pattern=r"^(19|20)\d{2}$")
    plate_number: str = Field(min_length=4, max_length=15)
    color: str = Field(min_length=2, max_length=30)


class DriverProfileFormRequest(BaseModel):
    vehicle_info: VehicleInfoRequest
    driving_license_url: HttpUrl
    rc_url: HttpUrl
    insurance_url: HttpUrl
    vehicle_image_urls: list[HttpUrl] = Field(min_length=1)
    identity_document_urls: list[HttpUrl] = Field(min_length=1)
    other_document_urls: list[HttpUrl] = []


class DriverDocumentResubmitRequest(BaseModel):
    driving_license_url: Optional[HttpUrl] = None
    rc_url: Optional[HttpUrl] = None
    insurance_url: Optional[HttpUrl] = None
    vehicle_image_urls: Optional[list[HttpUrl]] = None
    identity_document_urls: Optional[list[HttpUrl]] = None
    other_document_urls: Optional[list[HttpUrl]] = None


class DriverProfileResponse(BaseModel):
    name: str
    email: EmailStr
    phone_number: str
    role: str
    profile_completed: bool
    document_status: str
    rejection_reason: Optional[str] = None
    created_at: datetime

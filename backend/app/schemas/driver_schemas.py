from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, Field


class DriverRegisterRequest(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    email: EmailStr
    phone_number: str = Field(min_length=8, max_length=15)
    password: str = Field(min_length=8)


class VehicleInfoRequest(BaseModel):
    vehicle_type: str
    make: str
    model: str
    year: str
    plate_number: str
    color: str


class DriverProfileFormRequest(BaseModel):
    vehicle_info: VehicleInfoRequest
    driving_license_url: str
    rc_url: str
    insurance_url: str
    vehicle_image_urls: list[str]
    identity_document_urls: list[str]
    other_document_urls: list[str] = []


class DriverDocumentResubmitRequest(BaseModel):
    driving_license_url: Optional[str] = None
    rc_url: Optional[str] = None
    insurance_url: Optional[str] = None
    vehicle_image_urls: Optional[list[str]] = None
    identity_document_urls: Optional[list[str]] = None
    other_document_urls: Optional[list[str]] = None


class DriverProfileResponse(BaseModel):
    name: str
    email: EmailStr
    phone_number: str
    role: str
    profile_completed: bool
    document_status: str
    rejection_reason: Optional[str] = None
    created_at: datetime

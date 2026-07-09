from datetime import datetime, timezone
from typing import Optional
from pydantic import BaseModel, EmailStr, Field


class VehicleInfo(BaseModel):
    vehicle_type: str
    make: str
    model: str
    year: str
    plate_number: str
    color: str


class DocumentSubmission(BaseModel):
    driving_license_url: Optional[str] = None
    rc_url: Optional[str] = None
    insurance_url: Optional[str] = None
    vehicle_image_urls: list[str] = []
    identity_document_urls: list[str] = []
    other_document_urls: list[str] = []
    status: str = "not_submitted"
    rejection_reason: Optional[str] = None
    submitted_at: Optional[datetime] = None
    reviewed_at: Optional[datetime] = None


class DriverModel(BaseModel):
    name: str
    email: EmailStr
    phone_number: str
    password_hash: str
    is_verified: bool = True
    role: str = "driver"
    profile_completed: bool = False
    vehicle_info: Optional[VehicleInfo] = None
    documents: DocumentSubmission = Field(default_factory=DocumentSubmission)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    last_login: Optional[datetime] = None

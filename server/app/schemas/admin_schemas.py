from typing import Optional
from pydantic import BaseModel, Field, field_validator
from app.utils.validators import validate_object_id


class AdminDocumentReviewRequest(BaseModel):
    driver_id: str
    decision: str = Field(pattern="^(approve|reject)$")
    rejection_reason: Optional[str] = Field(default=None, max_length=500)

    @field_validator("driver_id")
    @classmethod
    def check_driver_id(cls, value: str) -> str:
        return validate_object_id(value)

from pydantic import BaseModel, Field


class AdminDocumentReviewRequest(BaseModel):
    driver_id: str
    decision: str = Field(pattern="^(approve|reject)$")
    rejection_reason: str | None = None

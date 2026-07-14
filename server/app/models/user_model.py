from datetime import datetime
from pydantic import BaseModel, ConfigDict, EmailStr, Field

class UserModel(BaseModel):
    id: str | None = None

    full_name: str
    email: EmailStr
    phone: str

    password: str

    role: str = "user"

    is_verified: bool = False
    is_active: bool = True

    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    last_login: datetime | None = None

    model_config = ConfigDict(
        populate_by_name=True,
        from_attributes=True,
    )
from pydantic import BaseModel, ConfigDict, EmailStr, Field


class RegisterSchema(BaseModel):
    full_name: str
    email: EmailStr
    phone: str
    password: str = Field(min_length=8)


class LoginSchema(BaseModel):
    email: EmailStr
    password: str


class SendOTPSchema(BaseModel):
    email: EmailStr


class VerifyOTPSchema(BaseModel):
    email: EmailStr
    otp: str


class ForgotPasswordSchema(BaseModel):
    email: EmailStr


class ResetPasswordSchema(BaseModel):
    email: EmailStr
    otp: str
    new_password: str = Field(min_length=8)


class ProfileUpdateSchema(BaseModel):
    full_name: str | None = None
    phone: str | None = None


class TokenResponseSchema(BaseModel):
    access_token: str
    token_type: str = "bearer"
    message: str = "Success"


class MessageResponseSchema(BaseModel):
    message: str


class UserResponseSchema(BaseModel):
    id: str
    full_name: str
    email: EmailStr
    phone: str
    role: str = "user"
    is_verified: bool
    is_active: bool

    model_config = ConfigDict(from_attributes=True)

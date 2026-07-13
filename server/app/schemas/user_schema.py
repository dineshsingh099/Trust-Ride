from pydantic import BaseModel, ConfigDict, EmailStr


class RegisterSchema(BaseModel):
    full_name: str
    email: EmailStr
    phone: str
    password: str


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
    new_password: str


class RefreshTokenSchema(BaseModel):
    refresh_token: str


class LogoutSchema(BaseModel):
    refresh_token: str


class TokenResponseSchema(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class MessageResponseSchema(BaseModel):
    message: str


class UserResponseSchema(BaseModel):
    id: str
    full_name: str
    email: EmailStr
    phone: str
    is_verified: bool
    is_active: bool

    model_config = ConfigDict(from_attributes=True)
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    APP_NAME: str
    ENV: str
    DEBUG: bool = True
    FRONTEND_URL: str
    MONGO_URI: str
    MONGO_DB_NAME: str
    JWT_SECRET_KEY: str
    JWT_ALGORITHM: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int
    REFRESH_TOKEN_EXPIRE_DAYS: int
    OTP_EXPIRE_SECONDS: int
    OTP_LENGTH: int
    TEMP_REGISTRATION_TTL_SECONDS: int
    BREVO_API_KEY: str
    BREVO_SENDER_EMAIL: str
    BREVO_SENDER_NAME: str
    COOKIE_SECURE: bool = True
    COOKIE_SAMESITE: str = "lax"
    COOKIE_DOMAIN: str | None = None

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


settings = Settings()

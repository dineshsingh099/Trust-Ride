import random
from app.core.Settings import settings


def generate_otp() -> str:
    digits = "0123456789"
    return "".join(random.choice(digits) for _ in range(settings.OTP_LENGTH))

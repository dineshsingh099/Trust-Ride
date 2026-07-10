import re
from bson import ObjectId

PASSWORD_PATTERN = re.compile(r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':\"\\|,.<>\/?]).{8,64}$")
NAME_PATTERN = re.compile(r"^[A-Za-z ]{2,100}$")
PHONE_PATTERN = re.compile(r"^\+?[0-9]{8,15}$")


def validate_password_strength(value: str) -> str:
    if not PASSWORD_PATTERN.match(value):
        raise ValueError(
            "Password must be 8-64 characters and include an uppercase letter, "
            "a lowercase letter, a digit, and a special character"
        )
    return value


def validate_name(value: str) -> str:
    cleaned = value.strip()
    if not NAME_PATTERN.match(cleaned):
        raise ValueError("Name must contain only letters and spaces, 2-100 characters")
    return cleaned


def validate_phone_number(value: str) -> str:
    if not PHONE_PATTERN.match(value):
        raise ValueError("Phone number must be 8-15 digits, optionally prefixed with +")
    return value


def validate_object_id(value: str) -> str:
    if not ObjectId.is_valid(value):
        raise ValueError("Invalid identifier format")
    return value

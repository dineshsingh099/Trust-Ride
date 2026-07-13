import httpx
from app.core.Settings import settings

BREVO_URL = "https://api.brevo.com/v3/smtp/email"


async def send_email(to_email: str, subject: str, html_content: str):
    headers = {
        "accept": "application/json",
        "api-key": settings.BREVO_API_KEY,
        "content-type": "application/json"
    }
    payload = {
        "sender": {
            "name": settings.BREVO_SENDER_NAME,
            "email": settings.BREVO_SENDER_EMAIL
        },
        "to": [{"email": to_email}],
        "subject": subject,
        "htmlContent": html_content
    }
    async with httpx.AsyncClient(timeout=10) as client:
        response = await client.post(BREVO_URL, headers=headers, json=payload)
        response.raise_for_status()
        return response.json()


async def send_otp_email(to_email: str, otp: str, purpose: str = "verification"):
    subject = "Your OTP Code"
    html_content = f"<p>Your OTP for {purpose} is <b>{otp}</b>. It will expire shortly.</p>"
    return await send_email(to_email, subject, html_content)

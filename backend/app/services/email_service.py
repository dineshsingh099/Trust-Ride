import httpx
from fastapi import HTTPException, status
from app.core.Settings import settings

BREVO_ENDPOINT = "https://api.brevo.com/v3/smtp/email"


async def _send_via_brevo(to_email: str, to_name: str, subject: str, html_content: str):
    headers = {
        "api-key": settings.BREVO_API_KEY,
        "Content-Type": "application/json",
        "Accept": "application/json",
    }
    payload = {
        "sender": {"name": settings.BREVO_SENDER_NAME, "email": settings.BREVO_SENDER_EMAIL},
        "to": [{"email": to_email, "name": to_name or to_email}],
        "subject": subject,
        "htmlContent": html_content,
    }
    async with httpx.AsyncClient(timeout=10) as client:
        response = await client.post(BREVO_ENDPOINT, headers=headers, json=payload)
    if response.status_code >= 400:
        raise HTTPException(
            status.HTTP_502_BAD_GATEWAY,
            f"Failed to send email via Brevo: {response.text}",
        )
    return response.json()


async def send_otp_email(email: str, otp: str, name: str = ""):
    html_content = f"""
    <div style="font-family: Arial, sans-serif;">
        <h2>Verify your account</h2>
        <p>Hello {name},</p>
        <p>Your OTP code is:</p>
        <h1 style="letter-spacing: 4px;">{otp}</h1>
        <p>This code will expire in {settings.OTP_EXPIRE_SECONDS // 60} minutes.</p>
    </div>
    """
    await _send_via_brevo(email, name, "Your Verification Code", html_content)


async def send_password_reset_email(email: str, reset_link: str, name: str = ""):
    html_content = f"""
    <div style="font-family: Arial, sans-serif;">
        <h2>Reset your password</h2>
        <p>Hello {name},</p>
        <p>Click the link below to reset your password. This link is valid for 30 minutes.</p>
        <p><a href="{reset_link}">{reset_link}</a></p>
    </div>
    """
    await _send_via_brevo(email, name, "Password Reset Request", html_content)


async def send_document_status_email(email: str, name: str, approved: bool, reason: str | None = None):
    if approved:
        html_content = f"<p>Hello {name},</p><p>Your submitted documents have been approved. You can now access your dashboard.</p>"
    else:
        html_content = f"<p>Hello {name},</p><p>Your submitted documents were rejected.</p><p>Reason: {reason}</p><p>Please resubmit corrected documents from Account > Document Submission.</p>"
    await _send_via_brevo(email, name, "Document Verification Update", html_content)

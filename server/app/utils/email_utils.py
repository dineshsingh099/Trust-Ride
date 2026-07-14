from datetime import datetime
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


def build_email_template(heading: str, body_html: str) -> str:
    year = datetime.utcnow().year
    return f"""<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#EEF2F6;font-family:'Segoe UI',Helvetica,Arial,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#EEF2F6;padding:40px 16px;">
<tr>
<td align="center">
<table role="presentation" width="480" cellpadding="0" cellspacing="0" style="background-color:#FFFFFF;border-radius:14px;overflow:hidden;box-shadow:0 8px 24px rgba(15,23,42,0.08);">
<tr>
<td style="background-color:#0F172A;padding:30px 32px;text-align:center;">
<table role="presentation" cellpadding="0" cellspacing="0" align="center">
<tr>
<td style="vertical-align:middle;padding-right:8px;">
<div style="width:34px;height:34px;background-color:#FACC15;border-radius:8px;text-align:center;line-height:34px;font-size:18px;">🚗</div>
</td>
<td style="vertical-align:middle;">
<span style="color:#FFFFFF;font-size:22px;font-weight:700;letter-spacing:0.3px;">Trust<span style="color:#FACC15;">Ride</span></span>
</td>
</tr>
</table>
</td>
</tr>
<tr>
<td style="padding:36px 32px 12px 32px;">
<h2 style="margin:0 0 18px 0;color:#0F172A;font-size:21px;font-weight:700;">{heading}</h2>
{body_html}
</td>
</tr>
<tr>
<td style="padding:8px 32px 32px 32px;">
<p style="margin:0;color:#94A3B8;font-size:12.5px;line-height:1.7;">If you did not request this, you can safely ignore this email. For any concerns, our support team is here to help.</p>
</td>
</tr>
<tr>
<td style="background-color:#F8FAFC;padding:22px 32px;text-align:center;border-top:1px solid #E2E8F0;">
<p style="margin:0;color:#64748B;font-size:12.5px;font-weight:600;">Trust Ride</p>
<p style="margin:4px 0 0 0;color:#94A3B8;font-size:11.5px;">Ride Safe. Ride Trusted.</p>
<p style="margin:10px 0 0 0;color:#CBD5E1;font-size:11px;">&copy; {year} Trust Ride. All rights reserved.</p>
</td>
</tr>
</table>
</td>
</tr>
</table>
</body>
</html>"""


async def send_otp_email(to_email: str, otp: str, purpose: str = "verification"):
    subject = "Your Trust Ride Verification Code"
    body_html = f"""
<p style="margin:0 0 22px 0;color:#334155;font-size:14.5px;line-height:1.7;">Use the code below to complete your <b>{purpose}</b>. This code will expire shortly, so please don't wait too long.</p>
<div style="background:linear-gradient(135deg,#0F172A,#1E293B);border-radius:10px;padding:22px;text-align:center;margin-bottom:24px;">
<span style="font-size:34px;font-weight:800;letter-spacing:10px;color:#FACC15;">{otp}</span>
</div>
<p style="margin:0;color:#334155;font-size:14.5px;line-height:1.7;">For your security, never share this code with anyone, including Trust Ride staff or support.</p>
"""
    html_content = build_email_template("Verify Your Identity", body_html)
    return await send_email(to_email, subject, html_content)


async def send_admin_otp_email(to_email: str, otp: str, purpose: str = "admin verification"):
    subject = "Trust Ride Admin Panel - Password Reset Code"
    body_html = f"""
<p style="margin:0 0 8px 0;display:inline-block;background-color:#FEF3C7;color:#92400E;font-size:11.5px;font-weight:700;letter-spacing:0.4px;padding:4px 10px;border-radius:20px;">ADMIN PANEL</p>
<p style="margin:14px 0 22px 0;color:#334155;font-size:14.5px;line-height:1.7;">A request was made to reset the password for the <b>Trust Ride Admin</b> account tied to this email, for <b>{purpose}</b>. Use the code below to continue. This code will expire shortly.</p>
<div style="background:linear-gradient(135deg,#0F172A,#1E293B);border-radius:10px;padding:22px;text-align:center;margin-bottom:24px;">
<span style="font-size:34px;font-weight:800;letter-spacing:10px;color:#FACC15;">{otp}</span>
</div>
<p style="margin:0;color:#334155;font-size:14.5px;line-height:1.7;">If you did not request an admin password reset, please secure your account immediately and never share this code with anyone.</p>
"""
    html_content = build_email_template("Admin Password Reset", body_html)
    return await send_email(to_email, subject, html_content)

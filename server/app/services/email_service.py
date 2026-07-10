import httpx
from fastapi import HTTPException, status
from app.core.Settings import settings

BREVO_ENDPOINT = "https://api.brevo.com/v3/smtp/email"

BRAND_900 = "#0E2E28"
BRAND_700 = "#1F5D50"
BRAND_600 = "#256B5C"
BRAND_050 = "#F1F7F5"
ACCENT_500 = "#E8871E"
SUCCESS_600 = "#1E7B34"
SUCCESS_100 = "#E4F5E8"
DANGER_600 = "#B23A3A"
DANGER_100 = "#FBEAEA"
INK = "#101828"
INK_SOFT = "#475467"
MUTED = "#667085"
BORDER = "#E4E7EC"
CANVAS = "#F5F7FA"


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


def _logo_svg() -> str:
    return (
        f'<svg width="40" height="40" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">'
        f'<circle cx="32" cy="32" r="30" fill="{BRAND_700}"/>'
        f'<circle cx="32" cy="32" r="30" fill="none" stroke="{ACCENT_500}" stroke-width="2" stroke-dasharray="4 6"/>'
        f'<path d="M20 33 L28 41 L44 23" fill="none" stroke="#fff" stroke-width="4.5" '
        f'stroke-linecap="round" stroke-linejoin="round"/></svg>'
    )


def _base_template(preheader: str, body_html: str, footer_note: str = "") -> str:
    app_name = settings.APP_NAME
    year = "2026"
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>{app_name}</title>
</head>
<body style="margin:0; padding:0; background-color:{CANVAS}; font-family:'Inter','Segoe UI',Arial,sans-serif;">
  <!-- preheader (hidden preview text) -->
  <div style="display:none; max-height:0; overflow:hidden; opacity:0;">
    {preheader}
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:{CANVAS}; padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width:560px;" cellpadding="0" cellspacing="0">

          <!-- Header -->
          <tr>
            <td style="padding-bottom:24px;">
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="vertical-align:middle;">{_logo_svg()}</td>
                  <td style="vertical-align:middle; padding-left:10px; font-family:'Sora','Segoe UI',Arial,sans-serif; font-size:18px; font-weight:700; color:{BRAND_900};">
                    {app_name}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td style="background-color:#FFFFFF; border:1px solid {BORDER}; border-radius:16px; padding:36px 32px; box-shadow:0 4px 12px rgba(16,24,40,0.06);">
              {body_html}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding-top:24px; text-align:center;">
              <p style="margin:0 0 4px; font-size:12px; color:{MUTED};">
                {footer_note or f"This is an automated message from {app_name}. Please don't reply directly to this email."}
              </p>
              <p style="margin:0; font-size:12px; color:{MUTED};">
                &copy; {year} {app_name}. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>"""


def _button(label: str, url: str) -> str:
    return f"""
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:28px 0;">
      <tr>
        <td style="border-radius:10px; background-color:{BRAND_700};">
          <a href="{url}" target="_blank"
             style="display:inline-block; padding:13px 28px; font-size:14px; font-weight:600;
                    color:#FFFFFF; text-decoration:none; border-radius:10px; font-family:'Inter',Arial,sans-serif;">
            {label}
          </a>
        </td>
      </tr>
    </table>
    """


async def send_otp_email(email: str, otp: str, name: str = ""):
    greeting_name = name or "there"
    minutes = settings.OTP_EXPIRE_SECONDS // 60
    otp_digits = "".join(
        f'<td style="width:40px; height:48px; text-align:center; vertical-align:middle; '
        f'font-family:\'JetBrains Mono\',Consolas,monospace; font-size:24px; font-weight:700; '
        f'color:{BRAND_900}; background-color:{BRAND_050}; border:1px solid {BORDER}; border-radius:8px;">'
        f'{digit}</td><td style="width:8px;"></td>'
        for digit in otp
    )
    body = f"""
      <h1 style="margin:0 0 8px; font-family:'Sora',Arial,sans-serif; font-size:22px; color:{INK};">
        Verify your email
      </h1>
      <p style="margin:0 0 24px; font-size:14px; line-height:1.6; color:{INK_SOFT};">
        Hi {greeting_name}, use the code below to verify your email address. This code expires in
        <strong>{minutes} minutes</strong>.
      </p>
      <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
        <tr>{otp_digits}</tr>
      </table>
      <p style="margin:0; font-size:13px; line-height:1.6; color:{MUTED};">
        If you didn't request this code, you can safely ignore this email.
      </p>
    """
    html_content = _base_template(
        preheader=f"Your verification code is {otp}",
        body_html=body,
    )
    await _send_via_brevo(email, name, "Your Verification Code", html_content)


async def send_password_reset_email(email: str, reset_link: str, name: str = ""):
    greeting_name = name or "there"
    body = f"""
      <h1 style="margin:0 0 8px; font-family:'Sora',Arial,sans-serif; font-size:22px; color:{INK};">
        Reset your password
      </h1>
      <p style="margin:0 0 8px; font-size:14px; line-height:1.6; color:{INK_SOFT};">
        Hi {greeting_name}, we received a request to reset the password for your account.
        Click the button below to choose a new one. This link is valid for 30 minutes.
      </p>
      {_button("Reset Password", reset_link)}
      <p style="margin:0 0 4px; font-size:13px; line-height:1.6; color:{MUTED};">
        If the button doesn't work, copy and paste this link into your browser:
      </p>
      <p style="margin:0 0 20px; font-size:13px; line-height:1.6; word-break:break-all;">
        <a href="{reset_link}" style="color:{BRAND_600};">{reset_link}</a>
      </p>
      <p style="margin:0; font-size:13px; line-height:1.6; color:{MUTED};">
        If you didn't request a password reset, you can safely ignore this email — your password
        will remain unchanged.
      </p>
    """
    html_content = _base_template(
        preheader="Reset your password — this link expires in 30 minutes.",
        body_html=body,
    )
    await _send_via_brevo(email, name, "Password Reset Request", html_content)


async def send_document_status_email(email: str, name: str, approved: bool, reason: str | None = None):
    greeting_name = name or "there"
    if approved:
        badge = f"""
          <span style="display:inline-block; padding:5px 12px; border-radius:999px; font-size:12px;
                       font-weight:600; color:{SUCCESS_600}; background-color:{SUCCESS_100};">
            &#10003; Approved
          </span>
        """
        body = f"""
          {badge}
          <h1 style="margin:16px 0 8px; font-family:'Sora',Arial,sans-serif; font-size:22px; color:{INK};">
            Your documents are approved
          </h1>
          <p style="margin:0; font-size:14px; line-height:1.6; color:{INK_SOFT};">
            Hi {greeting_name}, great news — your submitted documents have been verified and
            approved. You now have full access to your dashboard.
          </p>
        """
        preheader = "Your documents have been approved."
    else:
        badge = f"""
          <span style="display:inline-block; padding:5px 12px; border-radius:999px; font-size:12px;
                       font-weight:600; color:{DANGER_600}; background-color:{DANGER_100};">
            Action Required
          </span>
        """
        body = f"""
          {badge}
          <h1 style="margin:16px 0 8px; font-family:'Sora',Arial,sans-serif; font-size:22px; color:{INK};">
            Your documents need attention
          </h1>
          <p style="margin:0 0 16px; font-size:14px; line-height:1.6; color:{INK_SOFT};">
            Hi {greeting_name}, unfortunately we couldn't verify your submitted documents.
          </p>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
                 style="background-color:{DANGER_100}; border-radius:10px; margin:0 0 20px;">
            <tr>
              <td style="padding:14px 16px; font-size:13px; line-height:1.5; color:{DANGER_600};">
                <strong>Reason:</strong> {reason or "Not specified"}
              </td>
            </tr>
          </table>
          <p style="margin:0; font-size:13px; line-height:1.6; color:{MUTED};">
            Please resubmit corrected documents from <strong>Account &gt; Document Submission</strong>.
          </p>
        """
        preheader = "Your document submission requires attention."

    html_content = _base_template(preheader=preheader, body_html=body)
    await _send_via_brevo(email, name, "Document Verification Update", html_content)

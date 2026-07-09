# Role-Based Authentication System

FastAPI + MongoDB + Redis backend for User / Driver / Admin authentication.

## Setup

```bash
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env .env.local   # edit values: Mongo URI, Redis, JWT secret, Brevo API key, admin defaults
```

Make sure MongoDB and Redis are running and reachable at the URIs in `.env`.

### Email (OTP, password reset, document status) via Brevo

All emails are sent through Brevo's transactional email API (`POST https://api.brevo.com/v3/smtp/email`), not raw SMTP. You need:

- `BREVO_API_KEY` — from Brevo dashboard → Settings → SMTP & API → API Keys (use the **API key**, not the SMTP key)
- `BREVO_SENDER_EMAIL` — a sender verified in your Brevo account
- `BREVO_SENDER_NAME` — display name shown to recipients

Brevo's free tier gives 300 emails/day, which is enough for development.

## Run

```bash
python server.py
```

API docs: `http://localhost:8000/docs`

## Flow Summary

**User / Driver**
`POST /register` → OTP emailed, temp data in Redis (TTL) → `POST /verify-otp` moves data to MongoDB and returns tokens → `POST /login` for subsequent logins → `GET /dashboard` (Bearer token) → `POST /refresh-token` to rotate access tokens → `POST /forgot-password` / `POST /reset-password` for recovery → `GET /profile`.

Driver-only extras: `POST /driver/profile-form` (first-login vehicle + document form), `POST /driver/documents/resubmit` (after rejection).

**Admin**
`POST /admin/login` with default credentials → response flags `must_change_password: true` → `POST /admin/change-password` (required before dashboard use) → `GET /admin/drivers/pending` and `POST /admin/drivers/review` to approve/reject driver documents.

## Notes

- Rate limiting via `slowapi`, applied per-route on sensitive endpoints (register, OTP, login, password reset) plus a global default in `Core/Settings.py` (`RATE_LIMIT_DEFAULT`).
- JWT access + refresh tokens (`utils/jwt_handler.py`); refresh tokens are persisted in MongoDB (`refresh_tokens` collection) so they can be revoked.
- Passwords hashed with bcrypt via `passlib`.
- Emails (OTP, password reset, document status) sent via Brevo's transactional email API (`services/email_service.py`), not raw SMTP.
- Redis keys: `otp:{role}:{email}` and `temp_registration:{role}:{email}`, both with TTL from `.env`.
- Rejected driver documents: reason stored under `documents.rejection_reason`, visible via `GET /driver/profile`, resubmission via `POST /driver/documents/resubmit`.

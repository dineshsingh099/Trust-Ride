# Verifyd — Frontend

React (Vite) frontend for the Role-Based Authentication System, wired to the FastAPI backend in `../auth-system`.

## Setup

```bash
cd frontend
npm install
npm run dev
```

App runs at `http://localhost:5173`. API calls to `/api/...` are proxied to `http://localhost:8000` (see `vite.config.js`) — make sure the backend (`auth-system`) is running first.

## Structure

```
src/
  api/            axios client + one file per role's API calls
  context/        AuthContext (session, tokens, role, must-change-password flag)
  routes/         ProtectedRoute guard (role + admin password-change gate)
  components/
    common/       Button, Input, Card, Badge, Alert, Loader, StatCard, Icons, SealLogo
    layout/       Sidebar (collapsible), Topbar, DashboardLayout
  pages/
    Home/         Landing page (welcome banner, triple-click logo -> admin login)
    Auth/         RoleSelect, Login, Signup, VerifyOtp, ForgotPassword, ResetPassword,
                   AdminLogin, AdminChangePassword
    User/         UserDashboard, UserProfile
    Driver/       DriverOnboarding (first-login form), DriverDashboard, DriverDocuments
    Admin/        AdminDashboard, AdminDriverReview
```

## Flow

- `/` — landing page. "Get started" / "Log in" go to `/choose-role`, which asks User or Driver.
- Clicking the logo on the home page **3 times** opens `/admin/login` — there's no visible admin link anywhere else.
- User/Driver: signup → OTP verification → dashboard. Driver's first login redirects to `/driver/onboarding` (vehicle + document form) before the dashboard unlocks.
- Admin: `/admin/login` with the default credentials → forced to `/admin/change-password` on first login (enforced both by the redirect after login and by `ProtectedRoute`) → `/admin/dashboard` → `/admin/drivers` to approve/reject driver documents with a reason.

## Sidebar

Every dashboard (`DashboardLayout`) has a fixed sidebar with a toggle icon: collapses to icon-only on desktop, becomes an off-canvas drawer with backdrop on screens ≤900px.

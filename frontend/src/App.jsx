import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './routes/ProtectedRoute'

import HomePage from './pages/Home/HomePage'
import RoleSelect from './pages/Auth/RoleSelect'
import Login from './pages/Auth/Login'
import Signup from './pages/Auth/Signup'
import VerifyOtp from './pages/Auth/VerifyOtp'
import ForgotPassword from './pages/Auth/ForgotPassword'
import ResetPassword from './pages/Auth/ResetPassword'
import AdminLogin from './pages/Auth/AdminLogin'
import AdminChangePassword from './pages/Auth/AdminChangePassword'

import UserDashboard from './pages/User/UserDashboard'
import UserProfile from './pages/User/UserProfile'

import DriverOnboarding from './pages/Driver/DriverOnboarding'
import DriverDashboard from './pages/Driver/DriverDashboard'
import DriverDocuments from './pages/Driver/DriverDocuments'

import AdminDashboard from './pages/Admin/AdminDashboard'
import AdminDriverReview from './pages/Admin/AdminDriverReview'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/choose-role" element={<RoleSelect />} />

          <Route path="/:role/login" element={<Login />} />
          <Route path="/:role/signup" element={<Signup />} />
          <Route path="/:role/verify-otp" element={<VerifyOtp />} />
          <Route path="/:role/forgot-password" element={<ForgotPassword />} />
          <Route path="/:role/reset-password" element={<ResetPassword />} />

          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin/change-password"
            element={
              <ProtectedRoute allowedRole="admin">
                <AdminChangePassword />
              </ProtectedRoute>
            }
          />

          <Route
            path="/user/dashboard"
            element={
              <ProtectedRoute allowedRole="user">
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/profile"
            element={
              <ProtectedRoute allowedRole="user">
                <UserProfile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/driver/onboarding"
            element={
              <ProtectedRoute allowedRole="driver">
                <DriverOnboarding />
              </ProtectedRoute>
            }
          />
          <Route
            path="/driver/dashboard"
            element={
              <ProtectedRoute allowedRole="driver">
                <DriverDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/driver/documents"
            element={
              <ProtectedRoute allowedRole="driver">
                <DriverDocuments />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/drivers"
            element={
              <ProtectedRoute allowedRole="admin">
                <AdminDriverReview />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<HomePage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

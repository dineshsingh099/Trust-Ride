import client from './axiosClient'

export const registerDriver = (payload) => client.post('/driver/register', payload)
export const resendDriverOtp = (email) => client.post('/driver/resend-otp', { email })
export const verifyDriverOtp = (email, otp) => client.post('/driver/verify-otp', { email, otp })
export const loginDriver = (email, password) => client.post('/driver/login', { email, password })
export const getDriverProfile = () => client.get('/driver/profile')
export const getDriverDashboard = () => client.get('/driver/dashboard')
export const submitDriverProfileForm = (payload) => client.post('/driver/profile-form', payload)
export const resubmitDriverDocuments = (payload) => client.post('/driver/documents/resubmit', payload)
export const forgotDriverPassword = (email) => client.post('/driver/forgot-password', { email })
export const resetDriverPassword = (token, new_password) => client.post('/driver/reset-password', { token, new_password })

import client from './axiosClient'

export const registerUser = (payload) => client.post('/user/register', payload)
export const resendUserOtp = (email) => client.post('/user/resend-otp', { email })
export const verifyUserOtp = (email, otp) => client.post('/user/verify-otp', { email, otp })
export const loginUser = (email, password) => client.post('/user/login', { email, password })
export const getUserProfile = () => client.get('/user/profile')
export const getUserDashboard = () => client.get('/user/dashboard')
export const forgotUserPassword = (email) => client.post('/user/forgot-password', { email })
export const resetUserPassword = (token, new_password) => client.post('/user/reset-password', { token, new_password })
export const logoutUser = () => client.post('/user/logout')

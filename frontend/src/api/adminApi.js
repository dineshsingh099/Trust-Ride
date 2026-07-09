import client from './axiosClient'

export const loginAdmin = (email, password) => client.post('/admin/login', { email, password })
export const changeAdminPassword = (old_password, new_password) =>
  client.post('/admin/change-password', { old_password, new_password })
export const getAdminDashboard = () => client.get('/admin/dashboard')
export const getPendingDrivers = () => client.get('/admin/drivers/pending')
export const reviewDriver = (driver_id, decision, rejection_reason) =>
  client.post('/admin/drivers/review', { driver_id, decision, rejection_reason })

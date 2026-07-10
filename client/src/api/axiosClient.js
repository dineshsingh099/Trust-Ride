import axios from 'axios'

const client = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api/v1`,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' }
})

client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config
    if (error.response && error.response.status === 401 && !original._retry) {
      original._retry = true
      const role = localStorage.getItem('role')
      if (role) {
        try {
          await axios.post(
            `${import.meta.env.VITE_API_BASE_URL}/api/v1/${role}/refresh-token`,
            {},
            { withCredentials: true }
          )
          return client(original)
        } catch (refreshError) {
          localStorage.removeItem('role')
          localStorage.removeItem('must_change_password')
          window.location.href = '/'
          return Promise.reject(refreshError)
        }
      }
    }
    return Promise.reject(error)
  }
)

export default client

import axios, { AxiosError } from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
})

// redirect to login page if 401 error occurs
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const whileLists = ['/auth/login']

    const isLoginEndpoint = whileLists.includes(error.config?.url as string)
    if (error.response?.status === 401 && !isLoginEndpoint) {
      window.location.href = '/login'
    }

    return Promise.reject(error)
  },
)

export default api

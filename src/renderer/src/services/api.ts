import axios from 'axios'

const apiManager = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true
})

// Setup response interceptor to handle session expiration
export const setupApiInterceptor = (onSessionExpired: () => void): void => {
  apiManager.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        const errorCode = error.response?.data?.code
        if (errorCode === 'AUTH_TOKEN_EXPIRED') {
          onSessionExpired()
        }
      }
      return Promise.reject(error)
    }
  )
}

export default apiManager

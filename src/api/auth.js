import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
import router from '@/router'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

api.interceptors.request.use((config) => {
  return config
})

api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    console.error('❌ Erro na requisição:', error.response?.status)
    console.error('📛 Detalhes:', error.response?.data)

    if (error.response?.status === 401) {
      const authStore = useAuthStore()
      authStore.logout()

      if (router.currentRoute.value.path !== '/login') {
        router.push('/login')
      }
    }

    return Promise.reject(error)
  },
)

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
}

export default api

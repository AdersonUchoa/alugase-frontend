import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
import router from '@/router'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor para adicionar token nas requisições
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

// Interceptor para DEBUG - ver requisições no console
api.interceptors.request.use((config) => {
  console.log('🚀 Fazendo requisição:', config.method.toUpperCase(), config.url)
  console.log('📦 Dados enviados:', config.data)
  return config
})

// Interceptor para DEBUG - ver respostas no console
api.interceptors.response.use(
  (response) => {
    console.log('✅ Resposta recebida:', response.status)
    console.log('📥 Dados:', response.data)
    return response
  },
  (error) => {
    console.error('❌ Erro na requisição:', error.response?.status)
    console.error('📛 Detalhes:', error.response?.data)

    // Verificar se o erro é 401 (Não autorizado - token inválido/expirado)
    if (error.response?.status === 401) {
      console.log('🔒 Token expirado ou inválido. Fazendo logout...')
      const authStore = useAuthStore()
      authStore.logout()

      // Redirecionar para login se não estiver já lá
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

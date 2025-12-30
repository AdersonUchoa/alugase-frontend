import { defineStore } from 'pinia'
import { authAPI } from '@/api/auth'
import router from '@/router'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token') || null,
    expiresAt: localStorage.getItem('expiresAt') || null,
    isAuthenticated: !!localStorage.getItem('token'),
    loading: false,
    error: null
  }),

  getters: {
    isTokenExpired: (state) => {
      if (!state.expiresAt) return true
      return new Date(state.expiresAt) < new Date()
    }
  },

  actions: {
    async login(credentials) {
      this.loading = true
      this.error = null

      try {
        const response = await authAPI.login(credentials)
        
        if (response.data.success) {
          const { token, login, expiresAt } = response.data.data

          this.token = token
          this.user = { login }
          this.expiresAt = expiresAt
          this.isAuthenticated = true

          localStorage.setItem('token', token)
          localStorage.setItem('expiresAt', expiresAt)
          localStorage.setItem('user', JSON.stringify({ login }))
          
          this.startTokenExpirationCheck()
          
          router.push('/home')
        } else {
          this.error = response.data.message || 'Erro ao fazer login'
        }
      } catch (error) {
        console.error('❌ Erro no login:', error)
        
        if (error.response) {
          const errorData = error.response.data
          this.error = errorData.message || 'Credenciais inválidas'
        } else if (error.request) {
          this.error = 'Não foi possível conectar ao servidor. Verifique se a API está rodando.'
        } else {
          this.error = 'Erro ao processar requisição'
        }
        
        throw error
      } finally {
        this.loading = false
      }
    },

    logout() {      
      this.user = null
      this.token = null
      this.expiresAt = null
      this.isAuthenticated = false
      
      localStorage.removeItem('token')
      localStorage.removeItem('expiresAt')
      localStorage.removeItem('user')
      
      this.stopTokenExpirationCheck()
      
      router.push('/login')
    },

    checkAuth() {
      const token = localStorage.getItem('token')
      const expiresAt = localStorage.getItem('expiresAt')
      const userStr = localStorage.getItem('user')

      if (!token || !expiresAt) {
        this.isAuthenticated = false
        return false
      }

      if (new Date(expiresAt) < new Date()) {
        this.logout()
        return false
      }

      this.token = token
      this.expiresAt = expiresAt
      this.user = userStr ? JSON.parse(userStr) : null
      this.isAuthenticated = true
      
      this.startTokenExpirationCheck()

      return true
    },
    
    startTokenExpirationCheck() {
      this.stopTokenExpirationCheck()
      
      this.tokenCheckInterval = setInterval(() => {
        if (this.isTokenExpired) {
          alert('Sua sessão expirou. Você será redirecionado para a tela de login.')
          this.logout()
        }
      }, 60000)
    },
    
    stopTokenExpirationCheck() {
      if (this.tokenCheckInterval) {
        clearInterval(this.tokenCheckInterval)
        this.tokenCheckInterval = null
      }
    }
  }
})
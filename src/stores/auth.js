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
        
        // Sua API retorna: { success, message, data: { token, login, expiresAt }, statusCode }
        if (response.data.success) {
          const { token, login, expiresAt } = response.data.data

          this.token = token
          this.user = { login }
          this.expiresAt = expiresAt
          this.isAuthenticated = true

          // Salvar no localStorage
          localStorage.setItem('token', token)
          localStorage.setItem('expiresAt', expiresAt)
          localStorage.setItem('user', JSON.stringify({ login }))

          console.log('✅ Login realizado com sucesso!')
          console.log('👤 Usuário:', login)
          console.log('⏰ Token expira em:', new Date(expiresAt).toLocaleString('pt-BR'))
          
          // Iniciar verificação periódica de expiração
          this.startTokenExpirationCheck()
          
          router.push('/home')
        } else {
          this.error = response.data.message || 'Erro ao fazer login'
        }
      } catch (error) {
        console.error('❌ Erro no login:', error)
        
        // Tratar diferentes tipos de erro
        if (error.response) {
          // A API respondeu com status de erro
          const errorData = error.response.data
          this.error = errorData.message || 'Credenciais inválidas'
        } else if (error.request) {
          // A requisição foi feita mas não houve resposta
          this.error = 'Não foi possível conectar ao servidor. Verifique se a API está rodando.'
        } else {
          // Erro na configuração da requisição
          this.error = 'Erro ao processar requisição'
        }
        
        throw error
      } finally {
        this.loading = false
      }
    },

    logout() {
      console.log('👋 Fazendo logout...')
      
      this.user = null
      this.token = null
      this.expiresAt = null
      this.isAuthenticated = false
      
      localStorage.removeItem('token')
      localStorage.removeItem('expiresAt')
      localStorage.removeItem('user')
      
      // Parar verificação de expiração
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

      // Verificar se o token expirou
      if (new Date(expiresAt) < new Date()) {
        console.log('⚠️ Token expirado ao verificar autenticação!')
        this.logout()
        return false
      }

      // Restaurar dados do usuário
      this.token = token
      this.expiresAt = expiresAt
      this.user = userStr ? JSON.parse(userStr) : null
      this.isAuthenticated = true
      
      // Iniciar verificação periódica de expiração
      this.startTokenExpirationCheck()

      return true
    },
    
    // Verificação periódica de expiração do token
    startTokenExpirationCheck() {
      // Limpar intervalo anterior se existir
      this.stopTokenExpirationCheck()
      
      // Verificar a cada 1 minuto se o token expirou
      this.tokenCheckInterval = setInterval(() => {
        if (this.isTokenExpired) {
          console.log('⏰ Token expirou! Fazendo logout automático...')
          alert('Sua sessão expirou. Você será redirecionado para a tela de login.')
          this.logout()
        }
      }, 60000) // 60000ms = 1 minuto
      
      console.log('✅ Verificação de expiração de token iniciada')
    },
    
    stopTokenExpirationCheck() {
      if (this.tokenCheckInterval) {
        clearInterval(this.tokenCheckInterval)
        this.tokenCheckInterval = null
        console.log('🛑 Verificação de expiração de token parada')
      }
    }
  }
})
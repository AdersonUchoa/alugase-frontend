<template>
  <div class="login-container">
    <div class="login-card">
      <!-- Logo e Título -->
      <div class="login-header">
        <div class="logo-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
        </div>
        <h1>Aluga/SE</h1>
        <p class="subtitle">Sistema de Gestão de Aluguéis</p>
      </div>

      <!-- Mensagem de Erro -->
      <div v-if="authStore.error" class="error-message">
        {{ authStore.error }}
      </div>

      <!-- Formulário de Login -->
      <div class="login-form">
        <div class="form-group">
          <label for="login">Login</label>
          <input
            id="login"
            v-model="credentials.login"
            type="text"
            placeholder="Digite seu login"
            @keyup.enter="handleLogin"
            :disabled="authStore.loading"
          />
        </div>

        <div class="form-group">
          <label for="senha">Senha</label>
          <input
            id="senha"
            v-model="credentials.senha"
            type="password"
            placeholder="Digite sua senha"
            @keyup.enter="handleLogin"
            :disabled="authStore.loading"
          />
        </div>

        <button
          @click="handleLogin"
          class="btn-login"
          :disabled="authStore.loading || !credentials.login || !credentials.senha"
        >
          <span v-if="authStore.loading" class="loading-spinner"></span>
          {{ authStore.loading ? 'Entrando...' : 'Entrar' }}
        </button>
      </div>

      <!-- Footer -->
      <div class="login-footer">
        <p>Acesso restrito aos administradores</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const credentials = reactive({
  login: '',
  senha: '',
})

onMounted(() => {
  console.log('🏠 Tela de Login carregada')
})

const handleLogin = async () => {
  if (!credentials.login || !credentials.senha) {
    authStore.error = 'Preencha login e senha'
    return
  }

  console.log('🔐 Tentando fazer login com:', credentials.login)

  try {
    await authStore.login(credentials)
    console.log('✅ Redirecionando para home...')
  } catch (error) {
    console.error('❌ Falha no login: ', error)
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f9fafb;
  padding: 1rem;
}

.login-card {
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 28rem;
  padding: 2rem;
}

.login-header {
  text-align: center;
  margin-bottom: 2rem;
}

.logo-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 4rem;
  height: 4rem;
  background-color: #2563eb;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
}

.logo-icon svg {
  width: 2rem;
  height: 2rem;
  color: white;
}

.login-header h1 {
  font-size: 1.875rem;
  font-weight: bold;
  color: #111827;
  margin: 0;
}

.subtitle {
  color: #6b7280;
  margin-top: 0.5rem;
  font-size: 0.875rem;
}

.error-message {
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  color: #b91c1c;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  margin-bottom: 1.5rem;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
}

.form-group input {
  width: 100%;
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: all 0.2s;
  outline: none;
}

.form-group input:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.form-group input:disabled {
  background-color: #f3f4f6;
  cursor: not-allowed;
}

.btn-login {
  width: 100%;
  background-color: #2563eb;
  color: white;
  font-weight: 500;
  padding: 0.625rem 1rem;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-login:hover:not(:disabled) {
  background-color: #1d4ed8;
}

.btn-login:disabled {
  background-color: #93c5fd;
  cursor: not-allowed;
}

.loading-spinner {
  width: 1rem;
  height: 1rem;
  border: 2px solid white;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.login-footer {
  margin-top: 2rem;
  text-align: center;
}

.login-footer p {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0.25rem 0;
}

.api-status {
  font-family: monospace;
  font-size: 0.75rem;
  color: #9ca3af;
}
</style>

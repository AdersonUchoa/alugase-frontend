<template>
  <div v-if="isOpen" class="modal-overlay-inner" @click.stop>
    <div class="modal-container-inner" @click.stop>
      <div class="modal-header">
        <h3>Cadastrar Novo Inquilino</h3>
        <button @click="handleClose" class="btn-close">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="modal-body">
        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <!-- Tabs -->
        <div class="tabs">
          <button 
            @click="activeTab = 'simples'" 
            :class="['tab', { active: activeTab === 'simples' }]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Cadastro Rápido
          </button>
          <button 
            @click="activeTab = 'completo'" 
            :class="['tab', { active: activeTab === 'completo' }]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Cadastro Completo
          </button>
        </div>

        <!-- Info sobre o cadastro rápido -->
        <div v-if="activeTab === 'simples'" class="info-box">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p>Cadastre apenas com <strong>nome e telefone</strong>. Você poderá adicionar mais informações depois.</p>
        </div>

        <form @submit.prevent="handleSubmit">
          <!-- Campos obrigatórios (sempre visíveis) -->
          <div class="form-group">
            <label for="nome">Nome *</label>
            <input
              id="nome"
              v-model="formData.nome"
              type="text"
              placeholder="Ex: João da Silva"
              required
            />
          </div>

          <div class="form-group">
            <label for="telefone">Telefone *</label>
            <input
              id="telefone"
              v-model="formData.telefone"
              type="text"
              placeholder="(00) 00000-0000"
              maxlength="15"
              @input="formatTelefone"
              required
            />
          </div>

          <!-- Campos opcionais (apenas no cadastro completo) -->
          <div v-if="activeTab === 'completo'" class="optional-fields">
            <div class="divider">
              <span>Informações Adicionais</span>
            </div>

            <div class="form-group">
              <label for="cpf">CPF</label>
              <input
                id="cpf"
                v-model="formData.cpf"
                type="text"
                placeholder="000.000.000-00"
                maxlength="14"
                @input="formatCPF"
              />
            </div>

            <div class="form-group">
              <label for="email">E-mail</label>
              <input
                id="email"
                v-model="formData.email"
                type="email"
                placeholder="email@exemplo.com"
              />
            </div>

            <div class="form-group">
              <label for="endereco">Endereço</label>
              <input
                id="endereco"
                v-model="formData.endereco"
                type="text"
                placeholder="Rua, número, bairro, cidade"
              />
            </div>
          </div>

          <!-- Botões -->
          <div class="modal-footer">
            <button type="button" @click="handleClose" class="btn-cancel">
              Cancelar
            </button>
            <button type="submit" :disabled="loading" class="btn-submit">
              <span v-if="loading" class="loading-spinner-small"></span>
              {{ loading ? 'Salvando...' : 'Cadastrar' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { inquilinoAPI } from '@/api/services'

const props = defineProps({
  isOpen: Boolean
})

const emit = defineEmits(['close', 'success'])

const loading = ref(false)
const error = ref('')
const activeTab = ref('simples')

const formData = ref({
  nome: '',
  cpf: '',
  email: '',
  telefone: '',
  endereco: ''
})

const formatCPF = (e) => {
  let value = e.target.value.replace(/\D/g, '')
  if (value.length <= 11) {
    value = value.replace(/(\d{3})(\d)/, '$1.$2')
    value = value.replace(/(\d{3})(\d)/, '$1.$2')
    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2')
    formData.value.cpf = value
  }
}

const formatTelefone = (e) => {
  let value = e.target.value.replace(/\D/g, '')
  if (value.length <= 11) {
    value = value.replace(/(\d{2})(\d)/, '($1) $2')
    value = value.replace(/(\d{5})(\d)/, '$1-$2')
    formData.value.telefone = value
  }
}

const handleClose = () => {
  resetForm()
  emit('close')
}

const resetForm = () => {
  formData.value = {
    nome: '',
    cpf: '',
    email: '',
    telefone: '',
    endereco: ''
  }
  error.value = ''
  activeTab.value = 'simples'
}

const handleSubmit = async () => {
  error.value = ''

  if (!formData.value.nome?.trim()) {
    error.value = 'Nome é obrigatório'
    return
  }

  if (!formData.value.telefone?.trim()) {
    error.value = 'Telefone é obrigatório'
    return
  }

  try {
    loading.value = true

    const payload = {
      nome: formData.value.nome.trim(),
      cpf: formData.value.cpf?.trim() ? formData.value.cpf.replace(/\D/g, '') : null,
      email: formData.value.email?.trim() || null,
      telefone: formData.value.telefone.replace(/\D/g, ''),
      endereco: formData.value.endereco?.trim() || null
    }

    const response = await inquilinoAPI.create(payload)

    if (response.data.success) {
      emit('success', response.data.data)
      handleClose()
    } else {
      error.value = response.data.message || 'Erro ao cadastrar inquilino'
    }
  } catch (error) {
    console.error('Erro ao cadastrar inquilino:', error)
    error.value = error.response?.data?.message || 'Erro ao cadastrar inquilino'
  } finally {
    loading.value = false
  }
}

watch(() => props.isOpen, (newVal) => {
  if (!newVal) {
    resetForm()
  }
})
</script>

<style scoped>
.modal-overlay-inner {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1100;
  padding: 1rem;
}

.modal-container-inner {
  background: white;
  border-radius: 0.5rem;
  width: 100%;
  max-width: 500px;
  max-height: 85vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.btn-close {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.375rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.375rem;
  transition: background-color 0.2s;
}

.btn-close:hover {
  background-color: #f3f4f6;
}

.btn-close svg {
  width: 1.25rem;
  height: 1.25rem;
  color: #6b7280;
}

.modal-body {
  padding: 1.5rem;
  overflow-y: auto;
  flex: 1;
}

.error-message {
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  color: #b91c1c;
  padding: 0.75rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  margin-bottom: 1rem;
}

.tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  background-color: #f3f4f6;
  padding: 0.25rem;
  border-radius: 0.5rem;
}

.tab {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  border: none;
  background: transparent;
  color: #6b7280;
  font-weight: 500;
  font-size: 0.875rem;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s;
}

.tab svg {
  width: 1.125rem;
  height: 1.125rem;
}

.tab:hover {
  color: #374151;
}

.tab.active {
  background-color: white;
  color: #2563eb;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.info-box {
  display: flex;
  gap: 0.75rem;
  background-color: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 0.5rem;
  padding: 0.875rem;
  margin-bottom: 1.5rem;
}

.info-box svg {
  width: 1.25rem;
  height: 1.25rem;
  color: #2563eb;
  flex-shrink: 0;
  margin-top: 0.125rem;
}

.info-box p {
  margin: 0;
  font-size: 0.875rem;
  color: #1e40af;
  line-height: 1.5;
}

.optional-fields {
  margin-top: 0;
}

.divider {
  display: flex;
  align-items: center;
  margin: 0.75rem 0 1.25rem 0;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background-color: #e5e7eb;
}

.divider span {
  padding: 0 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #6b7280;
}

.form-group {
  margin-bottom: 1.25rem;
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
  padding: 0.625rem 0.875rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  outline: none;
  transition: border-color 0.2s;
}

.form-group input:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding-top: 1.25rem;
  border-top: 1px solid #e5e7eb;
  margin-top: 1.25rem;
}

.btn-cancel,
.btn-submit {
  padding: 0.625rem 1.25rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-cancel {
  background-color: white;
  color: #374151;
  border: 1px solid #d1d5db;
}

.btn-cancel:hover {
  background-color: #f9fafb;
}

.btn-submit {
  background-color: #2563eb;
  color: white;
}

.btn-submit:hover:not(:disabled) {
  background-color: #1d4ed8;
}

.btn-submit:disabled {
  background-color: #93c5fd;
  cursor: not-allowed;
}

.loading-spinner-small {
  width: 1rem;
  height: 1rem;
  border: 2px solid white;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
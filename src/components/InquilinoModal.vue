<template>
  <div v-if="isOpen" class="modal-overlay">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h2>{{ isEditMode ? 'Editar Inquilino' : 'Novo Inquilino' }}</h2>
        <button @click="closeModal" class="btn-close">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="modal-body">
        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <!-- Tabs - Apenas no modo criar -->
        <div v-if="!isEditMode" class="tabs">
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
        <div v-if="!isEditMode && activeTab === 'simples'" class="info-box">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p>Cadastre apenas com <strong>nome e telefone</strong>. Você poderá adicionar mais informações depois.</p>
        </div>

        <!-- Formulário -->
        <div class="form-content">
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
              maxlength="16"
              @input="handleTelefoneInput"
              required
            />
          </div>

          <!-- Campos opcionais (apenas no cadastro completo ou edição) -->
          <div v-if="isEditMode || activeTab === 'completo'" class="optional-fields">
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
                @input="handleCPFInput"
              />
            </div>

            <div class="form-group">
              <label for="email">E-mail</label>
              <input
                id="email"
                v-model="formData.email"
                type="email"
                placeholder="exemplo@email.com"
              />
            </div>

            <div class="form-group">
              <label for="endereco">Endereço</label>
              <input
                id="endereco"
                v-model="formData.endereco"
                type="text"
                placeholder="Ex: Rua das Flores, 123"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button @click="closeModal" class="btn-cancel">
          Cancelar
        </button>
        <button @click="handleSubmit" :disabled="loading" class="btn-submit">
          <span v-if="loading" class="loading-spinner"></span>
          {{ loading ? 'Salvando...' : 'Salvar' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { inquilinoAPI } from '@/api/services'
import { formatCPF, removeCpfMask, validateCpf, formatPhone, removePhoneMask, validatePhone } from '@/utils/formatters'

const props = defineProps({
  isOpen: Boolean,
  inquilino: Object
})

const emit = defineEmits(['close', 'success'])

const loading = ref(false)
const error = ref('')
const isEditMode = ref(false)
const activeTab = ref('simples')

const formData = ref({
  nome: '',
  cpf: '',
  telefone: '',
  email: '',
  endereco: ''
})

const handleCPFInput = (e) => {
  formData.value.cpf = formatCPF(e.target.value)
}

const handleTelefoneInput = (e) => {
  formData.value.telefone = formatPhone(e.target.value)
}

const resetForm = () => {
  formData.value = {
    nome: '',
    cpf: '',
    telefone: '',
    email: '',
    endereco: ''
  }
  error.value = ''
  activeTab.value = 'simples'
}

watch(() => props.inquilino, (newInquilino) => {
  if (newInquilino) {
    isEditMode.value = true
    activeTab.value = 'completo'
    formData.value = {
      nome: newInquilino.nome || '',
      cpf: formatCPF(newInquilino.cpf) || '',
      telefone: formatPhone(newInquilino.telefone) || '',
      email: newInquilino.email || '',
      endereco: newInquilino.endereco || ''
    }
  } else {
    isEditMode.value = false
    resetForm()
  }
}, { immediate: true })

const closeModal = () => {
  resetForm()
  emit('close')
}

const validateForm = () => {
  if (!formData.value.nome?.trim()) {
    error.value = 'Nome é obrigatório'
    return false
  }
  if (!formData.value.telefone?.trim()) {
    error.value = 'Telefone é obrigatório'
    return false
  }
  
  if (!validatePhone(formData.value.telefone)) {
    error.value = 'Telefone inválido'
    return false
  }
  
  if (formData.value.cpf?.trim()) {
    if (!validateCpf(formData.value.cpf)) {
      error.value = 'CPF inválido'
      return false
    }
  }
  
  return true
}

const handleSubmit = async () => {
  error.value = ''
  
  if (!validateForm()) return

  try {
    loading.value = true
    
    const payload = {
      nome: formData.value.nome.trim(),
      telefone: removePhoneMask(formData.value.telefone),
      cpf: formData.value.cpf?.trim() ? removeCpfMask(formData.value.cpf) : null,
      email: formData.value.email?.trim() || null,
      endereco: formData.value.endereco?.trim() || null
    }

    let response
    if (isEditMode.value) {
      response = await inquilinoAPI.update(props.inquilino.id, payload)
    } else {
      response = await inquilinoAPI.create(payload)
    }

    if (response.data.success) {
      emit('success')
      closeModal()
    } else {
      error.value = response.data.message || 'Erro ao salvar inquilino'
    }
  } catch (err) {
    console.error('Erro ao salvar:', err)
    error.value = err.response?.data?.message || 'Erro ao salvar inquilino'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: white;
  border-radius: 0.5rem;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.btn-close {
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: none;
  color: #6b7280;
  cursor: pointer;
  border-radius: 0.375rem;
  transition: all 0.2s;
}

.btn-close:hover {
  background-color: #f3f4f6;
  color: #111827;
}

.btn-close svg {
  width: 1.25rem;
  height: 1.25rem;
}

.modal-body {
  padding: 1.5rem;
  overflow-y: auto;
  flex: 1;
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

.error-message {
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  color: #b91c1c;
  padding: 0.75rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  margin-bottom: 1rem;
}

.form-content {
  display: flex;
  flex-direction: column;
}

.optional-fields {
  margin-top: 0;
}

.divider {
  display: flex;
  align-items: center;
  margin: 0.75rem 0;
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
  margin-bottom: 1rem;
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
  gap: 0.75rem;
  padding: 1.5rem;
  border-top: 1px solid #e5e7eb;
}

.btn-cancel,
.btn-submit {
  flex: 1;
  padding: 0.625rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
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

.loading-spinner {
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
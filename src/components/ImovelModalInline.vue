<template>
  <div v-if="isOpen" class="modal-overlay-inner" @click.stop>
    <div class="modal-container-inner" @click.stop>
      <div class="modal-header">
        <h3>Cadastrar Novo Imóvel</h3>
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

        <form @submit.prevent="handleSubmit">
          <!-- Nome -->
          <div class="form-group">
            <label for="nome">Nome *</label>
            <input
              id="nome"
              v-model="formData.nome"
              type="text"
              placeholder="Ex: Casa na praia, Apartamento centro"
              required
            />
          </div>

          <!-- Endereço -->
          <div class="form-group">
            <label for="endereco">Endereço *</label>
            <input
              id="endereco"
              v-model="formData.endereco"
              type="text"
              placeholder="Rua, número, bairro, cidade"
              required
            />
          </div>

          <!-- Tipo de Imóvel -->
          <div class="form-group">
            <label for="tipoImovel">Tipo de Imóvel *</label>
            <select id="tipoImovel" v-model="formData.tipoImovel" required>
              <option value="">Selecione...</option>
              <option 
                v-for="tipo in tiposImovel" 
                :key="tipo.value" 
                :value="tipo.value"
              >
                {{ tipo.label }}
              </option>
            </select>
          </div>

          <!-- Descrição -->
          <div class="form-group">
            <label for="descricao">Descrição</label>
            <textarea
              id="descricao"
              v-model="formData.descricao"
              rows="3"
              placeholder="Informações adicionais sobre o imóvel..."
            ></textarea>
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
import { ref, watch, onMounted } from 'vue'
import { imovelAPI, enumsAPI } from '@/api/services'

const props = defineProps({
  isOpen: Boolean
})

const emit = defineEmits(['close', 'success'])

const loading = ref(false)
const error = ref('')
const tiposImovel = ref([])

const formData = ref({
  nome: '',
  endereco: '',
  tipoImovel: '',
  descricao: ''
})

const loadTiposImovel = async () => {
  try {
    const response = await enumsAPI.getTiposImovel()
    if (response.data.success) {
      tiposImovel.value = response.data.data
    }
  } catch (err) {
    console.error('Erro ao carregar tipos de imóvel:', err)
  }
}

onMounted(() => {
  loadTiposImovel()
})

const handleClose = () => {
  resetForm()
  emit('close')
}

const resetForm = () => {
  formData.value = {
    nome: '',
    endereco: '',
    tipoImovel: '',
    descricao: ''
  }
  error.value = ''
}

const handleSubmit = async () => {
  error.value = ''

  if (!formData.value.nome?.trim()) {
    error.value = 'Nome é obrigatório'
    return
  }

  if (!formData.value.endereco?.trim()) {
    error.value = 'Endereço é obrigatório'
    return
  }

  if (!formData.value.tipoImovel) {
    error.value = 'Tipo de imóvel é obrigatório'
    return
  }

  try {
    loading.value = true

    const payload = {
      nome: formData.value.nome.trim(),
      endereco: formData.value.endereco.trim(),
      tipoImovel: formData.value.tipoImovel,
      descricao: formData.value.descricao?.trim() || null
    }

    const response = await imovelAPI.create(payload)

    if (response.data.success) {
      emit('success', response.data.data)
      handleClose()
    } else {
      error.value = response.data.message || 'Erro ao cadastrar imóvel'
    }
  } catch (error) {
    console.error('Erro ao cadastrar imóvel:', error)
    error.value = error.response?.data?.message || 'Erro ao cadastrar imóvel'
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

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.625rem 0.875rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  outline: none;
  transition: border-color 0.2s;
  font-family: inherit;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.form-group textarea {
  resize: vertical;
  min-height: 80px;
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
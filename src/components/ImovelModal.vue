<template>
  <div v-if="isOpen" class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h2>{{ isEditMode ? 'Editar Imóvel' : 'Novo Imóvel' }}</h2>
        <button @click="closeModal" class="btn-close">
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <div class="modal-body">
        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <div class="form-group">
          <label for="nome">Nome *</label>
          <input
            id="nome"
            v-model="formData.nome"
            type="text"
            placeholder="Ex: Casa na Praia"
            required
          />
        </div>

        <div class="form-group">
          <label for="tipoImovel">Tipo do Imóvel *</label>
          <select id="tipoImovel" v-model="formData.tipoImovel" required>
            <option value="">Selecione...</option>
            <option v-for="tipo in tiposImovel" :key="tipo.value" :value="tipo.value">
              {{ tipo.label }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label for="endereco">Endereço *</label>
          <input
            id="endereco"
            v-model="formData.endereco"
            type="text"
            placeholder="Ex: Rua das Flores, 123"
            required
          />
        </div>

        <div class="form-group">
          <label for="descricao">Descrição</label>
          <textarea
            id="descricao"
            v-model="formData.descricao"
            rows="4"
            placeholder="Descreva o imóvel..."
          ></textarea>
        </div>
      </div>

      <div class="modal-footer">
        <button @click="closeModal" class="btn-cancel">Cancelar</button>
        <button @click="handleSubmit" :disabled="loading" class="btn-submit">
          <span v-if="loading" class="loading-spinner"></span>
          {{ loading ? 'Salvando...' : 'Salvar' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { imovelAPI, enumsAPI } from '@/api/services'

const props = defineProps({
  isOpen: Boolean,
  imovel: Object,
})

const emit = defineEmits(['close', 'success'])

const loading = ref(false)
const error = ref('')
const isEditMode = ref(false)
const tiposImovel = ref([])

const formData = ref({
  nome: '',
  tipoImovel: '',
  endereco: '',
  descricao: '',
})

// Carrega tipos de imóvel
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

// Declara resetForm ANTES do watch
const resetForm = () => {
  formData.value = {
    nome: '',
    tipoImovel: '',
    endereco: '',
    descricao: '',
  }
  error.value = ''
}

// Observa mudanças no prop imovel
watch(
  () => props.imovel,
  (newImovel) => {
    if (newImovel) {
      isEditMode.value = true
      formData.value = {
        nome: newImovel.nome || '',
        tipoImovel: newImovel.tipoImovel || '',
        endereco: newImovel.endereco || '',
        descricao: newImovel.descricao || '',
      }
    } else {
      isEditMode.value = false
      resetForm()
    }
  },
  { immediate: true },
)

const closeModal = () => {
  resetForm()
  emit('close')
}

const validateForm = () => {
  if (!formData.value.nome?.trim()) {
    error.value = 'Nome é obrigatório'
    return false
  }
  if (!formData.value.tipoImovel) {
    error.value = 'Tipo do imóvel é obrigatório'
    return false
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
      tipoImovel: formData.value.tipoImovel,
      endereco: formData.value.endereco.trim(),
      descricao: formData.value.descricao?.trim() || null,
    }

    let response
    if (isEditMode.value) {
      response = await imovelAPI.update(props.imovel.id, payload)
    } else {
      response = await imovelAPI.create(payload)
    }

    if (response.data.success) {
      emit('success')
      closeModal()
    } else {
      error.value = response.data.message || 'Erro ao salvar imóvel'
    }
  } catch (err) {
    console.error('Erro ao salvar:', err)
    error.value = err.response?.data?.message || 'Erro ao salvar imóvel'
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
  to {
    transform: rotate(360deg);
  }
}
</style>

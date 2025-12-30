<template>
  <div v-if="isOpen" class="modal-overlay">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h2>{{ isEditMode ? 'Editar Aluguel' : 'Novo Aluguel' }}</h2>
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
        <div v-if="loadingData" class="loading-state">
          <div class="spinner"></div>
          <p>Carregando dados...</p>
        </div>

        <div v-else>
          <div v-if="error" class="error-message">
            {{ error }}
          </div>

          <!-- Inquilino com botão + -->
          <div class="form-group">
            <label for="inquilinoId">Inquilino *</label>
            <div class="input-with-button">
              <div class="autocomplete-wrapper">
                <input
                  type="text"
                  v-model="inquilinoSearch"
                  @focus="showInquilinoDropdown = true"
                  @input="filterInquilinos"
                  placeholder="Buscar inquilino por nome ou CPF..."
                />
                <div v-if="showInquilinoDropdown && filteredInquilinos.length > 0" class="dropdown">
                  <div
                    v-for="inquilino in filteredInquilinos"
                    :key="inquilino.id"
                    @click="selectInquilino(inquilino)"
                    class="dropdown-item"
                  >
                    {{ inquilino.nome }} - {{ inquilino.telefone }}
                  </div>
                </div>
                <div
                  v-if="showInquilinoDropdown && filteredInquilinos.length === 0 && inquilinoSearch"
                  class="dropdown"
                >
                  <div class="dropdown-item empty">Nenhum inquilino encontrado</div>
                </div>
              </div>
              <button 
                type="button" 
                @click.stop="openInquilinoModal"
                class="btn-add-inline"
                title="Cadastrar novo inquilino"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Imóvel com botão + -->
          <div class="form-group">
            <label for="imovelId">Imóvel *</label>
            <div class="input-with-button">
              <div class="autocomplete-wrapper">
                <input
                  type="text"
                  v-model="imovelSearch"
                  @focus="showImovelDropdown = true"
                  @input="filterImoveis"
                  placeholder="Buscar imóvel por nome ou endereço..."
                />
                <div v-if="showImovelDropdown && filteredImoveis.length > 0" class="dropdown">
                  <div
                    v-for="imovel in filteredImoveis"
                    :key="imovel.id"
                    @click="selectImovel(imovel)"
                    class="dropdown-item"
                  >
                    {{ imovel.nome }} - {{ imovel.endereco }}
                  </div>
                </div>
                <div
                  v-if="showImovelDropdown && filteredImoveis.length === 0 && imovelSearch"
                  class="dropdown"
                >
                  <div class="dropdown-item empty">Nenhum imóvel encontrado</div>
                </div>
              </div>
              <button 
                type="button" 
                @click.stop="openImovelModal"
                class="btn-add-inline"
                title="Cadastrar novo imóvel"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="dataInicio">Data Início *</label>
              <input id="dataInicio" v-model="formData.dataInicio" type="date" required />
            </div>

            <div class="form-group">
              <label for="dataFim">Data Fim *</label>
              <input id="dataFim" v-model="formData.dataFim" type="date" required />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="valor">Valor (R$) *</label>
              <input
                id="valor"
                v-model="formData.valor"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                required
              />
            </div>

            <div class="form-group">
              <label for="metodoDePagamento">Método de Pagamento *</label>
              <select id="metodoDePagamento" v-model="formData.metodoDePagamento" required>
                <option value="">Selecione...</option>
                <option
                  v-for="metodo in metodosDePagamento"
                  :key="metodo.value"
                  :value="metodo.value"
                >
                  {{ metodo.label }}
                </option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label for="status">Status *</label>
            <select id="status" v-model="formData.status" required>
              <option value="">Selecione...</option>
              <option 
                v-for="status in statusAluguel" :key="status.value" :value="status.value">
                {{ status.label }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button @click="closeModal" class="btn-cancel">Cancelar</button>
        <button @click="handleSubmit" :disabled="loading || loadingData" class="btn-submit">
          <span v-if="loading" class="loading-spinner"></span>
          {{ loading ? 'Salvando...' : 'Salvar' }}
        </button>
      </div>
    </div>

    <!-- Modais Inline -->
    <InquilinoModalInline
      :is-open="showInquilinoModal"
      @close="closeInquilinoModal"
      @success="handleInquilinoCreated"
    />

    <ImovelModalInline
      :is-open="showImovelModal"
      @close="closeImovelModal"
      @success="handleImovelCreated"
    />
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { aluguelAPI, imovelAPI, inquilinoAPI, enumsAPI } from '@/api/services'
import InquilinoModalInline from './InquilinoModalInline.vue'
import ImovelModalInline from './ImovelModalInline.vue'

const props = defineProps({
  isOpen: Boolean,
  aluguel: Object,
})

const emit = defineEmits(['close', 'success'])

const loading = ref(false)
const loadingData = ref(false)
const error = ref('')
const isEditMode = ref(false)

const metodosDePagamento = ref([])
const statusAluguel = ref([])
const inquilinos = ref([])
const imoveis = ref([])
const filteredInquilinos = ref([])
const filteredImoveis = ref([])
const inquilinoSearch = ref('')
const imovelSearch = ref('')
const showInquilinoDropdown = ref(false)
const showImovelDropdown = ref(false)

// Modais inline
const showInquilinoModal = ref(false)
const showImovelModal = ref(false)

const formData = ref({
  inquilinoId: '',
  imovelId: '',
  dataInicio: '',
  dataFim: '',
  valor: '',
  metodoDePagamento: '',
  status: '',
})

const loadMetodosDePagamento = async () => {
  try {
    const response = await enumsAPI.getMetodosPagamento()
    if (response.data.success) {
      metodosDePagamento.value = response.data.data
    }
  } catch (err) {
    console.error('Erro ao carregar metodos de pagamento:', err)
  }
}

const loadStatusAluguel = async () => {
  try {
    const response = await enumsAPI.getStatusAluguel()
    if (response.data.success) {
      statusAluguel.value = response.data.data
    }
  } catch (err) {
    console.error('Erro ao carregar status de aluguel:', err)
  }
}

onMounted(() => {
  loadMetodosDePagamento()
  loadStatusAluguel()
})

// Carrega listas de imóveis e inquilinos
const loadSelectData = async () => {
  try {
    loadingData.value = true

    const [imoveisRes, inquilinosRes] = await Promise.all([
      imovelAPI.getAll(1, 1000, false, false, null),
      inquilinoAPI.getAll(1, 1000, false, false, null),
    ])

    if (imoveisRes.data.success) {
      imoveis.value = imoveisRes.data.data.items || imoveisRes.data.data
      filteredImoveis.value = imoveis.value
    }

    if (inquilinosRes.data.success) {
      inquilinos.value = inquilinosRes.data.data.items || inquilinosRes.data.data
      filteredInquilinos.value = inquilinos.value
    }
  } catch (err) {
    console.error('Erro ao carregar dados:', err)
    error.value = 'Erro ao carregar imóveis e inquilinos'
  } finally {
    loadingData.value = false
  }
}

const filterInquilinos = () => {
  const search = inquilinoSearch.value.toLowerCase()
  if (!search) {
    filteredInquilinos.value = inquilinos.value
  } else {
    filteredInquilinos.value = inquilinos.value.filter(
      (i) => i.nome.toLowerCase().includes(search) || (i.cpf && i.cpf.includes(search)),
    )
  }
  showInquilinoDropdown.value = true
}

const filterImoveis = () => {
  const search = imovelSearch.value.toLowerCase()
  if (!search) {
    filteredImoveis.value = imoveis.value
  } else {
    filteredImoveis.value = imoveis.value.filter(
      (i) =>
        i.nome.toLowerCase().includes(search) ||
        (i.endereco && i.endereco.toLowerCase().includes(search)),
    )
  }
  showImovelDropdown.value = true
}

const selectInquilino = (inquilino) => {
  formData.value.inquilinoId = inquilino.id
  inquilinoSearch.value = `${inquilino.nome} - ${inquilino.telefone}`
  showInquilinoDropdown.value = false
}

const selectImovel = (imovel) => {
  formData.value.imovelId = imovel.id
  imovelSearch.value = `${imovel.nome} - ${imovel.endereco}`
  showImovelDropdown.value = false
}

// Funções dos modais inline
const openInquilinoModal = () => {
  showInquilinoModal.value = true
  showInquilinoDropdown.value = false
}

const closeInquilinoModal = () => {
  showInquilinoModal.value = false
}

const handleInquilinoCreated = (novoInquilino) => {
  inquilinos.value.unshift(novoInquilino)
  filteredInquilinos.value = inquilinos.value
  selectInquilino(novoInquilino)
  closeInquilinoModal()
}

const openImovelModal = () => {
  showImovelModal.value = true
  showImovelDropdown.value = false
}

const closeImovelModal = () => {
  showImovelModal.value = false
}

const handleImovelCreated = (novoImovel) => {
  imoveis.value.unshift(novoImovel)
  filteredImoveis.value = imoveis.value
  selectImovel(novoImovel)
  closeImovelModal()
}

const resetForm = () => {
  formData.value = {
    inquilinoId: '',
    imovelId: '',
    dataInicio: '',
    dataFim: '',
    valor: '',
    metodoDePagamento: '',
    status: '',
  }
  inquilinoSearch.value = ''
  imovelSearch.value = ''
  showInquilinoDropdown.value = false
  showImovelDropdown.value = false
  error.value = ''
  // Fechar modais inline ao resetar
  showInquilinoModal.value = false
  showImovelModal.value = false
}

const formatDateForInput = (dateString) => {
  if (!dateString) return ''

  if (dateString.includes('/')) {
    const [day, month, year] = dateString.split('/')
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
  }
  return dateString
}

watch(
  () => props.isOpen,
  (newValue) => {
    if (newValue) {
      loadSelectData()
    } else {
      // Quando fechar o modal principal, fechar os modais inline também
      showInquilinoModal.value = false
      showImovelModal.value = false
    }
  },
)

watch(
  () => props.aluguel,
  (newAluguel) => {
    if (newAluguel) {
      isEditMode.value = true
      formData.value = {
        inquilinoId: newAluguel.inquilinoId || '',
        imovelId: newAluguel.imovelId || '',
        dataInicio: formatDateForInput(newAluguel.dataInicio) || '',
        dataFim: formatDateForInput(newAluguel.dataFim) || '',
        valor: newAluguel.valor || '',
        metodoDePagamento: newAluguel.metodoDePagamento || '',
        status: newAluguel.status || '',
      }

      if (newAluguel.inquilino) {
        inquilinoSearch.value = `${newAluguel.inquilino.nome}`
      } else if (newAluguel.inquilinoId) {
        const inquilino = inquilinos.value.find((i) => i.id === newAluguel.inquilinoId)
        if (inquilino) {
          inquilinoSearch.value = `${inquilino.nome} - ${inquilino.telefone}`
        }
      }

      if (newAluguel.imovel) {
        imovelSearch.value = `${newAluguel.imovel.nome}`
      } else if (newAluguel.imovelId) {
        const imovel = imoveis.value.find((i) => i.id === newAluguel.imovelId)
        if (imovel) {
          imovelSearch.value = `${imovel.nome} - ${imovel.endereco}`
        }
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
  if (!formData.value.inquilinoId) {
    error.value = 'Selecione um inquilino'
    return false
  }
  if (!formData.value.imovelId) {
    error.value = 'Selecione um imóvel'
    return false
  }
  if (!formData.value.dataInicio) {
    error.value = 'Data de início é obrigatória'
    return false
  }
  if (!formData.value.dataFim) {
    error.value = 'Data de fim é obrigatória'
    return false
  }
  if (!formData.value.valor || formData.value.valor <= 0) {
    error.value = 'Valor deve ser maior que zero'
    return false
  }
  if (!formData.value.metodoDePagamento) {
    error.value = 'Selecione um método de pagamento'
    return false
  }
  if (!formData.value.status) {
    error.value = 'Selecione um status'
    return false
  }

  if (new Date(formData.value.dataFim) <= new Date(formData.value.dataInicio)) {
    error.value = 'Data de fim deve ser posterior à data de início'
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
      inquilinoId: parseInt(formData.value.inquilinoId),
      imovelId: parseInt(formData.value.imovelId),
      dataInicio: formData.value.dataInicio,
      dataFim: formData.value.dataFim,
      valor: parseFloat(formData.value.valor),
      metodoDePagamento: formData.value.metodoDePagamento,
      status: formData.value.status,
    }

    console.log('📤 Enviando payload:', payload)

    let response
    if (isEditMode.value) {
      response = await aluguelAPI.update(props.aluguel.id, payload)
    } else {
      response = await aluguelAPI.create(payload)
    }

    if (response.data.success) {
      emit('success')
      closeModal()
    } else {
      error.value = response.data.message || 'Erro ao salvar aluguel'
    }
  } catch (err) {
    console.error('Erro ao salvar:', err)
    error.value = err.response?.data?.message || 'Erro ao salvar aluguel'
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
  max-width: 700px;
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

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3rem;
}

.spinner {
  width: 2.5rem;
  height: 2.5rem;
  border: 3px solid #e5e7eb;
  border-top-color: #2563eb;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-state p {
  color: #6b7280;
  font-size: 0.875rem;
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

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
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

.input-with-button {
  display: flex;
  gap: 0.5rem;
}

.autocomplete-wrapper {
  flex: 1;
  position: relative;
}

.form-group input,
.form-group select {
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
.form-group select:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.btn-add-inline {
  background-color: #2563eb;
  color: white;
  border: none;
  border-radius: 0.375rem;
  padding: 0.625rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
  flex-shrink: 0;
}

.btn-add-inline:hover {
  background-color: #1d4ed8;
}

.btn-add-inline svg {
  width: 1.25rem;
  height: 1.25rem;
}

.dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #d1d5db;
  border-top: none;
  border-radius: 0 0 0.375rem 0.375rem;
  max-height: 200px;
  overflow-y: auto;
  z-index: 10;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-top: 0.25rem;
}

.dropdown-item {
  padding: 0.625rem 0.875rem;
  cursor: pointer;
  font-size: 0.875rem;
  transition: background-color 0.2s;
}

.dropdown-item:hover {
  background-color: #f3f4f6;
}

.dropdown-item.empty {
  color: #6b7280;
  cursor: default;
}

.dropdown-item.empty:hover {
  background-color: white;
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

@media (max-width: 640px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
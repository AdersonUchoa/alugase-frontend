<template>
  <div class="page">
    <Navbar />
    
    <main class="content">
      <div class="page-header">
        <div>
          <h1>Aluguéis</h1>
          <p>Gerencie os contratos de aluguel</p>
        </div>
        <button @click="handleOpenCreateModal" class="btn-primary">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Novo Aluguel
        </button>
      </div>

      <!-- Dashboard Cards -->
      <div class="dashboard-cards">
        <div class="dashboard-card">
          <div class="card-icon purple">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div class="card-content">
            <h3>Total de Aluguéis</h3>
            <p class="card-number">{{ dashboardCounts.totalAlugueis || 0 }}</p>
          </div>
        </div>

        <div class="dashboard-card">
          <div class="card-icon green">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="card-content">
            <h3>Em Andamento</h3>
            <p class="card-number">{{ dashboardCounts.alugueisEmAndamento || 0 }}</p>
          </div>
        </div>

        <div class="dashboard-card">
          <div class="card-icon blue">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div class="card-content">
            <h3>Concluídos</h3>
            <p class="card-number">{{ dashboardCounts.alugueisConcluídos || 0 }}</p>
          </div>
        </div>

        <div class="dashboard-card">
          <div class="card-icon red">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="card-content">
            <h3>Cancelados</h3>
            <p class="card-number">{{ dashboardCounts.alugueisCancelados || 0 }}</p>
          </div>
        </div>
      </div>

      <!-- Barra de Busca -->
      <div class="search-bar">
        <input 
          v-model="searchTerm" 
          @input="handleSearch"
          type="text" 
          placeholder="Buscar aluguéis..."
        />
      </div>

      <!-- Loading -->
      <div v-if="loading" class="loading">
        <div class="spinner"></div>
        <p>Carregando aluguéis...</p>
      </div>

      <!-- Lista de Aluguéis -->
      <div v-else>
        <div v-if="alugueis.length === 0" class="empty-state">
          <p>Nenhum aluguel encontrado</p>
        </div>

        <div v-else class="items-grid">
          <div v-for="aluguel in alugueis" :key="aluguel.id" class="item-card">
            <div class="item-header">
              <div class="contract-icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div class="header-info">
                <h3>Contrato #{{ aluguel.id }}</h3>
                <span :class="['status-badge', getStatusClass(aluguel.status)]">
                  {{ aluguel.status }}
                </span>
              </div>
            </div>
            
            <div class="item-body">
              <div class="info-section">
                <h4>Imóvel</h4>
                <p>{{ aluguel.imovel?.nome || `ID: ${aluguel.imovelId}` }}</p>
              </div>
              
              <div class="info-section">
                <h4>Inquilino</h4>
                <p>{{ aluguel.inquilino?.nome || `ID: ${aluguel.inquilinoId}` }}</p>
              </div>
              
              <div class="info-grid">
                <div class="info-item">
                  <span class="label">Valor:</span>
                  <span class="value">{{ formatCurrency(aluguel.valor) }}</span>
                </div>
                <div class="info-item">
                  <span class="label">Pagamento:</span>
                  <span class="value">{{ aluguel.metodoDePagamento }}</span>
                </div>
              </div>
              
              <div class="info-grid">
                <div class="info-item">
                  <span class="label">Início:</span>
                  <span class="value">{{ formatDate(aluguel.dataInicio) }}</span>
                </div>
                <div class="info-item">
                  <span class="label">Fim:</span>
                  <span class="value">{{ formatDate(aluguel.dataFim) }}</span>
                </div>
              </div>
            </div>
            
            <div class="item-footer">
              <button @click="viewDetails(aluguel.id)" class="btn-view">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Detalhes
              </button>
              <button @click="handleOpenEditModal(aluguel)" class="btn-edit">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Editar
              </button>
              <button @click="handleDelete(aluguel.id)" class="btn-delete">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Excluir
              </button>
            </div>
          </div>
        </div>

        <!-- Paginação -->
        <div class="pagination" v-if="totalPages > 1">
          <button 
            @click="changePage(currentPage - 1)" 
            :disabled="currentPage === 1"
            class="btn-page"
          >
            Anterior
          </button>
          <span class="page-info">Página {{ currentPage }} de {{ totalPages }}</span>
          <button 
            @click="changePage(currentPage + 1)" 
            :disabled="currentPage === totalPages"
            class="btn-page"
          >
            Próxima
          </button>
        </div>
      </div>
    </main>

    <!-- Modal -->
    <AluguelModal 
      :is-open="showModal" 
      :aluguel="selectedAluguel"
      @close="handleCloseModal"
      @success="handleModalSuccess"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Navbar from '@/components/Navbar.vue'
import AluguelModal from '@/components/AluguelModal.vue'
import { aluguelAPI } from '@/api/services'

const router = useRouter()

const loading = ref(false)
const alugueis = ref([])
const searchTerm = ref('')
const currentPage = ref(1)
const totalPages = ref(1)
const limit = ref(9)
const dashboardCounts = ref({})

const showModal = ref(false)
const selectedAluguel = ref(null)

const loadDashboardCounts = async () => {
  try {
    const response = await aluguelAPI.getDashboardCounts()
    if (response.data.success) {
      dashboardCounts.value = response.data.data
    }
  } catch (error) {
    console.error('Erro ao carregar contadores:', error)
  }
}

const loadAlugueis = async () => {
  try {
    loading.value = true
    const response = await aluguelAPI.getAll(
      currentPage.value, 
      limit.value, 
      false,
      true, // includeImoveis
      true, // includeInquilinos
      searchTerm.value || null
    )

    if (response.data.success) {
      alugueis.value = response.data.data.items || response.data.data
      totalPages.value = response.data.data.totalPages || 1
    }
  } catch (error) {
    console.error('❌ Erro ao carregar aluguéis:', error)
    alert('Erro ao carregar aluguéis')
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  currentPage.value = 1
  loadAlugueis()
}

const changePage = (page) => {
  currentPage.value = page
  loadAlugueis()
}

const formatCurrency = (value) => {
  if (!value) return 'R$ 0,00'
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('pt-BR')
}

const getStatusClass = (status) => {
  const statusMap = {
    'Ativo': 'status-active',
    'Em Andamento': 'status-active',
    'EmAndamento': 'status-active',
    'Pendente': 'status-pending',
    'Pendente de Pagamento': 'status-pending',
    'PendenteDePagamento': 'status-pending',
    'Pendente de Entrada': 'status-pending',
    'PendenteDeEntrada': 'status-pending',
    'Pausado': 'status-pending',
    'Cancelado': 'status-cancelled',
    'Finalizado': 'status-finished'
  }
  return statusMap[status] || 'status-default'
}

const handleOpenCreateModal = () => {
  selectedAluguel.value = null
  showModal.value = true
}

const handleOpenEditModal = (aluguel) => {
  selectedAluguel.value = aluguel
  showModal.value = true
}

const handleCloseModal = () => {
  showModal.value = false
  selectedAluguel.value = null
}

const handleModalSuccess = () => {
  loadAlugueis()
}

const viewDetails = (id) => {
  router.push(`/alugueis/${id}`)
}

const handleDelete = async (id) => {
  if (!confirm('Tem certeza que deseja excluir este aluguel?')) return

  try {
    const response = await aluguelAPI.delete(id)
    if (response.data.success) {
      alert('Aluguel excluído com sucesso!')
      loadAlugueis()
    }
  } catch (error) {
    console.error('❌ Erro ao excluir:', error)
    alert('Erro ao excluir aluguel')
  }
}

onMounted(() => {
  loadDashboardCounts()
  loadAlugueis()
})
</script>

<style scoped>
.page {
  min-height: 100vh;
  background-color: #f9fafb;
}

.content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.page-header h1 {
  font-size: 2rem;
  font-weight: bold;
  color: #111827;
  margin: 0 0 0.5rem 0;
}

.page-header p {
  color: #6b7280;
  margin: 0;
}

.dashboard-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.dashboard-card {
  background: white;
  border-radius: 0.5rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  gap: 1rem;
  align-items: center;
}

.card-icon {
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.card-icon svg {
  width: 2rem;
  height: 2rem;
  color: white;
}

.card-icon.purple {
  background-color: #8b5cf6;
}

.card-icon.green {
  background-color: #10b981;
}

.card-icon.blue {
  background-color: #3b82f6;
}

.card-icon.red {
  background-color: #ef4444;
}

.card-content {
  flex: 1;
}

.card-content h3 {
  font-size: 0.875rem;
  font-weight: 500;
  color: #6b7280;
  margin: 0 0 0.5rem 0;
}

.card-number {
  font-size: 2rem;
  font-weight: bold;
  color: #111827;
  margin: 0;
}

.btn-primary {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #2563eb;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-primary svg {
  width: 1.25rem;
  height: 1.25rem;
}

.btn-primary:hover {
  background-color: #1d4ed8;
}

.search-bar {
  margin-bottom: 2rem;
}

.search-bar input {
  width: 100%;
  max-width: 500px;
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s;
}

.search-bar input:focus {
  border-color: #2563eb;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 4rem;
}

.spinner {
  width: 3rem;
  height: 3rem;
  border: 3px solid #e5e7eb;
  border-top-color: #2563eb;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.empty-state {
  text-align: center;
  padding: 4rem;
  color: #6b7280;
}

.items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.item-card {
  background: white;
  border-radius: 0.5rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.2s;
}

.item-card:hover {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.item-header {
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.contract-icon {
  width: 3rem;
  height: 3rem;
  background-color: #ede9fe;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.contract-icon svg {
  width: 1.75rem;
  height: 1.75rem;
  color: #8b5cf6;
}

.header-info {
  flex: 1;
}

.header-info h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 0.5rem 0;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
}

.status-active {
  background-color: #d1fae5;
  color: #065f46;
}

.status-pending {
  background-color: #fef3c7;
  color: #92400e;
}

.status-cancelled {
  background-color: #fee2e2;
  color: #991b1b;
}

.status-finished {
  background-color: #e0e7ff;
  color: #3730a3;
}

.status-default {
  background-color: #f3f4f6;
  color: #6b7280;
}

.item-body {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1rem;
}

.info-section h4 {
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  margin: 0 0 0.25rem 0;
}

.info-section p {
  font-size: 0.875rem;
  color: #111827;
  margin: 0;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

.info-item {
  display: flex;
  flex-direction: column;
}

.label {
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 500;
}

.value {
  font-size: 0.875rem;
  color: #111827;
  font-weight: 500;
}

.item-footer {
  display: flex;
  gap: 0.75rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}

.btn-view,
.btn-edit, 
.btn-delete {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  flex: 1;
  justify-content: center;
}

.btn-view {
  background-color: #dbeafe;
  color: #1e40af;
}

.btn-view:hover {
  background-color: #bfdbfe;
}

.btn-edit {
  background-color: #f3f4f6;
  color: #374151;
}

.btn-edit:hover {
  background-color: #e5e7eb;
}

.btn-delete {
  background-color: #fee2e2;
  color: #dc2626;
}

.btn-delete:hover {
  background-color: #fecaca;
}

.btn-view svg,
.btn-edit svg, 
.btn-delete svg {
  width: 1rem;
  height: 1rem;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
}

.btn-page {
  padding: 0.5rem 1rem;
  background-color: white;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-page:hover:not(:disabled) {
  background-color: #f3f4f6;
}

.btn-page:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  color: #6b7280;
  font-size: 0.875rem;
}
</style>
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
              d="M12 4v16m8-8H4"
            />
          </svg>
          Novo Aluguel
        </button>
      </div>

      <AluguelDashboardCards :counts="dashboardCounts" />

      <div class="search-and-filters">
        <div class="search-bar">
          <input
            v-model="searchTerm"
            @input="handleSearch"
            type="text"
            placeholder="Buscar aluguéis..."
          />
        </div>
        <button
          @click="showFilters = !showFilters"
          class="btn-filters"
          :class="{ active: showFilters || hasActiveFilters }"
        >
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
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            />
          </svg>
          Filtros
          <span v-if="activeFiltersCount > 0" class="filter-count">{{ activeFiltersCount }}</span>
        </button>
      </div>

      <AluguelFiltersPanel
        :show="showFilters"
        v-model="filters"
        :status-options="statusOptions"
        :metodos-pagamento-options="metodosPagamentoOptions"
        @clear="handleClearFilters"
        @apply="applyFilters"
      />

      <AluguelFilterBadges
        v-if="hasActiveFilters"
        :filters="filters"
        :status-options="statusOptions"
        :metodos-pagamento-options="metodosPagamentoOptions"
        @clear-date="handleClearDateFilter"
        @clear-valor="handleClearValorFilter"
        @remove-status="handleRemoveStatus"
        @remove-metodo="handleRemoveMetodo"
      />

      <div v-if="loading" class="loading">
        <div class="spinner"></div>
        <p>Carregando aluguéis...</p>
      </div>

      <div v-else>
        <div v-if="alugueis.length === 0" class="empty-state">
          <p>Nenhum aluguel encontrado</p>
        </div>

        <div v-else class="items-grid">
          <AluguelCard
            v-for="aluguel in alugueis"
            :key="aluguel.id"
            :aluguel="aluguel"
            @view="viewDetails"
            @edit="handleOpenEditModal"
            @delete="handleDelete"
          />
        </div>

        <PaginationComponent
          v-if="totalPages > 1"
          :current-page="currentPage"
          :total-pages="totalPages"
          @change="changePage"
        />
      </div>
    </main>

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
import AluguelDashboardCards from '@/components/AluguelDashboardCards.vue'
import AluguelFiltersPanel from '@/components/AluguelFiltersPanel.vue'
import AluguelFilterBadges from '@/components/AluguelFilterBadges.vue'
import AluguelCard from '@/components/AluguelCard.vue'
import PaginationComponent from '@/components/PaginationComponent.vue'
import { aluguelAPI, enumsAPI } from '@/api/services'
import { useAluguelFilters } from '@/composables/useAluguelFilters'

const router = useRouter()

const loading = ref(false)
const alugueis = ref([])
const searchTerm = ref('')
const currentPage = ref(1)
const totalPages = ref(1)
const limit = ref(10)
const dashboardCounts = ref({})
const showModal = ref(false)
const selectedAluguel = ref(null)
const showFilters = ref(false)
const statusOptions = ref([])
const metodosPagamentoOptions = ref([])

const {
  filters,
  hasActiveFilters,
  activeFiltersCount,
  clearFilters,
  clearDateFilter,
  clearValorFilter,
  removeStatus,
  removeMetodo,
  buildApiParams,
} = useAluguelFilters()

const loadEnums = async () => {
  try {
    const [statusRes, metodosRes] = await Promise.all([
      enumsAPI.getStatusAluguel(),
      enumsAPI.getMetodosPagamento(),
    ])
    if (statusRes.data.success) statusOptions.value = statusRes.data.data
    if (metodosRes.data.success) metodosPagamentoOptions.value = metodosRes.data.data
  } catch (error) {
    console.error('Erro ao carregar enums:', error)
  }
}

const loadDashboardCounts = async () => {
  try {
    const response = await aluguelAPI.getDashboardCounts()
    if (response.data.success) dashboardCounts.value = response.data.data
  } catch (error) {
    console.error('Erro ao carregar contadores:', error)
  }
}

const loadAlugueis = async () => {
  try {
    loading.value = true
    const params = buildApiParams(currentPage.value, limit.value, searchTerm.value)
    const response = await aluguelAPI.getAll(params)

    if (response.data.success) {
      alugueis.value = response.data.data.items || response.data.data
      totalPages.value = response.data.data.totalPages || 1
    }
  } catch (error) {
    console.error('Erro ao carregar aluguéis:', error)
    alert('Erro ao carregar aluguéis')
  } finally {
    loading.value = false
  }
}

const applyFilters = () => {
  currentPage.value = 1
  loadAlugueis()
}

const handleClearFilters = () => {
  clearFilters()
  applyFilters()
}

const handleClearDateFilter = () => {
  clearDateFilter()
  applyFilters()
}

const handleClearValorFilter = () => {
  clearValorFilter()
  applyFilters()
}

const handleRemoveStatus = (status) => {
  removeStatus(status)
  applyFilters()
}

const handleRemoveMetodo = (metodo) => {
  removeMetodo(metodo)
  applyFilters()
}

const handleSearch = () => {
  currentPage.value = 1
  loadAlugueis()
}

const changePage = (page) => {
  currentPage.value = page
  loadAlugueis()
}

// Modal handlers
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
  loadDashboardCounts()
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
      loadDashboardCounts()
    }
  } catch (error) {
    console.error('Erro ao excluir:', error)
    alert('Erro ao excluir aluguel')
  }
}

onMounted(() => {
  loadEnums()
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

.search-and-filters {
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-bottom: 1.5rem;
}

.search-bar {
  flex: 1;
}

.search-bar input {
  width: 100%;
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

.btn-filters {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: white;
  color: #374151;
  padding: 0.75rem 1.25rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
  position: relative;
}

.btn-filters svg {
  width: 1.125rem;
  height: 1.125rem;
}

.btn-filters:hover {
  background-color: #f9fafb;
  border-color: #9ca3af;
}

.btn-filters.active {
  background-color: #eff6ff;
  border-color: #2563eb;
  color: #2563eb;
}

.filter-count {
  background-color: #2563eb;
  color: white;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  min-width: 1.25rem;
  text-align: center;
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
  to {
    transform: rotate(360deg);
  }
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

@media (max-width: 768px) {
  .search-and-filters {
    flex-direction: column;
  }

  .btn-filters {
    width: 100%;
    justify-content: center;
  }
}
</style>

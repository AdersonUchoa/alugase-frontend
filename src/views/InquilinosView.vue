<template>
  <div class="page">
    <Navbar />

    <main class="content">
      <div class="page-header">
        <div>
          <h1>Inquilinos</h1>
          <p>Gerencie os inquilinos cadastrados</p>
        </div>
        <button @click="openCreateModal" class="btn-primary">
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
          Novo Inquilino
        </button>
      </div>

      <div class="dashboard-cards">
        <div class="dashboard-card">
          <div class="card-icon green">
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
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <div class="card-content">
            <h3>Total de Inquilinos</h3>
            <p class="card-number">{{ dashboardCounts.totalInquilinos || 0 }}</p>
          </div>
        </div>
      </div>

      <div class="search-bar">
        <input
          v-model="searchTerm"
          @input="handleSearch"
          type="text"
          placeholder="Buscar por nome, CPF, email ou telefone..."
        />
      </div>

      <div v-if="loading" class="loading">
        <div class="spinner"></div>
        <p>Carregando inquilinos...</p>
      </div>

      <div v-else>
        <div v-if="inquilinos.length === 0" class="empty-state">
          <p>Nenhum inquilino encontrado</p>
        </div>

        <div v-else class="items-grid">
          <div v-for="inquilino in inquilinos" :key="inquilino.id" class="item-card">
            <div class="item-header">
              <div class="avatar">
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
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <div class="header-info">
                <h3>{{ inquilino.nome }}</h3>
                <span class="badge">{{ inquilino.cpf }}</span>
              </div>
            </div>
            <div class="item-body">
              <div class="info-row">
                <span class="icon">📧</span>
                <span class="info-text">{{ inquilino.email || 'Sem email' }}</span>
              </div>
              <div class="info-row">
                <span class="icon">📱</span>
                <span class="info-text">{{ inquilino.telefone || 'Sem telefone' }}</span>
              </div>
              <div class="info-row">
                <span class="icon">📍</span>
                <span class="info-text">{{ inquilino.endereco || 'Sem endereço' }}</span>
              </div>
            </div>
            <div class="item-footer">
              <button @click="viewDetails(inquilino.id)" class="btn-view">
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
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
                Detalhes
              </button>
              <button @click="openEditModal(inquilino)" class="btn-edit">
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
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                Editar
              </button>
              <button @click="handleDelete(inquilino.id)" class="btn-delete">
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
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                Excluir
              </button>
            </div>
          </div>
        </div>

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

    <InquilinoModal
      :is-open="showModal"
      :inquilino="selectedInquilino"
      @close="closeModal"
      @success="handleModalSuccess"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Navbar from '@/components/Navbar.vue'
import InquilinoModal from '@/components/InquilinoModal.vue'
import { inquilinoAPI } from '@/api/services'

const router = useRouter()
const loading = ref(false)
const inquilinos = ref([])
const searchTerm = ref('')
const currentPage = ref(1)
const totalPages = ref(1)
const limit = ref(10)
const dashboardCounts = ref({})

const loadDashboardCounts = async () => {
  try {
    const response = await inquilinoAPI.getDashboardCounts()
    if (response.data.success) {
      dashboardCounts.value = response.data.data
    }
  } catch (error) {
    console.error('Erro ao carregar contadores:', error)
  }
}

const loadInquilinos = async () => {
  try {
    loading.value = true
    const response = await inquilinoAPI.getAll(
      currentPage.value,
      limit.value,
      false,
      false,
      searchTerm.value || null,
    )

    if (response.data.success) {
      inquilinos.value = response.data.data.items || response.data.data
      totalPages.value = response.data.data.totalPages || 1
    }
  } catch (error) {
    console.error('❌ Erro ao carregar inquilinos:', error)
    alert('Erro ao carregar inquilinos')
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  currentPage.value = 1
  loadInquilinos()
}

const changePage = (page) => {
  currentPage.value = page
  loadInquilinos()
}

const showModal = ref(false)
const selectedInquilino = ref(null)

const openCreateModal = () => {
  selectedInquilino.value = null
  showModal.value = true
}

const openEditModal = (inquilino) => {
  selectedInquilino.value = inquilino
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selectedInquilino.value = null
}

const handleModalSuccess = () => {
  loadInquilinos()
}

const handleDelete = async (id) => {
  if (!confirm('Tem certeza que deseja excluir este inquilino?')) return

  try {
    const response = await inquilinoAPI.delete(id)
    if (response.data.success) {
      alert('Inquilino excluído com sucesso!')
      loadInquilinos()
    }
  } catch (error) {
    console.error('❌ Erro ao excluir:', error)
    alert('Erro ao excluir inquilino')
  }
}

const viewDetails = (id) => {
  router.push(`/inquilinos/${id}`)
}

onMounted(() => {
  loadDashboardCounts()
  loadInquilinos()
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
  grid-template-columns: repeat(auto-fill, minmax(500px, max-content));
  gap: 1.5rem;
  margin-bottom: 2rem;
  justify-content: start;
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

.card-icon.green {
  background-color: #10b981;
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
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
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

.avatar {
  width: 3rem;
  height: 3rem;
  background-color: #dbeafe;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.avatar svg {
  width: 1.75rem;
  height: 1.75rem;
  color: #2563eb;
}

.header-info {
  flex: 1;
}

.header-info h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 0.25rem 0;
}

.badge {
  background-color: #f3f4f6;
  color: #6b7280;
  padding: 0.125rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
  font-family: monospace;
}

.item-body {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.info-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.icon {
  font-size: 1rem;
}

.info-text {
  color: #374151;
  font-size: 0.875rem;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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

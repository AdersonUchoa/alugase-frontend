<template>
  <div class="page">
    <Navbar />

    <main class="content">
      <div class="page-header">
        <div>
          <h1>Imóveis</h1>
          <p>Gerencie os imóveis cadastrados</p>
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
          Novo Imóvel
        </button>
      </div>

      <div class="dashboard-cards">
        <div class="dashboard-card">
          <div class="card-icon blue">
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
          <div class="card-content">
            <h3>Total de Imóveis</h3>
            <p class="card-number">{{ dashboardCounts.totalImoveis || 0 }}</p>
          </div>
        </div>
      </div>

      <div class="search-bar">
        <input
          v-model="searchTerm"
          @input="handleSearch"
          type="text"
          placeholder="Buscar por nome ou endereço..."
        />
      </div>

      <div v-if="loading" class="loading">
        <div class="spinner"></div>
        <p>Carregando imóveis...</p>
      </div>

      <div v-else>
        <div v-if="imoveis.length === 0" class="empty-state">
          <p>Nenhum imóvel encontrado</p>
        </div>

        <div v-else class="items-grid">
          <div v-for="imovel in imoveis" :key="imovel.id" class="item-card">
            <div class="item-header">
              <h3>{{ imovel.nome }}</h3>
              <span class="badge">{{ imovel.tipoImovel }}</span>
            </div>
            <div class="item-body">
              <p class="item-address">📍 {{ imovel.endereco }}</p>
              <p class="item-description">{{ imovel.descricao || 'Sem descrição' }}</p>
            </div>
            <div class="item-footer">
              <button @click="viewDetails(imovel.id)" class="btn-view">
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
              <button @click="openEditModal(imovel)" class="btn-edit">
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
              <button @click="handleDelete(imovel.id)" class="btn-delete">
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

    <ImovelModal
      :is-open="showModal"
      :imovel="selectedImovel"
      @close="closeModal"
      @success="handleModalSuccess"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Navbar from '@/components/Navbar.vue'
import ImovelModal from '@/components/ImovelModal.vue'
import { imovelAPI } from '@/api/services'
const dashboardCounts = ref({})

const router = useRouter()
const loading = ref(false)
const imoveis = ref([])
const searchTerm = ref('')
const currentPage = ref(1)
const totalPages = ref(1)
const limit = ref(10)

const loadDashboardCounts = async () => {
  try {
    const response = await imovelAPI.getDashboardCounts()
    if (response.data.success) {
      dashboardCounts.value = response.data.data
    }
  } catch (error) {
    console.error('Erro ao carregar contadores:', error)
  }
}

const loadImoveis = async () => {
  try {
    loading.value = true
    const response = await imovelAPI.getAll(
      currentPage.value,
      limit.value,
      false,
      false,
      searchTerm.value || null,
    )

    if (response.data.success) {
      imoveis.value = response.data.data.items || response.data.data
      totalPages.value = response.data.data.totalPages || 1
    }
  } catch (error) {
    console.error('❌ Erro ao carregar imóveis:', error)
    alert('Erro ao carregar imóveis')
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  currentPage.value = 1
  loadImoveis()
}

const changePage = (page) => {
  currentPage.value = page
  loadImoveis()
}

const showModal = ref(false)
const selectedImovel = ref(null)

const openCreateModal = () => {
  selectedImovel.value = null
  showModal.value = true
}

const openEditModal = (imovel) => {
  selectedImovel.value = imovel
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selectedImovel.value = null
}

const handleModalSuccess = () => {
  loadImoveis()
}

const handleDelete = async (id) => {
  if (!confirm('Tem certeza que deseja excluir este imóvel?')) return

  try {
    const response = await imovelAPI.delete(id)
    if (response.data.success) {
      alert('Imóvel excluído com sucesso!')
      loadImoveis()
    }
  } catch (error) {
    console.error('❌ Erro ao excluir:', error)
    alert('Erro ao excluir imóvel')
  }
}

const viewDetails = (id) => {
  router.push(`/imoveis/${id}`)
}

onMounted(() => {
  loadDashboardCounts()
  loadImoveis()
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

.card-icon.blue {
  background-color: #2563eb;
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
  justify-content: space-between;
  align-items: start;
  margin-bottom: 1rem;
}

.item-header h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.badge {
  background-color: #dbeafe;
  color: #2563eb;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
}

.item-body {
  margin-bottom: 1rem;
}

.item-address {
  color: #6b7280;
  font-size: 0.875rem;
  margin: 0 0 0.5rem 0;
}

.item-description {
  color: #374151;
  font-size: 0.875rem;
  margin: 0;
  line-height: 1.5;
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

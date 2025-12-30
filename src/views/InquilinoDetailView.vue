<template>
  <div class="page">
    <Navbar />
    
    <main class="content">
      <!-- Botão Voltar -->
      <button @click="goBack" class="btn-back">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Voltar
      </button>

      <div v-if="loading" class="loading">
        <div class="spinner"></div>
        <p>Carregando...</p>
      </div>

      <div v-else-if="inquilino">
        <!-- Cabeçalho -->
        <div class="detail-header">
          <div class="header-icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div class="header-info">
            <h1>{{ inquilino.nome }}</h1>
            <span class="badge">{{ inquilino.cpf }}</span>
          </div>
          <div class="header-actions">
            <button @click="openEditModal" class="btn-edit-header">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Editar
            </button>
            <button @click="handleDelete" class="btn-delete-header">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Excluir
            </button>
          </div>
        </div>

        <!-- Informações do Inquilino -->
        <div class="detail-card">
          <h2>Informações</h2>
          <div class="info-grid">
            <div class="info-item">
              <span class="label">CPF:</span>
              <span class="value">{{ inquilino.cpf }}</span>
            </div>
            <div class="info-item">
              <span class="label">Telefone:</span>
              <span class="value">{{ inquilino.telefone || '-' }}</span>
            </div>
            <div class="info-item">
              <span class="label">E-mail:</span>
              <span class="value">{{ inquilino.email || '-' }}</span>
            </div>
            <div class="info-item">
              <span class="label">Endereço:</span>
              <span class="value">{{ inquilino.endereco || '-' }}</span>
            </div>
          </div>
        </div>

        <!-- Histórico de Aluguéis -->
        <div class="detail-card">
          <h2>Histórico de Aluguéis ({{ alugueis.length }})</h2>
          
          <div v-if="loadingAlugueis" class="loading-small">
            <div class="spinner-small"></div>
            <p>Carregando aluguéis...</p>
          </div>

          <div v-else-if="alugueis.length === 0" class="empty-state-small">
            <p>Nenhum aluguel encontrado para este inquilino</p>
          </div>

          <div v-else class="alugueis-list">
            <div v-for="aluguel in alugueis" :key="aluguel.id" class="aluguel-item">
              <div class="aluguel-header">
                <h3>Contrato #{{ aluguel.id }}</h3>
                <span :class="['status-badge', getStatusClass(aluguel.status)]">
                  {{ aluguel.status }}
                </span>
              </div>
              <div class="aluguel-body">
                <div class="aluguel-info">
                  <span class="label">Imóvel:</span>
                  <span class="value">{{ aluguel.imovel?.nome || `ID: ${aluguel.imovelId}` }}</span>
                </div>
                <div class="aluguel-info">
                  <span class="label">Endereço:</span>
                  <span class="value">{{ aluguel.imovel?.endereco || '-' }}</span>
                </div>
                <div class="aluguel-info">
                  <span class="label">Período:</span>
                  <span class="value">{{ formatDate(aluguel.dataInicio) }} até {{ formatDate(aluguel.dataFim) }}</span>
                </div>
                <div class="aluguel-info">
                  <span class="label">Valor:</span>
                  <span class="value">{{ formatCurrency(aluguel.valor) }}</span>
                </div>
                <div class="aluguel-info">
                  <span class="label">Pagamento:</span>
                  <span class="value">{{ aluguel.metodoDePagamento }}</span>
                </div>
              </div>
              <div class="aluguel-footer">
                <router-link :to="`/alugueis/${aluguel.id}`" class="btn-view-aluguel">
                  Ver Detalhes
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Modal de Edição -->
    <InquilinoModal 
      :is-open="showModal" 
      :inquilino="inquilino"
      @close="closeModal"
      @success="handleModalSuccess"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Navbar from '@/components/Navbar.vue'
import InquilinoModal from '@/components/InquilinoModal.vue'
import { inquilinoAPI, aluguelAPI } from '@/api/services'

const route = useRoute()
const router = useRouter()

const loading = ref(true)
const loadingAlugueis = ref(true)
const inquilino = ref(null)
const alugueis = ref([])
const showModal = ref(false)

const loadInquilino = async () => {
  try {
    loading.value = true
    const response = await inquilinoAPI.getById(route.params.id)
    
    if (response.data.success) {
      inquilino.value = response.data.data
    } else {
      alert('Inquilino não encontrado')
      router.push('/inquilinos')
    }
  } catch (error) {
    console.error('Erro ao carregar inquilino:', error)
    alert('Erro ao carregar inquilino')
    router.push('/inquilinos')
  } finally {
    loading.value = false
  }
}

const loadAlugueis = async () => {
  try {
    loadingAlugueis.value = true
    const response = await aluguelAPI.getByInquilinoId(route.params.id, false)
    
    if (response.data.success) {
      alugueis.value = response.data.data
    }
  } catch (error) {
    console.error('Erro ao carregar aluguéis:', error)
  } finally {
    loadingAlugueis.value = false
  }
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

const goBack = () => {
  router.push('/inquilinos')
}

const openEditModal = () => {
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const handleModalSuccess = () => {
  loadInquilino()
}

const handleDelete = async () => {
  if (!confirm('Tem certeza que deseja excluir este inquilino?')) return

  try {
    const response = await inquilinoAPI.delete(route.params.id)
    if (response.data.success) {
      alert('Inquilino excluído com sucesso!')
      router.push('/inquilinos')
    }
  } catch (error) {
    console.error('Erro ao excluir:', error)
    alert('Erro ao excluir inquilino')
  }
}

onMounted(() => {
  loadInquilino()
  loadAlugueis()
})
</script>

<style scoped>
.page {
  min-height: 100vh;
  background-color: #f9fafb;
}

.content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.btn-back {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background-color: white;
  border: 1px solid #d1d5db;
  color: #374151;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 1.5rem;
}

.btn-back:hover {
  background-color: #f9fafb;
}

.btn-back svg {
  width: 1rem;
  height: 1rem;
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

.loading p {
  margin-top: 1rem;
  color: #6b7280;
}

.detail-header {
  background: white;
  border-radius: 0.5rem;
  padding: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.header-icon {
  width: 4rem;
  height: 4rem;
  background-color: #dbeafe;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.header-icon svg {
  width: 2rem;
  height: 2rem;
  color: #2563eb;
}

.header-info {
  flex: 1;
}

.header-info h1 {
  font-size: 1.875rem;
  font-weight: bold;
  color: #111827;
  margin: 0 0 0.5rem 0;
}

.badge {
  background-color: #f3f4f6;
  color: #6b7280;
  padding: 0.25rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  font-family: monospace;
}

.header-actions {
  display: flex;
  gap: 0.75rem;
}

.btn-edit-header,
.btn-delete-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-edit-header {
  background-color: #f3f4f6;
  color: #374151;
}

.btn-edit-header:hover {
  background-color: #e5e7eb;
}

.btn-delete-header {
  background-color: #fee2e2;
  color: #dc2626;
}

.btn-delete-header:hover {
  background-color: #fecaca;
}

.btn-edit-header svg,
.btn-delete-header svg {
  width: 1.125rem;
  height: 1.125rem;
}

.detail-card {
  background: white;
  border-radius: 0.5rem;
  padding: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 1.5rem;
}

.detail-card h2 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 1.5rem 0;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #6b7280;
}

.value {
  font-size: 1rem;
  color: #111827;
}

.loading-small {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 2rem;
}

.spinner-small {
  width: 2rem;
  height: 2rem;
  border: 2px solid #e5e7eb;
  border-top-color: #2563eb;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.loading-small p {
  color: #6b7280;
  font-size: 0.875rem;
}

.empty-state-small {
  padding: 3rem;
  text-align: center;
  color: #6b7280;
}

.alugueis-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.aluguel-item {
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1.5rem;
  transition: all 0.2s;
}

.aluguel-item:hover {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.aluguel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #f3f4f6;
}

.aluguel-header h3 {
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
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

.aluguel-body {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 1rem;
}

.aluguel-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.aluguel-info .label {
  font-size: 0.75rem;
}

.aluguel-info .value {
  font-size: 0.875rem;
}

.aluguel-footer {
  padding-top: 1rem;
  border-top: 1px solid #f3f4f6;
}

.btn-view-aluguel {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: #dbeafe;
  color: #1e40af;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s;
}

.btn-view-aluguel:hover {
  background-color: #bfdbfe;
}

@media (max-width: 768px) {
  .detail-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .header-actions {
    width: 100%;
  }

  .info-grid,
  .aluguel-body {
    grid-template-columns: 1fr;
  }
}
</style>
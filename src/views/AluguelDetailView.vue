<template>
  <div class="page">
    <Navbar />

    <main class="content">
      <!-- Botão Voltar -->
      <button @click="goBack" class="btn-back">
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
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        Voltar
      </button>

      <div v-if="loading" class="loading">
        <div class="spinner"></div>
        <p>Carregando...</p>
      </div>

      <div v-else-if="aluguel">
        <!-- Cabeçalho -->
        <div class="detail-header">
          <div class="header-icon">
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
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <div class="header-info">
            <h1>Contrato #{{ aluguel.id }}</h1>
            <span :class="['badge', getStatusClass(aluguel.status)]">
              {{ aluguel.status }}
            </span>
          </div>
          <div class="header-actions">
            <button @click="openEditModal" class="btn-edit-header">
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
            <button @click="handleDelete" class="btn-delete-header">
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

        <!-- Informações do Contrato -->
        <div class="detail-card">
          <h2>Informações do Contrato</h2>
          <div class="info-grid">
            <div class="info-item">
              <span class="label">Data Início:</span>
              <span class="value">{{ formatDate(aluguel.dataInicio) }}</span>
            </div>
            <div class="info-item">
              <span class="label">Data Fim:</span>
              <span class="value">{{ formatDate(aluguel.dataFim) }}</span>
            </div>
            <div class="info-item">
              <span class="label">Valor:</span>
              <span class="value-highlight">{{ formatCurrency(aluguel.valor) }}</span>
            </div>
            <div class="info-item">
              <span class="label">Método de Pagamento:</span>
              <span class="value">{{ aluguel.metodoDePagamento }}</span>
            </div>
            <div class="info-item">
              <span class="label">Status:</span>
              <span :class="['status-badge', getStatusClass(aluguel.status)]">
                {{ aluguel.status }}
              </span>
            </div>
            <div class="info-item">
              <span class="label">Duração:</span>
              <span class="value">{{ calcularDuracao(aluguel.dataInicio, aluguel.dataFim) }}</span>
            </div>
          </div>
        </div>

        <!-- Informações do Imóvel -->
        <div class="detail-card">
          <div class="card-header">
            <h2>Imóvel</h2>
            <router-link
              v-if="aluguel.imovelId"
              :to="`/imoveis/${aluguel.imovelId}`"
              class="btn-link"
            >
              Ver Detalhes
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
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </router-link>
          </div>
          <div class="info-grid">
            <div class="info-item">
              <span class="label">Nome:</span>
              <span class="value">{{ aluguel.imovel?.nome || '-' }}</span>
            </div>
            <div class="info-item">
              <span class="label">Tipo:</span>
              <span class="value">{{ aluguel.imovel?.tipoImovel || '-' }}</span>
            </div>
            <div class="info-item full-width">
              <span class="label">Endereço:</span>
              <span class="value">{{ aluguel.imovel?.endereco || '-' }}</span>
            </div>
          </div>
        </div>

        <!-- Informações do Inquilino -->
        <div class="detail-card">
          <div class="card-header">
            <h2>Inquilino</h2>
            <router-link
              v-if="aluguel.inquilinoId"
              :to="`/inquilinos/${aluguel.inquilinoId}`"
              class="btn-link"
            >
              Ver Detalhes
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
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </router-link>
          </div>
          <div class="info-grid">
            <div class="info-item">
              <span class="label">Nome:</span>
              <span class="value">{{ aluguel.inquilino?.nome || '-' }}</span>
            </div>
            <div class="info-item">
              <span class="label">CPF:</span>
              <span class="value">{{ aluguel.inquilino?.cpf || '-' }}</span>
            </div>
            <div class="info-item">
              <span class="label">Telefone:</span>
              <span class="value">{{ aluguel.inquilino?.telefone || '-' }}</span>
            </div>
            <div class="info-item">
              <span class="label">E-mail:</span>
              <span class="value">{{ aluguel.inquilino?.email || '-' }}</span>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Modal de Edição -->
    <AluguelModal
      :is-open="showModal"
      :aluguel="aluguel"
      @close="closeModal"
      @success="handleModalSuccess"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Navbar from '@/components/Navbar.vue'
import AluguelModal from '@/components/AluguelModal.vue'
import { aluguelAPI } from '@/api/services'

const route = useRoute()
const router = useRouter()

const loading = ref(true)
const aluguel = ref(null)
const showModal = ref(false)

const loadAluguel = async () => {
  try {
    loading.value = true
    const response = await aluguelAPI.getById(route.params.id)

    if (response.data.success) {
      aluguel.value = response.data.data
    } else {
      alert('Aluguel não encontrado')
      router.push('/alugueis')
    }
  } catch (error) {
    console.error('Erro ao carregar aluguel:', error)
    alert('Erro ao carregar aluguel')
    router.push('/alugueis')
  } finally {
    loading.value = false
  }
}

const formatCurrency = (value) => {
  if (!value) return 'R$ 0,00'
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('pt-BR')
}

const calcularDuracao = (inicio, fim) => {
  if (!inicio || !fim) return '-'
  const dataInicio = new Date(inicio)
  const dataFim = new Date(fim)
  const diffTime = Math.abs(dataFim - dataInicio)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  const meses = Math.floor(diffDays / 30)
  const dias = diffDays % 30

  if (meses > 0 && dias > 0) {
    return `${meses} ${meses === 1 ? 'mês' : 'meses'} e ${dias} ${dias === 1 ? 'dia' : 'dias'}`
  } else if (meses > 0) {
    return `${meses} ${meses === 1 ? 'mês' : 'meses'}`
  } else {
    return `${dias} ${dias === 1 ? 'dia' : 'dias'}`
  }
}

const getStatusClass = (status) => {
  const statusMap = {
    Ativo: 'status-active',
    'Em Andamento': 'status-active',
    EmAndamento: 'status-active',
    Pendente: 'status-pending',
    'Pendente de Pagamento': 'status-pending',
    PendenteDePagamento: 'status-pending',
    'Pendente de Entrada': 'status-pending',
    PendenteDeEntrada: 'status-pending',
    Pausado: 'status-pending',
    Cancelado: 'status-cancelled',
    Finalizado: 'status-finished',
  }
  return statusMap[status] || 'status-default'
}

const goBack = () => {
  router.push('/alugueis')
}

const openEditModal = () => {
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const handleModalSuccess = () => {
  loadAluguel()
}

const handleDelete = async () => {
  if (!confirm('Tem certeza que deseja excluir este aluguel?')) return

  try {
    const response = await aluguelAPI.delete(route.params.id)
    if (response.data.success) {
      alert('Aluguel excluído com sucesso!')
      router.push('/alugueis')
    }
  } catch (error) {
    console.error('Erro ao excluir:', error)
    alert('Erro ao excluir aluguel')
  }
}

onMounted(() => {
  loadAluguel()
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
  to {
    transform: rotate(360deg);
  }
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
  background-color: #ede9fe;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.header-icon svg {
  width: 2rem;
  height: 2rem;
  color: #8b5cf6;
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
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
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

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.card-header h2 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.detail-card h2 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 1.5rem 0;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.btn-link {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  color: #2563eb;
  font-size: 0.875rem;
  font-weight: 500;
  text-decoration: none;
  transition: color 0.2s;
}

.btn-link:hover {
  color: #1d4ed8;
}

.btn-link svg {
  width: 1rem;
  height: 1rem;
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

.info-item.full-width {
  grid-column: 1 / -1;
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

.value-highlight {
  font-size: 1.5rem;
  font-weight: bold;
  color: #2563eb;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  display: inline-block;
  width: fit-content;
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

@media (max-width: 768px) {
  .detail-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .header-actions {
    width: 100%;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
}
</style>

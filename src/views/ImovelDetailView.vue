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

      <div v-else-if="imovel">
        <!-- Cabeçalho -->
        <div class="detail-header">
          <div class="header-icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </div>
          <div class="header-info">
            <h1>{{ imovel.nome }}</h1>
            <span class="badge">{{ imovel.tipoImovel }}</span>
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

        <!-- Informações do Imóvel -->
        <div class="detail-card">
          <h2>Informações</h2>
          <div class="info-grid">
            <div class="info-item">
              <span class="label">Endereço:</span>
              <span class="value">{{ imovel.endereco }}</span>
            </div>
            <div class="info-item">
              <span class="label">Tipo:</span>
              <span class="value">{{ imovel.tipoImovel }}</span>
            </div>
            <div v-if="imovel.descricao" class="info-item full-width">
              <span class="label">Descrição:</span>
              <span class="value">{{ imovel.descricao }}</span>
            </div>
          </div>
        </div>

        <!-- Verificar Disponibilidade -->
        <div class="detail-card">
          <h2>Verificar Disponibilidade</h2>
          <p class="card-subtitle">Consulte se o imóvel está disponível para aluguel em uma data específica</p>
          
          <div class="disponibilidade-form">
            <div class="form-group">
              <label for="dataVerificacao">Selecione uma data:</label>
              <input
                id="dataVerificacao"
                v-model="dataVerificacao"
                type="date"
                :min="getMinDate()"
                class="date-input"
              />
            </div>
            
            <button 
              @click="verificarDisponibilidade" 
              :disabled="!dataVerificacao || loadingDisponibilidade"
              class="btn-verificar"
            >
              <span v-if="loadingDisponibilidade" class="loading-spinner-small"></span>
              {{ loadingDisponibilidade ? 'Verificando...' : 'Verificar Disponibilidade' }}
            </button>
          </div>

          <!-- Resultado da Verificação -->
          <div v-if="resultadoDisponibilidade" class="resultado-disponibilidade">
            <div v-if="resultadoDisponibilidade.estaDisponivel" class="resultado-card disponivel">
              <div class="resultado-icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div class="resultado-info">
                <h3>Imóvel Disponível!</h3>
                <p>{{ resultadoDisponibilidade.mensagem }}</p>
              </div>
            </div>

            <div v-else class="resultado-card indisponivel">
              <div class="resultado-icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div class="resultado-info">
                <h3>Imóvel Indisponível</h3>
                <p>{{ resultadoDisponibilidade.mensagem }}</p>
                <p v-if="resultadoDisponibilidade.aluguelAtivo" class="info-aluguel">
                  Período do aluguel: {{ formatDate(resultadoDisponibilidade.aluguelAtivo.dataInicio) }} 
                  até {{ formatDate(resultadoDisponibilidade.aluguelAtivo.dataFim) }}
                </p>
              </div>
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
            <p>Nenhum aluguel encontrado para este imóvel</p>
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
                  <span class="label">Inquilino:</span>
                  <span class="value">{{ aluguel.inquilino?.nome || `ID: ${aluguel.inquilinoId}` }}</span>
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
    <ImovelModal 
      :is-open="showModal" 
      :imovel="imovel"
      @close="closeModal"
      @success="handleModalSuccess"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Navbar from '@/components/Navbar.vue'
import ImovelModal from '@/components/ImovelModal.vue'
import { imovelAPI, aluguelAPI } from '@/api/services'

const route = useRoute()
const router = useRouter()

const loading = ref(true)
const loadingAlugueis = ref(true)
const loadingDisponibilidade = ref(false)
const imovel = ref(null)
const alugueis = ref([])
const showModal = ref(false)
const dataVerificacao = ref('')
const resultadoDisponibilidade = ref(null)

const loadImovel = async () => {
  try {
    loading.value = true
    const response = await imovelAPI.getById(route.params.id)
    
    if (response.data.success) {
      imovel.value = response.data.data
    } else {
      alert('Imóvel não encontrado')
      router.push('/imoveis')
    }
  } catch (error) {
    console.error('Erro ao carregar imóvel:', error)
    alert('Erro ao carregar imóvel')
    router.push('/imoveis')
  } finally {
    loading.value = false
  }
}

const loadAlugueis = async () => {
  try {
    loadingAlugueis.value = true
    const response = await aluguelAPI.getByImovelId(route.params.id, false)
    
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
  router.push('/imoveis')
}

const openEditModal = () => {
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const handleModalSuccess = () => {
  loadImovel()
}

const handleDelete = async () => {
  if (!confirm('Tem certeza que deseja excluir este imóvel?')) return

  try {
    const response = await imovelAPI.delete(route.params.id)
    if (response.data.success) {
      alert('Imóvel excluído com sucesso!')
      router.push('/imoveis')
    }
  } catch (error) {
    console.error('Erro ao excluir:', error)
    alert('Erro ao excluir imóvel')
  }
}

const getMinDate = () => {
  const today = new Date()
  return today.toISOString().split('T')[0]
}

const verificarDisponibilidade = async () => {
  if (!dataVerificacao.value) {
    alert('Por favor, selecione uma data')
    return
  }

  try {
    loadingDisponibilidade.value = true
    resultadoDisponibilidade.value = null
    
    const response = await imovelAPI.checkDisponibilidade(
      route.params.id, 
      dataVerificacao.value
    )

    if (response.data.success) {
      resultadoDisponibilidade.value = response.data.data
    } else {
      alert(response.data.message || 'Erro ao verificar disponibilidade')
    }
  } catch (error) {
    console.error('❌ Erro ao verificar disponibilidade:', error)
    alert(error.response?.data?.message || 'Erro ao verificar disponibilidade')
  } finally {
    loadingDisponibilidade.value = false
  }
}

onMounted(() => {
  loadImovel()
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
  border-radius: 0.75rem;
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
  background-color: #dbeafe;
  color: #2563eb;
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

.card-subtitle {
  color: #6b7280;
  font-size: 0.875rem;
  margin-bottom: 1.5rem;
}

.disponibilidade-form {
  display: flex;
  gap: 1rem;
  align-items: flex-end;
  margin-bottom: 1.5rem;
}

.form-group {
  flex: 1;
  max-width: 300px;
}

.form-group label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
}

.date-input {
  width: 100%;
  padding: 0.625rem 0.875rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  outline: none;
  transition: border-color 0.2s;
}

.date-input:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.btn-verificar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #2563eb;
  color: white;
  padding: 0.625rem 1.5rem;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  white-space: nowrap;
}

.btn-verificar:hover:not(:disabled) {
  background-color: #1d4ed8;
}

.btn-verificar:disabled {
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

.resultado-disponibilidade {
  margin-top: 1.5rem;
}

.resultado-card {
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  border-radius: 0.5rem;
  border: 2px solid;
}

.resultado-card.disponivel {
  background-color: #f0fdf4;
  border-color: #86efac;
}

.resultado-card.indisponivel {
  background-color: #fef2f2;
  border-color: #fca5a5;
}

.resultado-icon {
  flex-shrink: 0;
  width: 3rem;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.disponivel .resultado-icon {
  background-color: #dcfce7;
}

.disponivel .resultado-icon svg {
  width: 2rem;
  height: 2rem;
  color: #16a34a;
}

.indisponivel .resultado-icon {
  background-color: #fee2e2;
}

.indisponivel .resultado-icon svg {
  width: 2rem;
  height: 2rem;
  color: #dc2626;
}

.resultado-info {
  flex: 1;
}

.resultado-info h3 {
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
}

.disponivel .resultado-info h3 {
  color: #16a34a;
}

.indisponivel .resultado-info h3 {
  color: #dc2626;
}

.resultado-info p {
  color: #374151;
  font-size: 0.875rem;
  margin: 0;
  line-height: 1.5;
}

.info-aluguel {
  margin-top: 0.5rem;
  padding-top: 0.5rem;
  border-top: 1px solid #fca5a5;
  font-weight: 500;
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

  .disponibilidade-form {
    flex-direction: column;
    align-items: stretch;
  }

  .form-group {
    max-width: 100%;
  }

  .btn-verificar {
    width: 100%;
    justify-content: center;
  }
}
</style>
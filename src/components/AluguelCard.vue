<template>
  <div class="item-card">
    <div class="item-header">
      <div class="contract-icon">
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
        <h3>Contrato #{{ aluguel.id }}</h3>
        <span :class="['status-badge', getStatusClass(aluguel.status)]">
          {{ aluguel.statusDescricao }}
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
      <button @click="$emit('view', aluguel.id)" class="btn-view">
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
      <button @click="$emit('edit', aluguel)" class="btn-edit">
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
      <button @click="$emit('delete', aluguel.id)" class="btn-delete">
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
</template>

<script setup>
defineProps({
  aluguel: Object,
})

defineEmits(['view', 'edit', 'delete'])

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
</script>

<style scoped>
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
</style>

<template>
  <div class="active-filters">
    <span v-if="filters.periodoInicio && filters.periodoFim" class="filter-badge">
      📅 {{ formatDate(filters.periodoInicio) }} - {{ formatDate(filters.periodoFim) }}
      <button @click="$emit('clear-date')">×</button>
    </span>

    <span v-if="filters.faixaValor && filters.faixaValor !== 'custom'" class="filter-badge">
      💰 {{ getValorLabel(filters.faixaValor) }}
      <button @click="$emit('clear-valor')">×</button>
    </span>

    <span
      v-if="filters.faixaValor === 'custom' && (filters.valorMin || filters.valorMax)"
      class="filter-badge"
    >
      💰 R$ {{ filters.valorMin || 0 }} - R$ {{ filters.valorMax || '∞' }}
      <button @click="$emit('clear-valor')">×</button>
    </span>

    <span v-for="status in filters.status" :key="status" class="filter-badge">
      🏷️ {{ getStatusLabel(status) }}
      <button @click="$emit('remove-status', status)">×</button>
    </span>

    <span v-for="metodo in filters.metodosPagamento" :key="metodo" class="filter-badge">
      💳 {{ getMetodoLabel(metodo) }}
      <button @click="$emit('remove-metodo', metodo)">×</button>
    </span>
  </div>
</template>

<script setup>
const props = defineProps({
  filters: Object,
  statusOptions: Array,
  metodosPagamentoOptions: Array,
})

defineEmits(['clear-date', 'clear-valor', 'remove-status', 'remove-metodo'])

const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('pt-BR')
}

const getValorLabel = (faixa) => {
  const labels = {
    '0-500': 'Até R$ 500',
    '500-1000': 'R$ 500 - R$ 1.000',
    '1000-1500': 'R$ 1.000 - R$ 1.500',
    '1500-2000': 'R$ 1.500 - R$ 2.000',
    '2000-3000': 'R$ 2.000 - R$ 3.000',
    '3000+': 'Acima de R$ 3.000',
  }
  return labels[faixa] || faixa
}

const getStatusLabel = (status) => {
  const found = props.statusOptions.find((s) => s.value === status)
  return found ? found.label : status
}

const getMetodoLabel = (metodo) => {
  const found = props.metodosPagamentoOptions.find((m) => m.value === metodo)
  return found ? found.label : metodo
}
</script>

<style scoped>
.active-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.filter-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #eff6ff;
  color: #1e40af;
  padding: 0.375rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
}

.filter-badge button {
  background: none;
  border: none;
  color: #1e40af;
  font-size: 1.25rem;
  line-height: 1;
  cursor: pointer;
  padding: 0;
  margin-left: 0.25rem;
  transition: color 0.2s;
}

.filter-badge button:hover {
  color: #1e3a8a;
}
</style>

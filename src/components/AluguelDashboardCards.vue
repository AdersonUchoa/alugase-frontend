<template>
  <div class="dashboard-cards">
    <DashboardCard
      v-for="card in cards"
      :key="card.key"
      :icon="card.icon"
      :title="card.title"
      :value="counts[card.key] || 0"
      :color="card.color"
    />
  </div>
</template>

<script setup>
import DashboardCard from './DashboardCard.vue'

defineProps({
  counts: {
    type: Object,
    default: () => ({}),
  },
})

const cards = [
  {
    key: 'totalAlugueis',
    title: 'Total de Aluguéis',
    color: 'purple',
    icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
  },
  {
    key: 'alugueisEmAndamento',
    title: 'Em Andamento',
    color: 'green',
    icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
  },
  {
    key: 'alugueisConcluídos',
    title: 'Concluídos',
    color: 'blue',
    icon: 'M5 13l4 4L19 7',
  },
  {
    key: 'alugueisCancelados',
    title: 'Cancelados',
    color: 'red',
    icon: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z',
  },
]
</script>

<style scoped>
.dashboard-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}
</style>
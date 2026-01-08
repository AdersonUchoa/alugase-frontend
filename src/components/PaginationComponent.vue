<template>
  <div class="pagination-component">
    <button @click="$emit('change', currentPage - 1)" :disabled="currentPage === 1" class="btn-page">
      Anterior
    </button>
    <span class="page-info">Página {{ currentPage }} de {{ totalPages }}</span>
    <button @click="$emit('change', currentPage + 1)" :disabled="currentPage === totalPages" class="btn-page">
      Próxima
    </button>
  </div>
</template>

<script setup>
defineProps({
  currentPage: Number,
  totalPages: Number,
})

defineEmits(['change'])
</script>

<style scoped>
.pagination-component {
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
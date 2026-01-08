<template>
  <transition name="slide-down">
    <div v-if="show" class="filters-panel">
      <div class="filters-header">
        <h3>Filtrar Aluguéis</h3>
        <button @click="$emit('clear')" class="btn-clear-filters">
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          Limpar Filtros
        </button>
      </div>

      <div class="filters-grid">
        <div class="filter-column">
          <div class="filter-group">
            <label>Período do Aluguel</label>
            <div class="date-inputs">
              <input
                :value="modelValue.periodoInicio"
                @input="update('periodoInicio', $event.target.value)"
                type="date"
                placeholder="Data início"
              />
              <span class="date-separator">até</span>
              <input
                :value="modelValue.periodoFim"
                @input="update('periodoFim', $event.target.value)"
                type="date"
                placeholder="Data fim"
              />
            </div>
          </div>

          <div class="filter-group">
            <label>Faixa de Valor</label>
            <select
              :value="modelValue.faixaValor"
              @change="update('faixaValor', $event.target.value)"
            >
              <option value="">Todos os valores</option>
              <option value="0-500">Até R$ 500</option>
              <option value="500-1000">R$ 500 - R$ 1.000</option>
              <option value="1000-1500">R$ 1.000 - R$ 1.500</option>
              <option value="1500-2000">R$ 1.500 - R$ 2.000</option>
              <option value="2000-3000">R$ 2.000 - R$ 3.000</option>
              <option value="3000+">Acima de R$ 3.000</option>
            </select>
          </div>
        </div>

        <div class="filter-column status-column">
          <div class="filter-group">
            <label>Status</label>
            <div class="checkbox-group">
              <label v-for="status in statusOptions" :key="status.value" class="checkbox-label">
                <input
                  type="checkbox"
                  :value="status.value"
                  :checked="modelValue.status.includes(status.value)"
                  @change="toggleArrayItem('status', status.value)"
                />
                <span>{{ status.label }}</span>
              </label>
            </div>
          </div>
        </div>

        <div class="filter-column">
          <div class="filter-group">
            <label>Método de Pagamento</label>
            <div class="checkbox-group">
              <label
                v-for="metodo in metodosPagamentoOptions"
                :key="metodo.value"
                class="checkbox-label"
              >
                <input
                  type="checkbox"
                  :value="metodo.value"
                  :checked="modelValue.metodosPagamento.includes(metodo.value)"
                  @change="toggleArrayItem('metodosPagamento', metodo.value)"
                />
                <span>{{ metodo.label }}</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
const props = defineProps({
  show: Boolean,
  modelValue: Object,
  statusOptions: Array,
  metodosPagamentoOptions: Array,
})

const emit = defineEmits(['update:modelValue', 'clear', 'apply'])

const update = (key, value) => {
  emit('update:modelValue', { ...props.modelValue, [key]: value })
  emit('apply')
}

const toggleArrayItem = (key, value) => {
  const array = [...props.modelValue[key]]
  const index = array.indexOf(value)
  if (index > -1) {
    array.splice(index, 1)
  } else {
    array.push(value)
  }
  emit('update:modelValue', { ...props.modelValue, [key]: array })
  emit('apply')
}
</script>

<style scoped>
.filters-panel {
  background: white;
  border-radius: 0.5rem;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.filters-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.filters-header h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.btn-clear-filters {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #fee2e2;
  color: #dc2626;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.status-column {
  margin-left: 2rem;
}

.btn-clear-filters:hover {
  background-color: #fecaca;
}

.btn-clear-filters svg {
  width: 1rem;
  height: 1rem;
}

.filters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.filter-column {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-group label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.filter-group select,
.filter-group input[type='date'],
.filter-group input[type='number'] {
  padding: 0.625rem 0.875rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  outline: none;
  transition: border-color 0.2s;
}

.filter-group select:focus,
.filter-group input:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.date-inputs,
.custom-value-inputs {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.date-separator {
  color: #6b7280;
  font-size: 0.875rem;
  font-weight: 500;
}

.custom-value-inputs {
  margin-top: 0.5rem;
}

.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #374151;
  cursor: pointer;
}

.checkbox-label input[type='checkbox'] {
  width: 1rem;
  height: 1rem;
  cursor: pointer;
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

@media (max-width: 768px) {
  .filters-grid {
    grid-template-columns: 1fr;
  }
}
</style>

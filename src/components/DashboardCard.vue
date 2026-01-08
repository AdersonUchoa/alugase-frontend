<template>
  <div class="dashboard-card">
    <div :class="['card-icon', color]">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="icon" />
      </svg>
    </div>
    <div class="card-content">
      <h3>{{ title }}</h3>
      <p class="card-number">{{ value }}</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  icon: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  value: {
    type: Number,
    default: 0,
  },
  color: {
    type: String,
    required: true,
  },
})
</script>

<style scoped>
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

.card-icon.purple {
  background-color: #8b5cf6;
}

.card-icon.green {
  background-color: #10b981;
}

.card-icon.blue {
  background-color: #3b82f6;
}

.card-icon.red {
  background-color: #ef4444;
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
</style>
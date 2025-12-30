<template>
  <div class="page">
    <Navbar />

    <main class="content">
      <div class="page-header">
        <h1>Dashboard</h1>
        <p>Visão geral do sistema de gestão de aluguéis</p>
      </div>

      <div v-if="loading" class="loading">
        <div class="spinner"></div>
        <p>Carregando dados...</p>
      </div>

      <div v-else class="dashboard-cards">
        <!-- Card Imóveis -->
        <div class="card">
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
            <h3>Imóveis</h3>
            <p class="card-number">{{ imovelCounts.total || 0 }}</p>
            <div class="card-stats">
              <span class="stat-item">Ativos: {{ imovelCounts.ativos || 0 }}</span>
              <span class="stat-item">Disponíveis: {{ imovelCounts.disponiveis || 0 }}</span>
            </div>
          </div>
        </div>

        <!-- Card Inquilinos -->
        <div class="card">
          <div class="card-icon green">
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
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <div class="card-content">
            <h3>Inquilinos</h3>
            <p class="card-number">{{ inquilinoCounts.total || 0 }}</p>
            <div class="card-stats">
              <span class="stat-item">Ativos: {{ inquilinoCounts.ativos || 0 }}</span>
              <span class="stat-item">Com aluguel: {{ inquilinoCounts.comAluguel || 0 }}</span>
            </div>
          </div>
        </div>

        <!-- Card Aluguéis -->
        <div class="card">
          <div class="card-icon purple">
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
          <div class="card-content">
            <h3>Aluguéis</h3>
            <p class="card-number">{{ aluguelCounts.total || 0 }}</p>
            <div class="card-stats">
              <span class="stat-item">Ativos: {{ aluguelCounts.ativos || 0 }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Links Rápidos -->
      <div class="quick-links">
        <h2>Acesso Rápido</h2>
        <div class="links-grid">
          <router-link to="/imoveis" class="link-card">
            <div class="link-icon">📋</div>
            <h3>Gerenciar Imóveis</h3>
            <p>Cadastrar e visualizar imóveis</p>
          </router-link>

          <router-link to="/inquilinos" class="link-card">
            <div class="link-icon">👥</div>
            <h3>Gerenciar Inquilinos</h3>
            <p>Cadastrar e visualizar inquilinos</p>
          </router-link>

          <router-link to="/alugueis" class="link-card">
            <div class="link-icon">📄</div>
            <h3>Gerenciar Aluguéis</h3>
            <p>Cadastrar e visualizar contratos</p>
          </router-link>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Navbar from '@/components/Navbar.vue'
import { imovelAPI, inquilinoAPI, aluguelAPI } from '@/api/services'

const loading = ref(true)
const imovelCounts = ref({})
const inquilinoCounts = ref({})
const aluguelCounts = ref({})

const loadDashboardData = async () => {
  try {
    loading.value = true

    const [imoveisRes, inquilinosRes, alugueisRes] = await Promise.all([
      imovelAPI.getDashboardCounts(),
      inquilinoAPI.getDashboardCounts(),
      aluguelAPI.getDashboardCounts(),
    ])

    if (imoveisRes.data.success) {
      imovelCounts.value = imoveisRes.data.data
    }

    if (inquilinosRes.data.success) {
      inquilinoCounts.value = inquilinosRes.data.data
    }

    if (alugueisRes.data.success) {
      aluguelCounts.value = alugueisRes.data.data
    }
  } catch (error) {
    console.error('❌ Erro ao carregar dashboard:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadDashboardData()
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

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
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

.dashboard-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.card {
  background: white;
  border-radius: 0.5rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  gap: 1rem;
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
.card-icon.green {
  background-color: #10b981;
}
.card-icon.purple {
  background-color: #8b5cf6;
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
  margin: 0 0 0.75rem 0;
}

.card-stats {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.stat-item {
  font-size: 0.875rem;
  color: #6b7280;
}

.quick-links {
  margin-top: 3rem;
}

.quick-links h2 {
  font-size: 1.5rem;
  font-weight: bold;
  color: #111827;
  margin-bottom: 1rem;
}

.links-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.link-card {
  background: white;
  border-radius: 0.5rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  text-decoration: none;
  transition: all 0.2s;
  display: block;
}

.link-card:hover {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.link-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.link-card h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 0.5rem 0;
}

.link-card p {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
}
</style>

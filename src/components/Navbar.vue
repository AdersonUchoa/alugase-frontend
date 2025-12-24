<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <nav class="navbar">
    <div class="navbar-content">
      <div class="navbar-brand">
        <div class="logo-icon">
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
        <h1>Aluga/SE</h1>
      </div>

      <div class="navbar-menu">
        <router-link to="/home" class="nav-link" active-class="active"> Dashboard </router-link>
        <router-link to="/imoveis" class="nav-link" active-class="active"> Imóveis </router-link>
        <router-link to="/inquilinos" class="nav-link" active-class="active">
          Inquilinos
        </router-link>
        <router-link to="/alugueis" class="nav-link" active-class="active"> Aluguéis </router-link>
      </div>

      <div class="navbar-user">
        <span class="user-name">{{ authStore.user?.login }}</span>
        <button @click="handleLogout" class="btn-logout">
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
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          Sair
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const handleLogout = () => {
  if (confirm('Deseja realmente sair?')) {
    authStore.logout()
  }
}
</script>

<style scoped>
.navbar {
  background: white;
  border-bottom: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.navbar-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
}

.navbar-brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.logo-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  background-color: #2563eb;
  border-radius: 0.5rem;
}

.logo-icon svg {
  width: 1.5rem;
  height: 1.5rem;
  color: white;
}

.navbar-brand h1 {
  font-size: 1.5rem;
  font-weight: bold;
  color: #2563eb;
  margin: 0;
}

.navbar-menu {
  display: flex;
  gap: 0.5rem;
}

.nav-link {
  padding: 0.5rem 1rem;
  color: #6b7280;
  text-decoration: none;
  border-radius: 0.375rem;
  font-weight: 500;
  transition: all 0.2s;
}

.nav-link:hover {
  background-color: #f3f4f6;
  color: #111827;
}

.nav-link.active {
  background-color: #dbeafe;
  color: #2563eb;
}

.navbar-user {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-name {
  color: #374151;
  font-weight: 500;
  font-size: 0.875rem;
}

.btn-logout {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #ef4444;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: background-color 0.2s;
}

.btn-logout svg {
  width: 1rem;
  height: 1rem;
}

.btn-logout:hover {
  background-color: #dc2626;
}

@media (max-width: 768px) {
  .navbar-content {
    padding: 0 1rem;
  }

  .navbar-menu {
    display: none;
  }

  .user-name {
    display: none;
  }
}
</style>

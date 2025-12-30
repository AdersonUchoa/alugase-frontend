import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import LoginView from '@/views/LoginView.vue'
import HomeView from '@/views/HomeView.vue'
import ImoveisView from '@/views/ImoveisView.vue'
import InquilinosView from '@/views/InquilinosView.vue'
import AlugueisView from '@/views/AlugueisView.vue'
import ImovelDetailView from '@/views/ImovelDetailView.vue'
import InquilinoDetailView from '@/views/InquilinoDetailView.vue'
import AluguelDetailView from '@/views/AluguelDetailView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { requiresGuest: true }
    },
    {
      path: '/home',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: true }
    },
    {
      path: '/imoveis',
      name: 'imoveis',
      component: ImoveisView,
      meta: { requiresAuth: true }
    },
    {
      path: '/imoveis/:id',
      name: 'imovel-detail',
      component: ImovelDetailView,
      meta: { requiresAuth: true }
    },
    {
      path: '/inquilinos',
      name: 'inquilinos',
      component: InquilinosView,
      meta: { requiresAuth: true }
    },
    {
      path: '/inquilinos/:id',
      name: 'inquilino-detail',
      component: InquilinoDetailView,
      meta: { requiresAuth: true }
    },
    {
      path: '/alugueis',
      name: 'alugueis',
      component: AlugueisView,
      meta: { requiresAuth: true }
    },
    {
      path: '/alugueis/:id',
      name: 'aluguel-detail',
      component: AluguelDetailView,
      meta: { requiresAuth: true }
    },
    {
      path: '/',
      redirect: '/home'
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  if (authStore.token && !authStore.isAuthenticated) {
    authStore.checkAuth()
  }

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next('/home')
  } else {
    next()
  }
})

export default router
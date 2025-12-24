import api from './auth'

// ==================== ENUMS ====================
export const enumsAPI = {
  getTiposImovel: () => api.get('/enums/tipos-imovel'),
  getMetodosPagamento: () => api.get('/enums/metodos-pagamento'),
  getStatusAluguel: () => api.get('/enums/status-aluguel'),
}

// ==================== IMÓVEIS ====================
export const imovelAPI = {
  getAll: (
    page = 1,
    limit = 10,
    includeInactive = false,
    includeAlugueis = false,
    search = null,
  ) => {
    const params = { page, limit, includeInactive, includeAlugueis }
    if (search) params.search = search
    return api.get('/imovel', { params })
  },

  getById: (id) => api.get(`/imovel/${id}`),

  getDashboardCounts: () => api.get('/imovel/dashboard/counts'),

  create: (data) => api.post('/imovel', data),

  update: (id, data) => api.put(`/imovel/${id}`, data),

  delete: (id) => api.delete(`/imovel/${id}`),

  checkDisponibilidade: (id, data) => api.post(`/imovel/${id}/verificar-disponibilidade`, { data }),
}

// ==================== INQUILINOS ====================
export const inquilinoAPI = {
  getAll: (
    page = 1,
    limit = 10,
    includeInactive = false,
    includeAlugueis = false,
    search = null,
  ) => {
    const params = { page, limit, includeInactive, includeAlugueis }
    if (search) params.search = search
    return api.get('/inquilino', { params })
  },

  getById: (id) => api.get(`/inquilino/${id}`),

  getDashboardCounts: () => api.get('/inquilino/dashboard/counts'),

  create: (data) => api.post('/inquilino', data),

  update: (id, data) => api.put(`/inquilino/${id}`, data),

  delete: (id) => api.delete(`/inquilino/${id}`),
}

// ==================== ALUGUÉIS ====================
export const aluguelAPI = {
  getAll: (
    page = 1,
    limit = 10,
    includeInactive = false,
    includeImoveis = false,
    includeInquilinos = false,
    search = null,
  ) => {
    const params = { page, limit, includeInactive, includeImoveis, includeInquilinos }
    if (search) params.search = search
    return api.get('/aluguel', { params })
  },

  getById: (id) => api.get(`/aluguel/${id}`),

  getByInquilinoId: (inquilinoId, includeInactive = false) =>
    api.get(`/aluguel/inquilino/${inquilinoId}`, { params: { includeInactive } }),

  getByImovelId: (imovelId, includeInactive = false) =>
    api.get(`/aluguel/imovel/${imovelId}`, { params: { includeInactive } }),

  getDashboardCounts: () => api.get('/aluguel/dashboard/counts'),

  create: (data) => api.post('/aluguel', data),

  update: (id, data) => api.put(`/aluguel/${id}`, data),

  delete: (id) => api.delete(`/aluguel/${id}`),
}

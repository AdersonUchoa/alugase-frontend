// composables/useAluguelFilters.js
import { ref, computed } from 'vue'

export function useAluguelFilters() {
  const filters = ref({
    periodoInicio: null,
    periodoFim: null,
    faixaValor: '',
    valorMin: null,
    valorMax: null,
    status: [],
    metodosPagamento: [],
  })

  const hasActiveFilters = computed(() => {
    return !!(
      filters.value.periodoInicio ||
      filters.value.periodoFim ||
      filters.value.faixaValor ||
      filters.value.valorMin ||
      filters.value.valorMax ||
      filters.value.status.length > 0 ||
      filters.value.metodosPagamento.length > 0
    )
  })

  const activeFiltersCount = computed(() => {
    let count = 0
    if (filters.value.periodoInicio && filters.value.periodoFim) count++
    if (filters.value.faixaValor) count++
    count += filters.value.status.length
    count += filters.value.metodosPagamento.length
    return count
  })

  const handleValorChange = (callback) => {
    const faixa = filters.value.faixaValor

    if (faixa === 'custom') {
      filters.value.valorMin = null
      filters.value.valorMax = null
      return
    }

    const faixas = {
      '': [null, null],
      '0-500': [0, 500],
      '500-1000': [500, 1000],
      '1000-1500': [1000, 1500],
      '1500-2000': [1500, 2000],
      '2000-3000': [2000, 3000],
      '3000+': [3000, null],
    }

    const [min, max] = faixas[faixa] || [null, null]
    filters.value.valorMin = min
    filters.value.valorMax = max

    if (callback) callback()
  }

  const clearFilters = () => {
    filters.value = {
      periodoInicio: null,
      periodoFim: null,
      faixaValor: '',
      valorMin: null,
      valorMax: null,
      status: [],
      metodosPagamento: [],
    }
  }

  const clearDateFilter = () => {
    filters.value.periodoInicio = null
    filters.value.periodoFim = null
  }

  const clearValorFilter = () => {
    filters.value.faixaValor = ''
    filters.value.valorMin = null
    filters.value.valorMax = null
  }

  const removeStatus = (status) => {
    filters.value.status = filters.value.status.filter((s) => s !== status)
  }

  const removeMetodo = (metodo) => {
    filters.value.metodosPagamento = filters.value.metodosPagamento.filter((m) => m !== metodo)
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

  const buildApiParams = (page, limit, searchTerm) => {
    return {
      page,
      limit,
      includeInactive: false,
      includeImoveis: true,
      includeInquilinos: true,
      search: searchTerm || null,
      periodoInicio: filters.value.periodoInicio || null,
      periodoFim: filters.value.periodoFim || null,
      valorMin: filters.value.valorMin || null,
      valorMax: filters.value.valorMax || null,
      status: filters.value.status.length > 0 ? filters.value.status : null,
      metodosPagamento:
        filters.value.metodosPagamento.length > 0 ? filters.value.metodosPagamento : null,
    }
  }

  return {
    filters,
    hasActiveFilters,
    activeFiltersCount,
    handleValorChange,
    clearFilters,
    clearDateFilter,
    clearValorFilter,
    removeStatus,
    removeMetodo,
    getValorLabel,
    buildApiParams,
  }
}
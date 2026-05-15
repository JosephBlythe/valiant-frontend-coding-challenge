import { computed } from 'vue'
import { useFetch } from '@vueuse/core'

const DEFAULT_BASE_URL =
  `${import.meta.env.VITE_API_HOST ?? 'http://localhost'}:${import.meta.env.VITE_API_PORT ?? '5001'}`

/**
 * Fetches all loan related option lists from the backend.
 * @param {string} [baseUrl] - API base URL (configurable for widget embedding)
 * @returns {{ loanPurposes, repaymentPeriods, loanTerms, loading, errors, isLoading }}
 */
export function useLoansAPI (baseUrl = DEFAULT_BASE_URL) {
  const {
    data: loanPurposes,
    isFetching: purposesLoading,
    error: purposesError,
  } = useFetch(`${baseUrl}/loan-purposes`).json()

  const {
    data: repaymentPeriods,
    isFetching: periodsLoading,
    error: periodsError,
  } = useFetch(`${baseUrl}/requested-repayment-periods`).json()

  const {
    data: loanTerms,
    isFetching: termsLoading,
    error: termsError,
  } = useFetch(`${baseUrl}/requested-term-months`).json()

  const loading = computed(() => ({
    purposes: purposesLoading.value,
    periods: periodsLoading.value,
    terms: termsLoading.value,
  }))

  const errors = computed(() => ({
    purposes: purposesError.value,
    periods: periodsError.value,
    terms: termsError.value,
  }))

  const isLoading = computed(
    () => Object.values(loading.value).some((status) => status === true)
  )

  return {
    loanPurposes,
    repaymentPeriods,
    loanTerms,
    loading,
    errors,
    isLoading,
  }
}

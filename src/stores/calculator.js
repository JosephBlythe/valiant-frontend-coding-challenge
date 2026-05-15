import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

/**
 * Calculator store using Pinia setup store pattern
 * Manages form state, API data, and calculation results
 * @returns {object} Store interface with state, actions, and computed
 */
export const useCalculatorStore = defineStore('calculator', () => {
  // ============ STATE ============

  /**
   * Form data - User inputs for loan calculation
   */
  const formData = ref({
    loanAmount: 1000,
    loanPurpose: null,
    repaymentPeriod: null,
    loanTerm: null,
  })

  /**
   * Calculation results
   */
  const results = ref({
    paymentPerPeriod: null,
    totalPayment: null,
  })

  /**
   * API data - Fetched from backend
   */
  const apiData = ref({
    loanPurposes: [],
    repaymentPeriods: [],
    loanTerms: [],
  })

  /**
   * Loading states for each API endpoint
   */
  const loading = ref({
    purposes: false,
    periods: false,
    terms: false,
  })

  /**
   * Error states for each API endpoint
   */
  const errors = ref({
    purposes: null,
    periods: null,
    terms: null,
  })

  /**
   * Form validation errors
   */
  const validationErrors = ref({
    loanAmount: null,
    loanPurpose: null,
    repaymentPeriod: null,
    loanTerm: null,
  })

  // ============ COMPUTED ============

  /**
   * Check if any API is currently loading
   * @returns {boolean} True if any endpoint is loading
   */
  const isLoading = computed(() => {
    return loading.value.purposes || loading.value.periods || loading.value.terms
  })

  /**
   * Check if all required form fields are filled
   * @returns {boolean} True if all fields have values
   */
  const isFormComplete = computed(() => {
    const { loanAmount, loanPurpose, repaymentPeriod, loanTerm } = formData.value
    return (
      loanAmount !== null &&
      loanPurpose !== null &&
      repaymentPeriod !== null &&
      loanTerm !== null
    )
  })

  /**
   * Check if form has any validation errors
   * @returns {boolean} True if any field has validation error
   */
  const hasValidationErrors = computed(() => {
    const { loanAmount, loanPurpose, repaymentPeriod, loanTerm } = validationErrors.value
    return !!(loanAmount || loanPurpose || repaymentPeriod || loanTerm)
  })

  /**
   * Check if API had any errors
   * @returns {boolean} True if any endpoint had error
   */
  const hasApiErrors = computed(() => {
    return !!(errors.value.purposes || errors.value.periods || errors.value.terms)
  })

  /**
   * Get selected loan purpose object with annual rate
   * @returns {object|null} Purpose object or null if not selected
   */
  const selectedPurpose = computed(() => {
    if (!formData.value.loanPurpose) return null
    return apiData.value.loanPurposes.find(
      (p) => p.value === formData.value.loanPurpose
    ) || null
  })

  // ============ ACTIONS ============

  /**
   * Update form data with validation state cleanup
   * @param {object} updates - Fields to update (can be partial)
   */
  const updateFormData = (updates) => {
    formData.value = { ...formData.value, ...updates }
    // Clear validation errors for updated fields
    Object.keys(updates).forEach((key) => {
      if (key in validationErrors.value) {
        validationErrors.value[key] = null
      }
    })
  }

  /**
   * Update a single form field
   * @param {string} field - Field name to update
   * @param {*} value - New value
   */
  const updateField = (field, value) => {
    if (field in formData.value) {
      formData.value[field] = value
      validationErrors.value[field] = null
    }
  }

  /**
   * Set validation errors
   * @param {object} errors - Errors object with field names as keys
   */
  const setValidationErrors = (errors) => {
    validationErrors.value = { ...validationErrors.value, ...errors }
  }

  /**
   * Clear all validation errors
   */
  const clearValidationErrors = () => {
    validationErrors.value = {
      loanAmount: null,
      loanPurpose: null,
      repaymentPeriod: null,
      loanTerm: null,
    }
  }

  /**
   * Update calculation results
   * @param {object} newResults - Results object with paymentPerPeriod and totalPayment
   */
  const updateResults = (newResults) => {
    results.value = { ...results.value, ...newResults }
  }

  /**
   * Set loan purposes from API
   * @param {array} purposes - Array of purpose objects
   */
  const setLoanPurposes = (purposes) => {
    apiData.value.loanPurposes = purposes
    errors.value.purposes = null
  }

  /**
   * Set repayment periods from API
   * @param {array} periods - Array of period options
   */
  const setRepaymentPeriods = (periods) => {
    apiData.value.repaymentPeriods = periods
    errors.value.periods = null
  }

  /**
   * Set loan terms from API
   * @param {array} terms - Array of term options
   */
  const setLoanTerms = (terms) => {
    apiData.value.loanTerms = terms
    errors.value.terms = null
  }

  /**
   * Set loading state for a specific endpoint
   * @param {string} endpoint - Which endpoint ('purposes', 'periods', 'terms')
   * @param {boolean} isLoading - Loading state
   */
  const setLoading = (endpoint, isLoading) => {
    if (endpoint in loading.value) {
      loading.value[endpoint] = isLoading
    }
  }

  /**
   * Set error for a specific endpoint
   * @param {string} endpoint - Which endpoint ('purposes', 'periods', 'terms')
   * @param {string|null} error - Error message or null
   */
  const setError = (endpoint, error) => {
    if (endpoint in errors.value) {
      errors.value[endpoint] = error
    }
  }

  /**
   * Reset entire store to initial state
   */
  const reset = () => {
    formData.value = {
      loanAmount: 1000,
      loanPurpose: null,
      repaymentPeriod: null,
      loanTerm: null,
    }
    results.value = {
      paymentPerPeriod: null,
      totalPayment: null,
    }
    validationErrors.value = {
      loanAmount: null,
      loanPurpose: null,
      repaymentPeriod: null,
      loanTerm: null,
    }
  }

  /**
   * Reset only form data (keep API data and results)
   */
  const resetForm = () => {
    formData.value = {
      loanAmount: 1000,
      loanPurpose: null,
      repaymentPeriod: null,
      loanTerm: null,
    }
    validationErrors.value = {
      loanAmount: null,
      loanPurpose: null,
      repaymentPeriod: null,
      loanTerm: null,
    }
  }

  // ============ PUBLIC INTERFACE ============

  return {
    // State
    formData,
    results,
    apiData,
    loading,
    errors,
    validationErrors,
    // Computed
    isLoading,
    isFormComplete,
    hasValidationErrors,
    hasApiErrors,
    selectedPurpose,
    // Actions
    updateFormData,
    updateField,
    setValidationErrors,
    clearValidationErrors,
    updateResults,
    setLoanPurposes,
    setRepaymentPeriods,
    setLoanTerms,
    setLoading,
    setError,
    reset,
    resetForm,
  }
})

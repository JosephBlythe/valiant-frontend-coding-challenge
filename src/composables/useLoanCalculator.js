import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useCalculatorStore } from '@/stores/calculator'
import { useLoansAPI } from '@/composables/useLoansAPI'
import { useCalculateRepayment } from '@/composables/useCalculateRepayment'
import { useFormValidation } from '@/composables/useFormValidation'

/**
 * Orchestrates the full loan calculator workflow.
 * All derived state (defaults, results) is purely computed — no watchers needed.
 * @param {string} [baseUrl] - API base URL (configurable for widget embedding)
 * @returns {object} Combined reactive state and actions
 */
// TODO: Do we need custom baseURL should be in dotenv
export function useLoanCalculator (baseUrl = 'http://localhost:5001') {
  const store = useCalculatorStore()
  const { formData } = storeToRefs(store)

  const { loanPurposes, repaymentPeriods, loanTerms, loading, errors, isLoading } =
    useLoansAPI(baseUrl)
  const { calculate } = useCalculateRepayment()
  const { validationErrors, validateField, validateAll, clearErrors } = useFormValidation()

  // Fall back to the first API option until the user makes an explicit selection
  const effectivePurpose = computed(() =>
    formData.value.loanPurpose ?? loanPurposes.value?.[0]?.value ?? null
  )
  const effectivePeriod = computed(() =>
    formData.value.repaymentPeriod ?? repaymentPeriods.value?.[0]?.value ?? null
  )
  const effectiveTerm = computed(() =>
    formData.value.loanTerm ?? loanTerms.value?.[0]?.value ?? null
  )

  /** Unified form view with defaults applied — this is what components bind to */
  const effectiveFormData = computed(() => ({
    loanAmount: formData.value.loanAmount,
    loanPurpose: effectivePurpose.value,
    repaymentPeriod: effectivePeriod.value,
    loanTerm: effectiveTerm.value,
  }))

  const apiData = computed(() => ({
    loanPurposes: loanPurposes.value ?? [],
    repaymentPeriods: repaymentPeriods.value ?? [],
    loanTerms: loanTerms.value ?? [],
  }))

  const isFormComplete = computed(() => {
    const { loanAmount, loanPurpose, repaymentPeriod, loanTerm } = effectiveFormData.value
    return loanAmount !== null && loanPurpose !== null && repaymentPeriod !== null && loanTerm !== null
  })

  const selectedPurpose = computed(() =>
    loanPurposes.value?.find((p) => p.value === effectivePurpose.value) ?? null
  )

  const hasFormErrors = computed(() => {
    const e = validationErrors.value
    return !!(e.loanAmount || e.loanPurpose || e.repaymentPeriod || e.loanTerm)
  })

  /** Results are purely derived — recalculation is automatic */
  const results = computed(() => {
    if (!isFormComplete.value || hasFormErrors.value) {
      return { paymentPerPeriod: null, totalPayment: null }
    }
    const purpose = selectedPurpose.value
    if (!purpose) return { paymentPerPeriod: null, totalPayment: null }
    return calculate({
      annualRate: purpose.annualRate,
      loanAmount: effectiveFormData.value.loanAmount,
      repaymentPeriod: effectiveFormData.value.repaymentPeriod,
      loanTerm: effectiveFormData.value.loanTerm,
    })
  })

  /**
   * Update a single form field and validate it.
   * Recalculation is automatic via the results computed.
   * @param {string} field - Field name
   * @param {*} value - New value
   */
  const updateField = (field, value) => {
    store.updateField(field, value)
    validateField(field, value)
  }

  /**
   * Validate the entire effective form.
   * @returns {{ valid: boolean, data: object|null, errors: object|null }}
   */
  const submitForm = () => validateAll(effectiveFormData.value)

  return {
    formData: effectiveFormData,
    results,
    apiData,
    loading,
    errors,
    validationErrors,
    isLoading,
    isFormComplete,
    hasValidationErrors: hasFormErrors,
    updateField,
    submitForm,
    clearErrors,
  }
}

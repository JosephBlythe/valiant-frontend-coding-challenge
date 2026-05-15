import { ref, computed } from 'vue'
import { useLoansAPI } from '@/composables/useLoansAPI'
import { useCalculateRepayment } from '@/composables/useCalculateRepayment'
import { useFormValidation } from '@/composables/useFormValidation'

// TODO: baseUrl should come from dotenv
export function useLoanCalculator (baseUrl = 'http://localhost:5001') {
  const formData = ref({
    loanAmount: 1000,
    loanPurpose: null,
    repaymentPeriod: null,
    loanTerm: null,
  })

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

  const updateField = (field, value) => {
    if (field in formData.value) {
      formData.value[field] = value
    }
    validateField(field, value)
  }

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

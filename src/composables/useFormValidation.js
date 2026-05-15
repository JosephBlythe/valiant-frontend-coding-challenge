import { ref } from 'vue'
import {
  validateFormInput,
  validateLoanAmount,
  validateLoanPurpose,
  validateRepaymentPeriod,
  validateLoanTerm,
} from '@/schemas/calculator'

const FIELD_VALIDATORS = {
  loanAmount: validateLoanAmount,
  loanPurpose: validateLoanPurpose,
  repaymentPeriod: validateRepaymentPeriod,
  loanTerm: validateLoanTerm,
}

/**
 * Provides field-level and form-level validation backed by Zod schemas.
 * @returns {{ validationErrors, isValid, validateField, validateAll, clearErrors }}
 */
export function useFormValidation () {
  const validationErrors = ref({
    loanAmount: null,
    loanPurpose: null,
    repaymentPeriod: null,
    loanTerm: null,
  })

  const isValid = ref(false)

  /**
   * Validate a single field and update its error state.
   * @param {string} field - Field name
   * @param {*} value - Value to validate
   * @returns {boolean} True if valid
   */
  const validateField = (field, value) => {
    const validator = FIELD_VALIDATORS[field]
    if (!validator) return true

    const result = validator(value)
    validationErrors.value[field] = result.valid ? null : result.error
    return result.valid
  }

  /**
   * Validate all fields at once.
   * @param {object} formData - Complete form data object
   * @returns {{ valid: boolean, data: object|null, errors: object|null }}
   */
  const validateAll = (formData) => {
    const result = validateFormInput(formData)

    if (!result.valid && result.errors?.fieldErrors) {
      const fieldErrors = result.errors.fieldErrors
      Object.keys(validationErrors.value).forEach((field) => {
        validationErrors.value[field] = fieldErrors[field]?.[0] ?? null
      })
    } else {
      clearErrors()
    }

    isValid.value = result.valid
    return result
  }

  /**
   * Clear all validation errors and reset isValid.
   */
  const clearErrors = () => {
    validationErrors.value = {
      loanAmount: null,
      loanPurpose: null,
      repaymentPeriod: null,
      loanTerm: null,
    }
    isValid.value = false
  }

  return {
    validationErrors,
    isValid,
    validateField,
    validateAll,
    clearErrors,
  }
}

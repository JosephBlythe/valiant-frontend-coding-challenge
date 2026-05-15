import { describe, it, expect } from 'vitest'
import { useFormValidation } from '@/composables/useFormValidation'

describe('useFormValidation', () => {
  describe('initial state', () => {
    it('starts with no validation errors', () => {
      const { validationErrors } = useFormValidation()
      expect(validationErrors.value.loanAmount).toBe(null)
      expect(validationErrors.value.loanPurpose).toBe(null)
      expect(validationErrors.value.repaymentPeriod).toBe(null)
      expect(validationErrors.value.loanTerm).toBe(null)
    })

    it('starts with isValid false', () => {
      const { isValid } = useFormValidation()
      expect(isValid.value).toBe(false)
    })
  })

  describe('validateField - loanAmount', () => {
    it('accepts valid amounts (1,000 - 20,000,000)', () => {
      const { validateField, validationErrors } = useFormValidation()
      expect(validateField('loanAmount', 1000)).toBe(true)
      expect(validationErrors.value.loanAmount).toBe(null)
    })

    it('accepts mid-range amounts', () => {
      const { validateField, validationErrors } = useFormValidation()
      expect(validateField('loanAmount', 500000)).toBe(true)
      expect(validationErrors.value.loanAmount).toBe(null)
    })

    it('accepts maximum (20,000,000)', () => {
      const { validateField, validationErrors } = useFormValidation()
      expect(validateField('loanAmount', 20000000)).toBe(true)
      expect(validationErrors.value.loanAmount).toBe(null)
    })

    it('rejects amounts below 1,000', () => {
      const { validateField, validationErrors } = useFormValidation()
      expect(validateField('loanAmount', 999)).toBe(false)
      expect(validationErrors.value.loanAmount).toBeTruthy()
    })

    it('rejects amounts above 20,000,000', () => {
      const { validateField, validationErrors } = useFormValidation()
      expect(validateField('loanAmount', 20000001)).toBe(false)
      expect(validationErrors.value.loanAmount).toBeTruthy()
    })

    it('rejects non-numeric input', () => {
      const { validateField, validationErrors } = useFormValidation()
      expect(validateField('loanAmount', 'abc')).toBe(false)
      expect(validationErrors.value.loanAmount).toBeTruthy()
    })

    it('rejects null', () => {
      const { validateField, validationErrors } = useFormValidation()
      expect(validateField('loanAmount', null)).toBe(false)
      expect(validationErrors.value.loanAmount).toBeTruthy()
    })

    it('uses Zod error message with dollar sign', () => {
      const { validateField, validationErrors } = useFormValidation()
      validateField('loanAmount', 100)
      expect(validationErrors.value.loanAmount).toContain('$')
    })
  })

  describe('validateField - loanPurpose', () => {
    it('accepts a non-empty string', () => {
      const { validateField, validationErrors } = useFormValidation()
      expect(validateField('loanPurpose', 'general')).toBe(true)
      expect(validationErrors.value.loanPurpose).toBe(null)
    })

    it('rejects empty string', () => {
      const { validateField, validationErrors } = useFormValidation()
      expect(validateField('loanPurpose', '')).toBe(false)
      expect(validationErrors.value.loanPurpose).toBeTruthy()
    })

    it('rejects null', () => {
      const { validateField, validationErrors } = useFormValidation()
      expect(validateField('loanPurpose', null)).toBe(false)
      expect(validationErrors.value.loanPurpose).toBeTruthy()
    })
  })

  describe('validateField - repaymentPeriod', () => {
    it('accepts positive numbers', () => {
      const { validateField, validationErrors } = useFormValidation()
      expect(validateField('repaymentPeriod', 12)).toBe(true)
      expect(validationErrors.value.repaymentPeriod).toBe(null)
    })

    it('accepts weekly (52) and fortnightly (26)', () => {
      const { validateField } = useFormValidation()
      expect(validateField('repaymentPeriod', 52)).toBe(true)
      expect(validateField('repaymentPeriod', 26)).toBe(true)
    })

    it('rejects zero', () => {
      const { validateField, validationErrors } = useFormValidation()
      expect(validateField('repaymentPeriod', 0)).toBe(false)
      expect(validationErrors.value.repaymentPeriod).toBeTruthy()
    })

    it('rejects negative numbers', () => {
      const { validateField, validationErrors } = useFormValidation()
      expect(validateField('repaymentPeriod', -12)).toBe(false)
      expect(validationErrors.value.repaymentPeriod).toBeTruthy()
    })

    it('rejects non-numeric input', () => {
      const { validateField, validationErrors } = useFormValidation()
      expect(validateField('repaymentPeriod', 'monthly')).toBe(false)
      expect(validationErrors.value.repaymentPeriod).toBeTruthy()
    })
  })

  describe('validateField - loanTerm', () => {
    it('accepts positive month values', () => {
      const { validateField, validationErrors } = useFormValidation()
      expect(validateField('loanTerm', 24)).toBe(true)
      expect(validationErrors.value.loanTerm).toBe(null)
    })

    it('rejects zero', () => {
      const { validateField, validationErrors } = useFormValidation()
      expect(validateField('loanTerm', 0)).toBe(false)
      expect(validationErrors.value.loanTerm).toBeTruthy()
    })

    it('rejects negative numbers', () => {
      const { validateField, validationErrors } = useFormValidation()
      expect(validateField('loanTerm', -12)).toBe(false)
      expect(validationErrors.value.loanTerm).toBeTruthy()
    })
  })

  describe('validateField - unknown field', () => {
    it('returns true without throwing for unknown fields', () => {
      const { validateField } = useFormValidation()
      expect(() => validateField('unknownField', 'value')).not.toThrow()
      expect(validateField('unknownField', 'value')).toBe(true)
    })
  })

  describe('validateAll', () => {
    it('returns valid:true for a complete, valid form', () => {
      const { validateAll, isValid } = useFormValidation()
      const result = validateAll({
        loanAmount: 10000,
        loanPurpose: 'general',
        repaymentPeriod: 12,
        loanTerm: 24,
      })
      expect(result.valid).toBe(true)
      expect(isValid.value).toBe(true)
    })

    it('returns valid:false and populates errors for invalid form', () => {
      const { validateAll, validationErrors } = useFormValidation()
      const result = validateAll({ loanAmount: 999, loanPurpose: '' })
      expect(result.valid).toBe(false)
      expect(validationErrors.value.loanAmount).toBeTruthy()
      expect(validationErrors.value.loanPurpose).toBeTruthy()
    })

    it('clears prior errors on a valid submission', () => {
      const { validateAll, validationErrors } = useFormValidation()
      validateAll({ loanAmount: 100 })
      validateAll({
        loanAmount: 10000,
        loanPurpose: 'vehicle',
        repaymentPeriod: 12,
        loanTerm: 24,
      })
      expect(validationErrors.value.loanAmount).toBe(null)
    })

    it('returns flattened Zod errors object', () => {
      const { validateAll } = useFormValidation()
      const result = validateAll({})
      expect(result.errors).not.toBe(null)
      expect(result.errors.fieldErrors).toBeDefined()
    })
  })

  describe('clearErrors', () => {
    it('resets all validation errors to null', () => {
      const { validateField, clearErrors, validationErrors } = useFormValidation()
      validateField('loanAmount', 100)
      validateField('loanPurpose', '')
      clearErrors()
      expect(validationErrors.value.loanAmount).toBe(null)
      expect(validationErrors.value.loanPurpose).toBe(null)
      expect(validationErrors.value.repaymentPeriod).toBe(null)
      expect(validationErrors.value.loanTerm).toBe(null)
    })

    it('resets isValid to false', () => {
      const { validateAll, clearErrors, isValid } = useFormValidation()
      validateAll({
        loanAmount: 10000,
        loanPurpose: 'general',
        repaymentPeriod: 12,
        loanTerm: 24,
      })
      expect(isValid.value).toBe(true)
      clearErrors()
      expect(isValid.value).toBe(false)
    })
  })

  describe('error message quality', () => {
    it('provides user-friendly messages (not technical jargon)', () => {
      const { validateField, validationErrors } = useFormValidation()
      validateField('loanAmount', 100)
      expect(validationErrors.value.loanAmount).not.toContain('ZodError')
      expect(validationErrors.value.loanAmount).not.toContain('invalid_type')
    })

    it('includes dollar sign in amount error messages', () => {
      const { validateField, validationErrors } = useFormValidation()
      validateField('loanAmount', 500)
      expect(validationErrors.value.loanAmount).toContain('$')
    })
  })
})

import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useCalculatorStore } from '@/stores/calculator'

describe('Calculator Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('initial state', () => {
    it('initializes formData with default values', () => {
      const store = useCalculatorStore()
      expect(store.formData.loanAmount).toBe(1000)
      expect(store.formData.loanPurpose).toBe(null)
      expect(store.formData.repaymentPeriod).toBe(null)
      expect(store.formData.loanTerm).toBe(null)
    })

    it('initializes results with null values', () => {
      const store = useCalculatorStore()
      expect(store.results.paymentPerPeriod).toBe(null)
      expect(store.results.totalPayment).toBe(null)
    })

    it('initializes apiData with empty arrays', () => {
      const store = useCalculatorStore()
      expect(store.apiData.loanPurposes).toEqual([])
      expect(store.apiData.repaymentPeriods).toEqual([])
      expect(store.apiData.loanTerms).toEqual([])
    })

    it('initializes all loading states as false', () => {
      const store = useCalculatorStore()
      expect(store.loading.purposes).toBe(false)
      expect(store.loading.periods).toBe(false)
      expect(store.loading.terms).toBe(false)
    })

    it('initializes all error states as null', () => {
      const store = useCalculatorStore()
      expect(store.errors.purposes).toBe(null)
      expect(store.errors.periods).toBe(null)
      expect(store.errors.terms).toBe(null)
    })

    it('initializes all validation errors as null', () => {
      const store = useCalculatorStore()
      expect(store.validationErrors.loanAmount).toBe(null)
      expect(store.validationErrors.loanPurpose).toBe(null)
      expect(store.validationErrors.repaymentPeriod).toBe(null)
      expect(store.validationErrors.loanTerm).toBe(null)
    })
  })

  describe('computed - isLoading', () => {
    it('returns false when nothing is loading', () => {
      const store = useCalculatorStore()
      expect(store.isLoading).toBe(false)
    })

    it('returns true when purposes are loading', () => {
      const store = useCalculatorStore()
      store.setLoading('purposes', true)
      expect(store.isLoading).toBe(true)
    })

    it('returns true when any endpoint is loading', () => {
      const store = useCalculatorStore()
      store.setLoading('terms', true)
      expect(store.isLoading).toBe(true)
    })
  })

  describe('computed - isFormComplete', () => {
    it('returns false when all fields are null', () => {
      const store = useCalculatorStore()
      expect(store.isFormComplete).toBe(false)
    })

    it('returns false when some fields are null', () => {
      const store = useCalculatorStore()
      store.updateField('loanAmount', 10000)
      store.updateField('loanPurpose', 'general')
      expect(store.isFormComplete).toBe(false)
    })

    it('returns true when all fields are filled', () => {
      const store = useCalculatorStore()
      store.updateField('loanAmount', 10000)
      store.updateField('loanPurpose', 'general')
      store.updateField('repaymentPeriod', 12)
      store.updateField('loanTerm', 24)
      expect(store.isFormComplete).toBe(true)
    })
  })

  describe('computed - hasValidationErrors', () => {
    it('returns false when no validation errors', () => {
      const store = useCalculatorStore()
      expect(store.hasValidationErrors).toBe(false)
    })

    it('returns true when a validation error exists', () => {
      const store = useCalculatorStore()
      store.setValidationErrors({ loanAmount: 'Amount too low' })
      expect(store.hasValidationErrors).toBe(true)
    })
  })

  describe('computed - selectedPurpose', () => {
    it('returns null when no purpose selected', () => {
      const store = useCalculatorStore()
      expect(store.selectedPurpose).toBe(null)
    })

    it('finds purpose by value field', () => {
      const store = useCalculatorStore()
      store.setLoanPurposes([{ value: 'general', label: 'General', annualRate: 0.1 }])
      store.updateField('loanPurpose', 'general')
      expect(store.selectedPurpose).toEqual({ value: 'general', label: 'General', annualRate: 0.1 })
    })
  })

  describe('updateFormData', () => {
    it('updates specified fields', () => {
      const store = useCalculatorStore()
      store.updateFormData({ loanAmount: 50000, loanPurpose: 'vehicle' })
      expect(store.formData.loanAmount).toBe(50000)
      expect(store.formData.loanPurpose).toBe('vehicle')
    })

    it('does not overwrite unspecified fields', () => {
      const store = useCalculatorStore()
      store.updateFormData({ loanAmount: 50000 })
      store.updateFormData({ loanPurpose: 'vehicle' })
      expect(store.formData.loanAmount).toBe(50000)
    })

    it('clears validation error for updated field', () => {
      const store = useCalculatorStore()
      store.setValidationErrors({ loanAmount: 'Too low' })
      store.updateFormData({ loanAmount: 10000 })
      expect(store.validationErrors.loanAmount).toBe(null)
    })
  })

  describe('updateField', () => {
    it('updates a single field value', () => {
      const store = useCalculatorStore()
      store.updateField('loanTerm', 36)
      expect(store.formData.loanTerm).toBe(36)
    })

    it('clears validation error for that field', () => {
      const store = useCalculatorStore()
      store.setValidationErrors({ loanTerm: 'Required' })
      store.updateField('loanTerm', 36)
      expect(store.validationErrors.loanTerm).toBe(null)
    })

    it('ignores unknown field names', () => {
      const store = useCalculatorStore()
      expect(() => store.updateField('unknownField', 'value')).not.toThrow()
    })
  })

  describe('updateResults', () => {
    it('updates calculation results', () => {
      const store = useCalculatorStore()
      store.updateResults({ paymentPerPeriod: 1234.56, totalPayment: 29629.44 })
      expect(store.results.paymentPerPeriod).toBe(1234.56)
      expect(store.results.totalPayment).toBe(29629.44)
    })
  })

  describe('API data actions', () => {
    it('setLoanPurposes stores purposes and clears error', () => {
      const store = useCalculatorStore()
      store.setError('purposes', 'Network error')
      store.setLoanPurposes([{ value: 'general', label: 'General', annualRate: 0.1 }])
      expect(store.apiData.loanPurposes).toHaveLength(1)
      expect(store.errors.purposes).toBe(null)
    })

    it('setRepaymentPeriods stores periods and clears error', () => {
      const store = useCalculatorStore()
      store.setRepaymentPeriods([{ value: 12, label: 'Monthly' }])
      expect(store.apiData.repaymentPeriods).toHaveLength(1)
    })

    it('setLoanTerms stores terms and clears error', () => {
      const store = useCalculatorStore()
      store.setLoanTerms([{ value: 24, label: '2 Years' }])
      expect(store.apiData.loanTerms).toHaveLength(1)
    })
  })

  describe('setLoading', () => {
    it('sets loading for a valid endpoint', () => {
      const store = useCalculatorStore()
      store.setLoading('purposes', true)
      expect(store.loading.purposes).toBe(true)
    })

    it('unsets loading', () => {
      const store = useCalculatorStore()
      store.setLoading('purposes', true)
      store.setLoading('purposes', false)
      expect(store.loading.purposes).toBe(false)
    })

    it('ignores invalid endpoint names', () => {
      const store = useCalculatorStore()
      expect(() => store.setLoading('invalid', true)).not.toThrow()
    })
  })

  describe('setError', () => {
    it('sets error message for an endpoint', () => {
      const store = useCalculatorStore()
      store.setError('periods', 'Failed to load')
      expect(store.errors.periods).toBe('Failed to load')
    })

    it('clears error by setting null', () => {
      const store = useCalculatorStore()
      store.setError('periods', 'error')
      store.setError('periods', null)
      expect(store.errors.periods).toBe(null)
    })
  })

  describe('setValidationErrors / clearValidationErrors', () => {
    it('merges new errors into existing state', () => {
      const store = useCalculatorStore()
      store.setValidationErrors({ loanAmount: 'Too low', loanPurpose: 'Required' })
      expect(store.validationErrors.loanAmount).toBe('Too low')
      expect(store.validationErrors.loanPurpose).toBe('Required')
    })

    it('clearValidationErrors resets all to null', () => {
      const store = useCalculatorStore()
      store.setValidationErrors({ loanAmount: 'Too low' })
      store.clearValidationErrors()
      expect(store.validationErrors.loanAmount).toBe(null)
      expect(store.validationErrors.loanPurpose).toBe(null)
    })
  })

  describe('reset and resetForm', () => {
    it('reset clears all form data and validation errors', () => {
      const store = useCalculatorStore()
      store.updateField('loanAmount', 10000)
      store.setValidationErrors({ loanAmount: 'error' })
      store.reset()
      expect(store.formData.loanAmount).toBe(1000)
      expect(store.validationErrors.loanAmount).toBe(null)
    })

    it('reset also clears results', () => {
      const store = useCalculatorStore()
      store.updateResults({ paymentPerPeriod: 500, totalPayment: 6000 })
      store.reset()
      expect(store.results.paymentPerPeriod).toBe(null)
    })

    it('resetForm does not affect apiData', () => {
      const store = useCalculatorStore()
      store.setLoanPurposes([{ value: 'general', label: 'General', annualRate: 0.1 }])
      store.updateField('loanAmount', 10000)
      store.resetForm()
      expect(store.formData.loanAmount).toBe(1000)
      expect(store.apiData.loanPurposes).toHaveLength(1)
    })
  })

  describe('state isolation between tests', () => {
    it('store starts fresh in each test', () => {
      const store = useCalculatorStore()
      expect(store.formData.loanAmount).toBe(1000)
    })

    it('multiple field updates do not interfere', () => {
      const store = useCalculatorStore()
      store.updateField('loanAmount', 10000)
      store.updateField('loanPurpose', 'vehicle')
      store.updateField('repaymentPeriod', 26)
      store.updateField('loanTerm', 48)
      expect(store.formData.loanAmount).toBe(10000)
      expect(store.formData.loanPurpose).toBe('vehicle')
      expect(store.formData.repaymentPeriod).toBe(26)
      expect(store.formData.loanTerm).toBe(48)
    })
  })
})

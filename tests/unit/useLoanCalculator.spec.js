import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ref, computed, effectScope } from 'vue'
import { useLoansAPI } from '@/composables/useLoansAPI'
import { useLoanCalculator } from '@/composables/useLoanCalculator'

vi.mock('@/composables/useLoansAPI', () => ({
  useLoansAPI: vi.fn(),
}))

const MOCK_PURPOSES = [
  { value: 'general', label: 'General', annualRate: 0.1 },
  { value: 'vehicle', label: 'Vehicle', annualRate: 0.12 },
]
const MOCK_PERIODS = [
  { value: 12, label: 'Monthly' },
  { value: 26, label: 'Fortnightly' },
]
const MOCK_TERMS = [
  { value: 12, label: '1 Year' },
  { value: 24, label: '2 Years' },
]

function makeApiMock ({
  purposes = MOCK_PURPOSES,
  periods = MOCK_PERIODS,
  terms = MOCK_TERMS,
  loadingOverrides = {},
  errorsOverrides = {},
} = {}) {
  const loading = ref({ purposes: false, periods: false, terms: false, ...loadingOverrides })
  const errors = ref({ purposes: null, periods: null, terms: null, ...errorsOverrides })
  return {
    loanPurposes: ref(purposes),
    repaymentPeriods: ref(periods),
    loanTerms: ref(terms),
    loading,
    errors,
    isLoading: computed(() => loading.value.purposes || loading.value.periods || loading.value.terms),
  }
}

describe('useLoanCalculator', () => {
  beforeEach(() => {
    useLoansAPI.mockReturnValue(makeApiMock())
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  // ─── Interface ────────────────────────────────────────────────────────────

  describe('return interface', () => {
    it('exposes formData', () => {
      const scope = effectScope()
      let calc
      scope.run(() => { calc = useLoanCalculator() })
      expect(calc).toHaveProperty('formData')
      scope.stop()
    })

    it('exposes results', () => {
      const scope = effectScope()
      let calc
      scope.run(() => { calc = useLoanCalculator() })
      expect(calc).toHaveProperty('results')
      scope.stop()
    })

    it('exposes apiData', () => {
      const scope = effectScope()
      let calc
      scope.run(() => { calc = useLoanCalculator() })
      expect(calc).toHaveProperty('apiData')
      scope.stop()
    })

    it('exposes loading and errors from API', () => {
      const scope = effectScope()
      let calc
      scope.run(() => { calc = useLoanCalculator() })
      expect(calc).toHaveProperty('loading')
      expect(calc).toHaveProperty('errors')
      scope.stop()
    })

    it('exposes validationErrors, isLoading, isFormComplete, hasValidationErrors', () => {
      const scope = effectScope()
      let calc
      scope.run(() => { calc = useLoanCalculator() })
      expect(calc).toHaveProperty('validationErrors')
      expect(calc).toHaveProperty('isLoading')
      expect(calc).toHaveProperty('isFormComplete')
      expect(calc).toHaveProperty('hasValidationErrors')
      scope.stop()
    })

    it('exposes updateField, submitForm, clearErrors actions', () => {
      const scope = effectScope()
      let calc
      scope.run(() => { calc = useLoanCalculator() })
      expect(typeof calc.updateField).toBe('function')
      expect(typeof calc.submitForm).toBe('function')
      expect(typeof calc.clearErrors).toBe('function')
      scope.stop()
    })
  })

  // ─── formData initial state ───────────────────────────────────────────────

  describe('formData initial state', () => {
    it('initializes loanAmount to 1000', () => {
      const scope = effectScope()
      let calc
      scope.run(() => { calc = useLoanCalculator() })
      expect(calc.formData.value.loanAmount).toBe(1000)
      scope.stop()
    })

    it('initializes loanPurpose to null (before API data applied)', () => {
      useLoansAPI.mockReturnValue(makeApiMock({ purposes: [] }))
      const scope = effectScope()
      let calc
      scope.run(() => { calc = useLoanCalculator() })
      expect(calc.formData.value.loanPurpose).toBeNull()
      scope.stop()
    })

    it('each instance has independent state', () => {
      const scope = effectScope()
      let calc1, calc2
      scope.run(() => {
        calc1 = useLoanCalculator()
        calc2 = useLoanCalculator()
      })
      calc1.updateField('loanAmount', 50000)
      expect(calc1.formData.value.loanAmount).toBe(50000)
      expect(calc2.formData.value.loanAmount).toBe(1000)
      scope.stop()
    })
  })

  // ─── API orchestration ────────────────────────────────────────────────────

  describe('API orchestration', () => {
    it('calls useLoansAPI with the provided baseUrl', () => {
      const scope = effectScope()
      scope.run(() => { useLoanCalculator('http://test-host:9000') })
      expect(useLoansAPI).toHaveBeenCalledWith('http://test-host:9000')
      scope.stop()
    })

    it('exposes loanPurposes, repaymentPeriods, loanTerms via apiData', () => {
      const scope = effectScope()
      let calc
      scope.run(() => { calc = useLoanCalculator() })
      expect(calc.apiData.value.loanPurposes).toEqual(MOCK_PURPOSES)
      expect(calc.apiData.value.repaymentPeriods).toEqual(MOCK_PERIODS)
      expect(calc.apiData.value.loanTerms).toEqual(MOCK_TERMS)
      scope.stop()
    })

    it('passes loading state through from useLoansAPI', () => {
      useLoansAPI.mockReturnValue(makeApiMock({ loadingOverrides: { purposes: true } }))
      const scope = effectScope()
      let calc
      scope.run(() => { calc = useLoanCalculator() })
      expect(calc.loading.value.purposes).toBe(true)
      scope.stop()
    })

    it('passes error state through from useLoansAPI', () => {
      useLoansAPI.mockReturnValue(makeApiMock({ errorsOverrides: { purposes: 'Network error' } }))
      const scope = effectScope()
      let calc
      scope.run(() => { calc = useLoanCalculator() })
      expect(calc.errors.value.purposes).toBe('Network error')
      scope.stop()
    })

    it('isLoading reflects underlying API loading state', () => {
      useLoansAPI.mockReturnValue(makeApiMock({ loadingOverrides: { periods: true } }))
      const scope = effectScope()
      let calc
      scope.run(() => { calc = useLoanCalculator() })
      expect(calc.isLoading.value).toBe(true)
      scope.stop()
    })

    it('apiData falls back to empty arrays when API returns nothing', () => {
      useLoansAPI.mockReturnValue(makeApiMock({ purposes: [], periods: [], terms: [] }))
      const scope = effectScope()
      let calc
      scope.run(() => { calc = useLoanCalculator() })
      expect(calc.apiData.value.loanPurposes).toEqual([])
      scope.stop()
    })
  })

  // ─── Default selections ───────────────────────────────────────────────────

  describe('default selections from API data', () => {
    it('formData.loanPurpose defaults to the first API option before user selection', () => {
      const scope = effectScope()
      let calc
      scope.run(() => { calc = useLoanCalculator() })
      expect(calc.formData.value.loanPurpose).toBe(MOCK_PURPOSES[0].value)
      scope.stop()
    })

    it('formData.repaymentPeriod defaults to the first API option before user selection', () => {
      const scope = effectScope()
      let calc
      scope.run(() => { calc = useLoanCalculator() })
      expect(calc.formData.value.repaymentPeriod).toBe(MOCK_PERIODS[0].value)
      scope.stop()
    })

    it('formData.loanTerm defaults to the first API option before user selection', () => {
      const scope = effectScope()
      let calc
      scope.run(() => { calc = useLoanCalculator() })
      expect(calc.formData.value.loanTerm).toBe(MOCK_TERMS[0].value)
      scope.stop()
    })

    it('formData.loanPurpose is null when API returns no options', () => {
      useLoansAPI.mockReturnValue(makeApiMock({ purposes: [] }))
      const scope = effectScope()
      let calc
      scope.run(() => { calc = useLoanCalculator() })
      expect(calc.formData.value.loanPurpose).toBeNull()
      scope.stop()
    })
  })

  // ─── User selection overrides defaults ───────────────────────────────────

  describe('user selection overrides defaults', () => {
    it('formData.loanPurpose reflects user selection after updateField', () => {
      const scope = effectScope()
      let calc
      scope.run(() => { calc = useLoanCalculator() })
      calc.updateField('loanPurpose', 'vehicle')
      expect(calc.formData.value.loanPurpose).toBe('vehicle')
      scope.stop()
    })

    it('formData.repaymentPeriod reflects user selection after updateField', () => {
      const scope = effectScope()
      let calc
      scope.run(() => { calc = useLoanCalculator() })
      calc.updateField('repaymentPeriod', 26)
      expect(calc.formData.value.repaymentPeriod).toBe(26)
      scope.stop()
    })

    it('formData.loanAmount reflects user-supplied value after updateField', () => {
      const scope = effectScope()
      let calc
      scope.run(() => { calc = useLoanCalculator() })
      calc.updateField('loanAmount', 50000)
      expect(calc.formData.value.loanAmount).toBe(50000)
      scope.stop()
    })

    it('updateField ignores unknown field names', () => {
      const scope = effectScope()
      let calc
      scope.run(() => { calc = useLoanCalculator() })
      expect(() => calc.updateField('unknownField', 'value')).not.toThrow()
      scope.stop()
    })
  })

  // ─── isFormComplete ───────────────────────────────────────────────────────

  describe('isFormComplete', () => {
    it('is true when all fields have values (using API defaults)', () => {
      const scope = effectScope()
      let calc
      scope.run(() => { calc = useLoanCalculator() })
      // loanAmount=1000 + three API defaults → all present
      expect(calc.isFormComplete.value).toBe(true)
      scope.stop()
    })

    it('is false when loanAmount is null', () => {
      const scope = effectScope()
      let calc
      scope.run(() => { calc = useLoanCalculator() })
      calc.updateField('loanAmount', null)
      expect(calc.isFormComplete.value).toBe(false)
      scope.stop()
    })

    it('is false when API returns no options (no defaults available)', () => {
      useLoansAPI.mockReturnValue(makeApiMock({ purposes: [], periods: [], terms: [] }))
      const scope = effectScope()
      let calc
      scope.run(() => { calc = useLoanCalculator() })
      expect(calc.isFormComplete.value).toBe(false)
      scope.stop()
    })
  })

  // ─── results calculation ──────────────────────────────────────────────────

  describe('results', () => {
    it('calculates results when the form is complete and valid', () => {
      const scope = effectScope()
      let calc
      scope.run(() => { calc = useLoanCalculator() })
      // All defaults in place: loanAmount=1000, purpose=general(0.1), period=12, term=12
      expect(calc.results.value.paymentPerPeriod).not.toBeNull()
      expect(calc.results.value.totalPayment).not.toBeNull()
      expect(calc.results.value.paymentPerPeriod).toBeGreaterThan(0)
      scope.stop()
    })

    it('returns null values when the form is incomplete', () => {
      useLoansAPI.mockReturnValue(makeApiMock({ purposes: [], periods: [], terms: [] }))
      const scope = effectScope()
      let calc
      scope.run(() => { calc = useLoanCalculator() })
      expect(calc.results.value.paymentPerPeriod).toBeNull()
      expect(calc.results.value.totalPayment).toBeNull()
      scope.stop()
    })

    it('returns null values when there are validation errors', () => {
      const scope = effectScope()
      let calc
      scope.run(() => { calc = useLoanCalculator() })
      // Below minimum → triggers validation error
      calc.updateField('loanAmount', 500)
      expect(calc.results.value.paymentPerPeriod).toBeNull()
      scope.stop()
    })

    it('recalculates when loanAmount changes to a valid value', () => {
      const scope = effectScope()
      let calc
      scope.run(() => { calc = useLoanCalculator() })
      calc.updateField('loanAmount', 20000)
      const { paymentPerPeriod } = calc.results.value
      expect(paymentPerPeriod).toBeGreaterThan(0)
      scope.stop()
    })

    it('recalculates when loanPurpose changes (different annualRate)', () => {
      const scope = effectScope()
      let calc
      scope.run(() => { calc = useLoanCalculator() })

      const resultGeneral = calc.results.value.paymentPerPeriod
      calc.updateField('loanPurpose', 'vehicle') // 12% vs 10%
      const resultVehicle = calc.results.value.paymentPerPeriod

      expect(resultVehicle).toBeGreaterThan(resultGeneral)
      scope.stop()
    })

    it('total payment equals paymentPerPeriod × number of periods', () => {
      const scope = effectScope()
      let calc
      scope.run(() => { calc = useLoanCalculator() })
      const { paymentPerPeriod, totalPayment } = calc.results.value
      const term = calc.formData.value.loanTerm // 12 months
      const period = calc.formData.value.repaymentPeriod // 12 per year
      const expectedPeriods = (term / 12) * period
      expect(totalPayment).toBeCloseTo(paymentPerPeriod * expectedPeriods, 5)
      scope.stop()
    })
  })

  // ─── validation ───────────────────────────────────────────────────────────

  describe('form validation', () => {
    it('hasValidationErrors is false initially', () => {
      const scope = effectScope()
      let calc
      scope.run(() => { calc = useLoanCalculator() })
      expect(calc.hasValidationErrors.value).toBe(false)
      scope.stop()
    })

    it('hasValidationErrors becomes true after an invalid updateField', () => {
      const scope = effectScope()
      let calc
      scope.run(() => { calc = useLoanCalculator() })
      calc.updateField('loanAmount', 999) // below minimum
      expect(calc.hasValidationErrors.value).toBe(true)
      scope.stop()
    })

    it('validationErrors.loanAmount is populated after invalid amount', () => {
      const scope = effectScope()
      let calc
      scope.run(() => { calc = useLoanCalculator() })
      calc.updateField('loanAmount', 0)
      expect(calc.validationErrors.value.loanAmount).toBeTruthy()
      scope.stop()
    })

    it('clearErrors resets all validation errors', () => {
      const scope = effectScope()
      let calc
      scope.run(() => { calc = useLoanCalculator() })
      calc.updateField('loanAmount', 0)
      calc.clearErrors()
      expect(calc.validationErrors.value.loanAmount).toBeNull()
      expect(calc.hasValidationErrors.value).toBe(false)
      scope.stop()
    })

    it('submitForm returns valid:true for a complete valid form', () => {
      const scope = effectScope()
      let calc
      scope.run(() => { calc = useLoanCalculator() })
      const result = calc.submitForm()
      expect(result.valid).toBe(true)
      scope.stop()
    })

    it('submitForm returns valid:false for a form with null loanAmount', () => {
      const scope = effectScope()
      let calc
      scope.run(() => { calc = useLoanCalculator() })
      calc.updateField('loanAmount', null)
      const result = calc.submitForm()
      expect(result.valid).toBe(false)
      scope.stop()
    })
  })
})

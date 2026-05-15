import { describe, it, expect } from 'vitest'
import {
  loanAmountSchema,
  loanPurposeSchema,
  repaymentPeriodSchema,
  loanTermSchema,
  calculatorFormSchema,
  validateFormInput,
  validateLoanAmount,
  validateLoanPurpose,
  validateRepaymentPeriod,
  validateLoanTerm,
} from '@/schemas/calculator'

describe('Zod Schemas - Calculator', () => {
  describe('loanAmountSchema', () => {
    it('accepts valid amounts (1,000)', () => {
      expect(loanAmountSchema.safeParse(1000).success).toBe(true)
    })

    it('accepts valid amounts (10,000)', () => {
      expect(loanAmountSchema.safeParse(10000).success).toBe(true)
    })

    it('accepts valid amounts (20,000,000)', () => {
      expect(loanAmountSchema.safeParse(20000000).success).toBe(true)
    })

    it('accepts amounts in middle range', () => {
      expect(loanAmountSchema.safeParse(5000000).success).toBe(true)
    })

    it('rejects amounts below 1,000', () => {
      const result = loanAmountSchema.safeParse(999)
      expect(result.success).toBe(false)
      expect(result.error?.issues[0]?.message).toContain('at least $1,000')
    })

    it('rejects amounts above 20,000,000', () => {
      const result = loanAmountSchema.safeParse(20000001)
      expect(result.success).toBe(false)
      expect(result.error?.issues[0]?.message).toContain('cannot exceed $20,000,000')
    })

    it('rejects negative amounts', () => {
      expect(loanAmountSchema.safeParse(-1000).success).toBe(false)
    })

    it('rejects zero', () => {
      expect(loanAmountSchema.safeParse(0).success).toBe(false)
    })

    it('rejects non-numeric input', () => {
      expect(loanAmountSchema.safeParse('10000').success).toBe(false)
    })

    it('rejects null', () => {
      expect(loanAmountSchema.safeParse(null).success).toBe(false)
    })

    it('rejects undefined', () => {
      expect(loanAmountSchema.safeParse(undefined).success).toBe(false)
    })
  })

  describe('loanPurposeSchema', () => {
    it('accepts non-empty strings', () => {
      expect(loanPurposeSchema.safeParse('general').success).toBe(true)
    })

    it('accepts various purpose values', () => {
      expect(loanPurposeSchema.safeParse('vehicle').success).toBe(true)
      expect(loanPurposeSchema.safeParse('property').success).toBe(true)
    })

    it('rejects empty strings', () => {
      const result = loanPurposeSchema.safeParse('')
      expect(result.success).toBe(false)
      expect(result.error?.issues[0]?.message).toContain('select a loan purpose')
    })

    it('rejects null', () => {
      expect(loanPurposeSchema.safeParse(null).success).toBe(false)
    })

    it('rejects undefined', () => {
      expect(loanPurposeSchema.safeParse(undefined).success).toBe(false)
    })

    it('rejects non-string input', () => {
      expect(loanPurposeSchema.safeParse(123).success).toBe(false)
    })
  })

  describe('repaymentPeriodSchema', () => {
    it('accepts valid periods (12)', () => {
      expect(repaymentPeriodSchema.safeParse(12).success).toBe(true)
    })

    it('accepts valid periods (26)', () => {
      expect(repaymentPeriodSchema.safeParse(26).success).toBe(true)
    })

    it('accepts valid periods (52)', () => {
      expect(repaymentPeriodSchema.safeParse(52).success).toBe(true)
    })

    it('accepts positive numbers', () => {
      expect(repaymentPeriodSchema.safeParse(1).success).toBe(true)
    })

    it('rejects zero', () => {
      expect(repaymentPeriodSchema.safeParse(0).success).toBe(false)
    })

    it('rejects negative numbers', () => {
      expect(repaymentPeriodSchema.safeParse(-12).success).toBe(false)
    })

    it('rejects non-numeric input', () => {
      expect(repaymentPeriodSchema.safeParse('12').success).toBe(false)
    })

    it('rejects null', () => {
      expect(repaymentPeriodSchema.safeParse(null).success).toBe(false)
    })

    it('rejects undefined', () => {
      expect(repaymentPeriodSchema.safeParse(undefined).success).toBe(false)
    })
  })

  describe('loanTermSchema', () => {
    it('accepts valid terms (6 months)', () => {
      expect(loanTermSchema.safeParse(6).success).toBe(true)
    })

    it('accepts valid terms (12 months)', () => {
      expect(loanTermSchema.safeParse(12).success).toBe(true)
    })

    it('accepts valid terms (240 months - 20 years)', () => {
      expect(loanTermSchema.safeParse(240).success).toBe(true)
    })

    it('accepts positive numbers', () => {
      expect(loanTermSchema.safeParse(1).success).toBe(true)
    })

    it('rejects zero', () => {
      expect(loanTermSchema.safeParse(0).success).toBe(false)
    })

    it('rejects negative numbers', () => {
      expect(loanTermSchema.safeParse(-24).success).toBe(false)
    })

    it('rejects non-numeric input', () => {
      expect(loanTermSchema.safeParse('24').success).toBe(false)
    })

    it('rejects null', () => {
      expect(loanTermSchema.safeParse(null).success).toBe(false)
    })

    it('rejects undefined', () => {
      expect(loanTermSchema.safeParse(undefined).success).toBe(false)
    })
  })

  describe('calculatorFormSchema', () => {
    it('accepts complete valid form', () => {
      const validForm = {
        loanAmount: 10000,
        loanPurpose: 'general',
        repaymentPeriod: 12,
        loanTerm: 24,
      }
      expect(calculatorFormSchema.safeParse(validForm).success).toBe(true)
    })

    it('accepts various valid combinations', () => {
      const form1 = {
        loanAmount: 1000,
        loanPurpose: 'vehicle',
        repaymentPeriod: 52,
        loanTerm: 60,
      }
      expect(calculatorFormSchema.safeParse(form1).success).toBe(true)

      const form2 = {
        loanAmount: 20000000,
        loanPurpose: 'property',
        repaymentPeriod: 26,
        loanTerm: 240,
      }
      expect(calculatorFormSchema.safeParse(form2).success).toBe(true)
    })

    it('rejects form with invalid loan amount', () => {
      const invalidForm = {
        loanAmount: 999,
        loanPurpose: 'general',
        repaymentPeriod: 12,
        loanTerm: 24,
      }
      expect(calculatorFormSchema.safeParse(invalidForm).success).toBe(false)
    })

    it('rejects form with invalid loan purpose', () => {
      const invalidForm = {
        loanAmount: 10000,
        loanPurpose: '',
        repaymentPeriod: 12,
        loanTerm: 24,
      }
      expect(calculatorFormSchema.safeParse(invalidForm).success).toBe(false)
    })

    it('rejects form with invalid repayment period', () => {
      const invalidForm = {
        loanAmount: 10000,
        loanPurpose: 'general',
        repaymentPeriod: 0,
        loanTerm: 24,
      }
      expect(calculatorFormSchema.safeParse(invalidForm).success).toBe(false)
    })

    it('rejects form with invalid loan term', () => {
      const invalidForm = {
        loanAmount: 10000,
        loanPurpose: 'general',
        repaymentPeriod: 12,
        loanTerm: -24,
      }
      expect(calculatorFormSchema.safeParse(invalidForm).success).toBe(false)
    })

    it('rejects incomplete form - missing loanAmount', () => {
      const invalidForm = {
        loanPurpose: 'general',
        repaymentPeriod: 12,
        loanTerm: 24,
      }
      expect(calculatorFormSchema.safeParse(invalidForm).success).toBe(false)
    })

    it('rejects incomplete form - missing loanPurpose', () => {
      const invalidForm = {
        loanAmount: 10000,
        repaymentPeriod: 12,
        loanTerm: 24,
      }
      expect(calculatorFormSchema.safeParse(invalidForm).success).toBe(false)
    })

    it('rejects empty object', () => {
      expect(calculatorFormSchema.safeParse({}).success).toBe(false)
    })

    it('rejects null', () => {
      expect(calculatorFormSchema.safeParse(null).success).toBe(false)
    })
  })

  describe('validateFormInput helper', () => {
    it('returns valid: true for complete valid form', () => {
      const form = {
        loanAmount: 10000,
        loanPurpose: 'general',
        repaymentPeriod: 12,
        loanTerm: 24,
      }
      const result = validateFormInput(form)
      expect(result.valid).toBe(true)
      expect(result.data).toEqual(form)
      expect(result.errors).toBe(null)
    })

    it('returns valid: false for invalid form', () => {
      const form = {
        loanAmount: 999,
        loanPurpose: 'general',
        repaymentPeriod: 12,
        loanTerm: 24,
      }
      const result = validateFormInput(form)
      expect(result.valid).toBe(false)
      expect(result.data).toBe(null)
      expect(result.errors).not.toBe(null)
    })

    it('returns flattened error structure', () => {
      const form = {
        loanAmount: 999,
        loanPurpose: '',
      }
      const result = validateFormInput(form)
      expect(result.valid).toBe(false)
      expect(result.errors.fieldErrors).toBeDefined()
    })
  })

  describe('validateLoanAmount helper', () => {
    it('returns valid: true for valid amount', () => {
      const result = validateLoanAmount(10000)
      expect(result.valid).toBe(true)
      expect(result.error).toBe(null)
    })

    it('returns valid: false and error message for invalid amount', () => {
      const result = validateLoanAmount(999)
      expect(result.valid).toBe(false)
      expect(result.error).toContain('at least $1,000')
    })
  })

  describe('validateLoanPurpose helper', () => {
    it('returns valid: true for non-empty string', () => {
      const result = validateLoanPurpose('general')
      expect(result.valid).toBe(true)
      expect(result.error).toBe(null)
    })

    it('returns valid: false and error message for empty string', () => {
      const result = validateLoanPurpose('')
      expect(result.valid).toBe(false)
      expect(result.error).toBeDefined()
    })
  })

  describe('validateRepaymentPeriod helper', () => {
    it('returns valid: true for positive number', () => {
      const result = validateRepaymentPeriod(12)
      expect(result.valid).toBe(true)
      expect(result.error).toBe(null)
    })

    it('returns valid: false and error message for zero', () => {
      const result = validateRepaymentPeriod(0)
      expect(result.valid).toBe(false)
      expect(result.error).toBeDefined()
    })
  })

  describe('validateLoanTerm helper', () => {
    it('returns valid: true for positive number', () => {
      const result = validateLoanTerm(24)
      expect(result.valid).toBe(true)
      expect(result.error).toBe(null)
    })

    it('returns valid: false and error message for negative number', () => {
      const result = validateLoanTerm(-24)
      expect(result.valid).toBe(false)
      expect(result.error).toBeDefined()
    })
  })

  describe('Error messages clarity', () => {
    it('provides clear user-friendly error messages', () => {
      const result = validateLoanAmount(999)
      expect(result.error.length).toBeGreaterThan(0)
      expect(result.error.includes('$')).toBe(true)
    })

    it('error messages are not technical jargon', () => {
      const result = validateFormInput({})
      expect(result.errors).not.toContain('ValidationError')
    })
  })
})

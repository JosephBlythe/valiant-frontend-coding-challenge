import { describe, it, expect } from 'vitest'
import { useCalculateRepayment } from '@/composables/useCalculateRepayment'

describe('useCalculateRepayment', () => {
  it('exposes a calculate function', () => {
    const { calculate } = useCalculateRepayment()
    expect(typeof calculate).toBe('function')
  })

  describe('return format', () => {
    it('returns paymentPerPeriod and totalPayment', () => {
      const { calculate } = useCalculateRepayment()
      const result = calculate({ annualRate: 0.1, loanAmount: 10000, repaymentPeriod: 12, loanTerm: 12 })
      expect(result).toHaveProperty('paymentPerPeriod')
      expect(result).toHaveProperty('totalPayment')
    })

    it('returns numeric values for valid inputs', () => {
      const { calculate } = useCalculateRepayment()
      const { paymentPerPeriod, totalPayment } = calculate({ annualRate: 0.1, loanAmount: 10000, repaymentPeriod: 12, loanTerm: 12 })
      expect(typeof paymentPerPeriod).toBe('number')
      expect(typeof totalPayment).toBe('number')
    })

    it('returns positive values (Math.abs applied)', () => {
      const { calculate } = useCalculateRepayment()
      const { paymentPerPeriod, totalPayment } = calculate({ annualRate: 0.1, loanAmount: 10000, repaymentPeriod: 12, loanTerm: 12 })
      expect(paymentPerPeriod).toBeGreaterThan(0)
      expect(totalPayment).toBeGreaterThan(0)
    })
  })

  describe('monthly repayment calculation (PMT formula)', () => {
    it('calculates correct monthly payment for $10,000 at 10% over 12 months', () => {
      const { calculate } = useCalculateRepayment()
      const { paymentPerPeriod } = calculate({ annualRate: 0.1, loanAmount: 10000, repaymentPeriod: 12, loanTerm: 12 })
      expect(paymentPerPeriod).toBeCloseTo(879.16, 0)
    })

    it('calculates correct total payment for $10,000 at 10% over 12 months', () => {
      const { calculate } = useCalculateRepayment()
      const { totalPayment } = calculate({ annualRate: 0.1, loanAmount: 10000, repaymentPeriod: 12, loanTerm: 12 })
      expect(totalPayment).toBeCloseTo(10549.92, 0)
    })

    it('total payment equals paymentPerPeriod × totalPeriods', () => {
      const { calculate } = useCalculateRepayment()
      const loanTerm = 24
      const repaymentPeriod = 12
      const { paymentPerPeriod, totalPayment } = calculate({ annualRate: 0.08, loanAmount: 50000, repaymentPeriod, loanTerm })
      const expectedTotal = paymentPerPeriod * (loanTerm / 12) * repaymentPeriod
      expect(totalPayment).toBeCloseTo(expectedTotal, 5)
    })
  })

  describe('edge cases', () => {
    it('handles zero interest rate (equal instalments)', () => {
      const { calculate } = useCalculateRepayment()
      const { paymentPerPeriod, totalPayment } = calculate({ annualRate: 0, loanAmount: 10000, repaymentPeriod: 12, loanTerm: 12 })
      expect(paymentPerPeriod).toBeCloseTo(833.33, 1)
      expect(totalPayment).toBeCloseTo(10000, 1)
    })

    it('handles one month loan term', () => {
      const { calculate } = useCalculateRepayment()
      const { paymentPerPeriod, totalPayment } = calculate({ annualRate: 0.1, loanAmount: 10000, repaymentPeriod: 12, loanTerm: 1 })
      // Single payment = principal + one period's interest
      expect(paymentPerPeriod).toBeCloseTo(10083.33, 0)
      expect(totalPayment).toBeCloseTo(paymentPerPeriod, 5)
    })
  })

  describe('repayment frequencies', () => {
    it('calculates fortnightly payment (repaymentPeriod=26)', () => {
      const { calculate } = useCalculateRepayment()
      const { paymentPerPeriod, totalPayment } = calculate({ annualRate: 0.1, loanAmount: 10000, repaymentPeriod: 26, loanTerm: 12 })
      expect(paymentPerPeriod).toBeGreaterThan(0)
      expect(totalPayment).toBeGreaterThan(0)
    })

    it('calculates weekly payment (repaymentPeriod=52)', () => {
      const { calculate } = useCalculateRepayment()
      const { paymentPerPeriod, totalPayment } = calculate({ annualRate: 0.1, loanAmount: 10000, repaymentPeriod: 52, loanTerm: 12 })
      expect(paymentPerPeriod).toBeGreaterThan(0)
      expect(totalPayment).toBeGreaterThan(0)
    })

    it('weekly payment is roughly half of fortnightly payment', () => {
      const { calculate } = useCalculateRepayment()
      const fortnightly = calculate({ annualRate: 0.1, loanAmount: 10000, repaymentPeriod: 26, loanTerm: 24 })
      const weekly = calculate({ annualRate: 0.1, loanAmount: 10000, repaymentPeriod: 52, loanTerm: 24 })
      expect(weekly.paymentPerPeriod).toBeCloseTo(fortnightly.paymentPerPeriod / 2, 0)
    })
  })

  describe('null / missing inputs', () => {
    it('returns null values when annualRate is null', () => {
      const { calculate } = useCalculateRepayment()
      const result = calculate({ annualRate: null, loanAmount: 10000, repaymentPeriod: 12, loanTerm: 12 })
      expect(result.paymentPerPeriod).toBeNull()
      expect(result.totalPayment).toBeNull()
    })

    it('returns null values when loanAmount is null', () => {
      const { calculate } = useCalculateRepayment()
      const result = calculate({ annualRate: 0.1, loanAmount: null, repaymentPeriod: 12, loanTerm: 12 })
      expect(result.paymentPerPeriod).toBeNull()
      expect(result.totalPayment).toBeNull()
    })

    it('returns null values when repaymentPeriod is null', () => {
      const { calculate } = useCalculateRepayment()
      const result = calculate({ annualRate: 0.1, loanAmount: 10000, repaymentPeriod: null, loanTerm: 12 })
      expect(result.paymentPerPeriod).toBeNull()
      expect(result.totalPayment).toBeNull()
    })

    it('returns null values when loanTerm is null', () => {
      const { calculate } = useCalculateRepayment()
      const result = calculate({ annualRate: 0.1, loanAmount: 10000, repaymentPeriod: 12, loanTerm: null })
      expect(result.paymentPerPeriod).toBeNull()
      expect(result.totalPayment).toBeNull()
    })

    it('returns null values when all params are undefined', () => {
      const { calculate } = useCalculateRepayment()
      const result = calculate({})
      expect(result.paymentPerPeriod).toBeNull()
      expect(result.totalPayment).toBeNull()
    })
  })
})

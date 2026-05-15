import PMT from '@/utils/PMT'

/**
 * Provides PMT-based repayment calculation.
 * @returns {{ calculate }}
 */
export function useCalculateRepayment () {
  /**
   * Calculate repayment amounts for a loan.
   * @param {object} params
   * @param {number} params.annualRate - Annual interest rate as a decimal (e.g. 0.1 for 10%)
   * @param {number} params.loanAmount - Principal loan amount
   * @param {number} params.repaymentPeriod - Number of payment periods per year (12=monthly, 26=fortnightly, 52=weekly)
   * @param {number} params.loanTerm - Loan duration in months
   * @returns {{ paymentPerPeriod: number|null, totalPayment: number|null }}
   */
  const calculate = ({ annualRate, loanAmount, repaymentPeriod, loanTerm }) => {
    if (
      annualRate == null ||
      loanAmount == null ||
      repaymentPeriod == null ||
      loanTerm == null
    ) {
      return { paymentPerPeriod: null, totalPayment: null }
    }

    const ratePerPeriod = annualRate / repaymentPeriod
    const totalPeriods = (loanTerm / 12) * repaymentPeriod
    const rawPayment = PMT(ratePerPeriod, totalPeriods, loanAmount)

    const paymentPerPeriod = Math.abs(rawPayment)
    const totalPayment = Math.abs(rawPayment * totalPeriods)

    return { paymentPerPeriod, totalPayment }
  }

  return { calculate }
}

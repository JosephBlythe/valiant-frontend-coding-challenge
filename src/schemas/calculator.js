import { z } from 'zod'

export const LOAN_AMOUNT_MIN = 1000
export const LOAN_AMOUNT_MAX = 20000000

export const loanAmountSchema = z
  .number({
    invalid_type_error: 'Loan amount must be a number',
    required_error: 'Loan amount is required',
  })
  .min(LOAN_AMOUNT_MIN, 'Loan amount must be at least $1,000')
  .max(LOAN_AMOUNT_MAX, 'Loan amount cannot exceed $20,000,000')

export const loanPurposeSchema = z
  .string({
    invalid_type_error: 'Loan purpose must be a string',
    required_error: 'Loan purpose is required',
  })
  .min(1, 'Please select a loan purpose')

export const repaymentPeriodSchema = z
  .number({
    invalid_type_error: 'Repayment period must be a number',
    required_error: 'Repayment period is required',
  })
  .min(1, 'Please select a repayment period')
  .positive('Repayment period must be positive')

export const loanTermSchema = z
  .number({
    invalid_type_error: 'Loan term must be a number',
    required_error: 'Loan term is required',
  })
  .min(1, 'Please select a loan term')
  .positive('Loan term must be positive')

/**
 * Complete calculator form schema — validates all required fields together.
 * @type {z.ZodSchema}
 */
export const calculatorFormSchema = z.object({
  loanAmount: loanAmountSchema,
  loanPurpose: loanPurposeSchema,
  repaymentPeriod: repaymentPeriodSchema,
  loanTerm: loanTermSchema,
})

/** Validates the full form object. Returns { valid, data, errors }. */
export const validateFormInput = (data) => {
  const result = calculatorFormSchema.safeParse(data)
  return {
    valid: result.success,
    data: result.data || null,
    errors: result.error?.flatten() || null,
  }
}

/** @returns {{ valid: boolean, error: string|null }} */
export const validateLoanAmount = (amount) => {
  const result = loanAmountSchema.safeParse(amount)
  return { valid: result.success, error: result.error?.issues?.[0]?.message || null }
}

/** @returns {{ valid: boolean, error: string|null }} */
export const validateLoanPurpose = (purpose) => {
  const result = loanPurposeSchema.safeParse(purpose)
  return { valid: result.success, error: result.error?.issues?.[0]?.message || null }
}

/** @returns {{ valid: boolean, error: string|null }} */
export const validateRepaymentPeriod = (period) => {
  const result = repaymentPeriodSchema.safeParse(period)
  return { valid: result.success, error: result.error?.issues?.[0]?.message || null }
}

/** @returns {{ valid: boolean, error: string|null }} */
export const validateLoanTerm = (term) => {
  const result = loanTermSchema.safeParse(term)
  return { valid: result.success, error: result.error?.issues?.[0]?.message || null }
}

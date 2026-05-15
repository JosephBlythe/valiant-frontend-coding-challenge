import { z } from 'zod'

/**
 * Loan amount schema validation
 * Requires amount between $1,000 and $20,000,000
 * @type {z.ZodSchema}
 */
export const loanAmountSchema = z
  .number({
    invalid_type_error: 'Loan amount must be a number',
    required_error: 'Loan amount is required',
  })
  .min(1000, 'Loan amount must be at least $1,000')
  .max(20000000, 'Loan amount cannot exceed $20,000,000')

/**
 * Loan purpose schema validation
 * Requires non-empty string value
 * @type {z.ZodSchema}
 */
export const loanPurposeSchema = z
  .string({
    invalid_type_error: 'Loan purpose must be a string',
    required_error: 'Loan purpose is required',
  })
  .min(1, 'Please select a loan purpose')

/**
 * Repayment period schema validation
 * Requires positive number (periods per year)
 * @type {z.ZodSchema}
 */
export const repaymentPeriodSchema = z
  .number({
    invalid_type_error: 'Repayment period must be a number',
    required_error: 'Repayment period is required',
  })
  .min(1, 'Please select a repayment period')
  .positive('Repayment period must be positive')

/**
 * Loan term schema validation
 * Requires positive number (months)
 * @type {z.ZodSchema}
 */
export const loanTermSchema = z
  .number({
    invalid_type_error: 'Loan term must be a number',
    required_error: 'Loan term is required',
  })
  .min(1, 'Please select a loan term')
  .positive('Loan term must be positive')

/**
 * Complete calculator form schema
 * Validates all required fields together
 * @type {z.ZodSchema}
 */
export const calculatorFormSchema = z.object({
  loanAmount: loanAmountSchema,
  loanPurpose: loanPurposeSchema,
  repaymentPeriod: repaymentPeriodSchema,
  loanTerm: loanTermSchema,
})

/**
 * Validates form input against calculator schema
 * @param {object} data - Form data to validate
 * @returns {object} { valid: boolean, data: object|null, errors: object|null }
 */
export const validateFormInput = (data) => {
  const result = calculatorFormSchema.safeParse(data)
  return {
    valid: result.success,
    data: result.data || null,
    errors: result.error?.flatten() || null,
  }
}

/**
 * Validates individual loan amount
 * @param {number} amount - Amount to validate
 * @returns {object} { valid: boolean, error: string|null }
 */
export const validateLoanAmount = (amount) => {
  const result = loanAmountSchema.safeParse(amount)
  return {
    valid: result.success,
    error: result.error?.issues?.[0]?.message || null,
  }
}

/**
 * Validates individual loan purpose
 * @param {string} purpose - Purpose to validate
 * @returns {object} { valid: boolean, error: string|null }
 */
export const validateLoanPurpose = (purpose) => {
  const result = loanPurposeSchema.safeParse(purpose)
  return {
    valid: result.success,
    error: result.error?.issues?.[0]?.message || null,
  }
}

/**
 * Validates individual repayment period
 * @param {number} period - Period to validate
 * @returns {object} { valid: boolean, error: string|null }
 */
export const validateRepaymentPeriod = (period) => {
  const result = repaymentPeriodSchema.safeParse(period)
  return {
    valid: result.success,
    error: result.error?.issues?.[0]?.message || null,
  }
}

/**
 * Validates individual loan term
 * @param {number} term - Term to validate
 * @returns {object} { valid: boolean, error: string|null }
 */
export const validateLoanTerm = (term) => {
  const result = loanTermSchema.safeParse(term)
  return {
    valid: result.success,
    error: result.error?.issues?.[0]?.message || null,
  }
}

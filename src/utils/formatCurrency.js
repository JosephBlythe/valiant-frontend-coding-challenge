/**
 * Formats a numeric value as AUD currency with no decimal places (rounded up).
 * @param {number|null} value - The numeric value to format
 * @returns {string|null} Formatted currency string (e.g. "$1,385") or null
 */
export const formatCurrency = (value) => {
  if (value == null || isNaN(value)) return null
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.ceil(value))
}

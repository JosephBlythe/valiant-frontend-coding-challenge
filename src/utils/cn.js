import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merges Tailwind CSS class names, resolving conflicts intelligently.
 * @param {...(string|undefined|null|boolean|object)} inputs - Class name inputs
 * @returns {string} Merged class string
 */
export const cn = (...inputs) => twMerge(clsx(inputs))

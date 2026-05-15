import { describe, it, expect, beforeAll } from 'vitest'
import { spawn } from 'child_process'

// TODO: Future improvement - Use dotenv to manage API base URL and other environment variables
const API_BASE_URL = 'http://localhost:5001'

let backendProcess = null

/**
 * Start backend server for integration tests
 */
const startBackend = () => {
  return new Promise((resolve, reject) => {
    // Check if port is already in use by attempting to connect
    fetch(`${API_BASE_URL}/loan-purposes`)
      .then(() => {
        // Server is already running
        resolve()
      })
      .catch(() => {
        // Server is not running, start it
        backendProcess = spawn('node', ['./backend/index.js'], {
          cwd: process.cwd(),
          stdio: 'pipe',
          detached: true,
        })

        backendProcess.on('error', (err) => {
          reject(err)
        })

        // Wait for server to start
        const waitForServer = setInterval(async () => {
          try {
            const response = await fetch(`${API_BASE_URL}/loan-purposes`)
            if (response.ok) {
              clearInterval(waitForServer)
              resolve()
            }
          } catch {
            // Server not ready yet
          }
        }, 100)

        // Timeout after 5 seconds
        setTimeout(() => {
          clearInterval(waitForServer)
          reject(new Error('Backend server failed to start within 5 seconds'))
        }, 5000)
      })
  })
}

/**
 * Helper function to fetch from backend with proper error handling
 */
const fetchEndpoint = async (endpoint) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`)
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    return await response.json()
  } catch (error) {
    throw new Error(`Failed to fetch ${endpoint}: ${error.message}`)
  }
}

/**
 * Integration tests for backend endpoints to ensure they return expected data and status codes
 */
describe('Backend Endpoint Integration Tests', () => {
  beforeAll(async () => {
    await startBackend()
  }, 30000)

  describe('GET /loan-purposes', () => {
    it('should return 200 status code', async () => {
      const response = await fetch(`${API_BASE_URL}/loan-purposes`)
      expect(response.status).toBe(200)
    })

    it('should return an array of loan purposes', async () => {
      const data = await fetchEndpoint('/loan-purposes')
      expect(Array.isArray(data)).toBe(true)
      expect(data.length).toBeGreaterThan(0)
    })

    it('should return loan purposes with required properties', async () => {
      const data = await fetchEndpoint('/loan-purposes')
      data.forEach((purpose) => {
        expect(purpose).toHaveProperty('label')
        expect(purpose).toHaveProperty('value')
        expect(purpose).toHaveProperty('annualRate')
      })
    })

    it('should include annualRate as a number', async () => {
      const data = await fetchEndpoint('/loan-purposes')
      data.forEach((purpose) => {
        expect(typeof purpose.annualRate).toBe('number')
        expect(purpose.annualRate).toBeGreaterThanOrEqual(0)
        expect(purpose.annualRate).toBeLessThanOrEqual(1)
      })
    })

    it('should have valid label and value properties', async () => {
      const data = await fetchEndpoint('/loan-purposes')
      data.forEach((purpose) => {
        expect(typeof purpose.label).toBe('string')
        expect(purpose.label.length).toBeGreaterThan(0)
        expect(typeof purpose.value).toBe('string')
        expect(purpose.value.length).toBeGreaterThan(0)
      })
    })

    it('should return correct Content-Type header', async () => {
      const response = await fetch(`${API_BASE_URL}/loan-purposes`)
      expect(response.headers.get('content-type')).toContain('application/json')
    })
  })

  describe('GET /requested-repayment-periods', () => {
    it('should return 200 status code', async () => {
      const response = await fetch(`${API_BASE_URL}/requested-repayment-periods`)
      expect(response.status).toBe(200)
    })

    it('should return an array of repayment periods', async () => {
      const data = await fetchEndpoint('/requested-repayment-periods')
      expect(Array.isArray(data)).toBe(true)
      expect(data.length).toBeGreaterThan(0)
    })

    it('should return repayment periods with required properties', async () => {
      const data = await fetchEndpoint('/requested-repayment-periods')
      data.forEach((period) => {
        expect(period).toHaveProperty('label')
        expect(period).toHaveProperty('value')
      })
    })

    it('should have valid label and numeric value properties', async () => {
      const data = await fetchEndpoint('/requested-repayment-periods')
      data.forEach((period) => {
        expect(typeof period.label).toBe('string')
        expect(period.label.length).toBeGreaterThan(0)
        expect(typeof period.value).toBe('number')
        expect(period.value).toBeGreaterThan(0)
      })
    })

    it('should have reasonable payment period values', async () => {
      const data = await fetchEndpoint('/requested-repayment-periods')
      data.forEach((period) => {
        expect(period.value).toBeLessThanOrEqual(52) // At most weekly
        expect(period.value).toBeGreaterThanOrEqual(1) // At least once a year
      })
    })

    it('should return correct Content-Type header', async () => {
      const response = await fetch(`${API_BASE_URL}/requested-repayment-periods`)
      expect(response.headers.get('content-type')).toContain('application/json')
    })
  })

  describe('GET /requested-term-months', () => {
    it('should return 200 status code', async () => {
      const response = await fetch(`${API_BASE_URL}/requested-term-months`)
      expect(response.status).toBe(200)
    })

    it('should return an array of term options', async () => {
      const data = await fetchEndpoint('/requested-term-months')
      expect(Array.isArray(data)).toBe(true)
      expect(data.length).toBeGreaterThan(0)
    })

    it('should return term options with required properties', async () => {
      const data = await fetchEndpoint('/requested-term-months')
      data.forEach((term) => {
        expect(term).toHaveProperty('label')
        expect(term).toHaveProperty('value')
      })
    })

    it('should have valid label and numeric value properties', async () => {
      const data = await fetchEndpoint('/requested-term-months')
      data.forEach((term) => {
        expect(typeof term.label).toBe('string')
        expect(term.label.length).toBeGreaterThan(0)
        expect(typeof term.value).toBe('number')
        expect(term.value).toBeGreaterThan(0)
      })
    })

    it('should have term values representing months', async () => {
      const data = await fetchEndpoint('/requested-term-months')
      data.forEach((term) => {
        // Term should be between 1 month and 30 years (360 months)
        expect(term.value).toBeGreaterThanOrEqual(1)
        expect(term.value).toBeLessThanOrEqual(360)
      })
    })

    it('should return correct Content-Type header', async () => {
      const response = await fetch(`${API_BASE_URL}/requested-term-months`)
      expect(response.headers.get('content-type')).toContain('application/json')
    })
  })

  describe('API Response Consistency', () => {
    it('should respond consistently across multiple requests', async () => {
      const firstCall = await fetchEndpoint('/loan-purposes')
      const secondCall = await fetchEndpoint('/loan-purposes')
      expect(firstCall).toEqual(secondCall)
    })

    it('should have no empty arrays', async () => {
      const purposes = await fetchEndpoint('/loan-purposes')
      const periods = await fetchEndpoint('/requested-repayment-periods')
      const terms = await fetchEndpoint('/requested-term-months')

      expect(purposes.length).toBeGreaterThan(0)
      expect(periods.length).toBeGreaterThan(0)
      expect(terms.length).toBeGreaterThan(0)
    })
  })

  describe('CORS Support', () => {
    it('should include CORS headers in response', async () => {
      const response = await fetch(`${API_BASE_URL}/loan-purposes`, {
        headers: {
          Origin: 'http://localhost:3000',
        },
      })
      expect(response.headers.get('access-control-allow-origin')).toBeTruthy()
    })
  })
})

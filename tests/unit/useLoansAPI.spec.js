import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { effectScope } from 'vue'

// Helper: flush microtasks + one macrotask tick so useFetch resolves
const flushAll = () => new Promise((resolve) => setTimeout(resolve, 0))

const mockJsonResponse = (data) =>
  Promise.resolve({
    ok: true,
    status: 200,
    json: () => Promise.resolve(data),
    headers: new Headers({ 'content-type': 'application/json' }),
    clone: function () { return this },
  })

const mockErrorResponse = () =>
  Promise.resolve({
    ok: false,
    status: 500,
    statusText: 'Internal Server Error',
    json: () => Promise.resolve({ message: 'Internal Server Error' }),
    headers: new Headers({ 'content-type': 'application/json' }),
    clone: function () { return this },
  })

const MOCK_PURPOSES = [{ value: 'general', label: 'General', annualRate: 0.1 }]
const MOCK_PERIODS = [{ value: 12, label: 'Monthly' }]
const MOCK_TERMS = [{ value: 24, label: '2 Years' }]

describe('useLoansAPI', () => {
  let fetchSpy

  beforeEach(() => {
    fetchSpy = vi.spyOn(globalThis, 'fetch').mockImplementation((url) => {
      if (url.includes('/loan-purposes')) return mockJsonResponse(MOCK_PURPOSES)
      if (url.includes('/requested-repayment-periods')) return mockJsonResponse(MOCK_PERIODS)
      if (url.includes('/requested-term-months')) return mockJsonResponse(MOCK_TERMS)
      return mockErrorResponse()
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('returns refs for loanPurposes, repaymentPeriods, and loanTerms', async () => {
    const { useLoansAPI } = await import('@/composables/useLoansAPI')
    let api
    const scope = effectScope()
    scope.run(() => { api = useLoansAPI() })

    await flushAll()

    expect(api).toHaveProperty('loanPurposes')
    expect(api).toHaveProperty('repaymentPeriods')
    expect(api).toHaveProperty('loanTerms')
    scope.stop()
  })

  it('returns loading, errors, and isLoading', async () => {
    const { useLoansAPI } = await import('@/composables/useLoansAPI')
    let api
    const scope = effectScope()
    scope.run(() => { api = useLoansAPI() })

    expect(api).toHaveProperty('loading')
    expect(api).toHaveProperty('errors')
    expect(api).toHaveProperty('isLoading')
    scope.stop()
  })

  it('fetches from all three endpoints', async () => {
    const { useLoansAPI } = await import('@/composables/useLoansAPI')
    const scope = effectScope()
    scope.run(() => { useLoansAPI('http://localhost:5001') })

    await flushAll()

    const calls = fetchSpy.mock.calls.map(([url]) => url)
    expect(calls.some((u) => u.includes('/loan-purposes'))).toBe(true)
    expect(calls.some((u) => u.includes('/requested-repayment-periods'))).toBe(true)
    expect(calls.some((u) => u.includes('/requested-term-months'))).toBe(true)
    scope.stop()
  })

  it('populates loanPurposes with fetched data', async () => {
    const { useLoansAPI } = await import('@/composables/useLoansAPI')
    let api
    const scope = effectScope()
    scope.run(() => { api = useLoansAPI() })

    await flushAll()

    expect(api.loanPurposes.value).toEqual(MOCK_PURPOSES)
    scope.stop()
  })

  it('populates repaymentPeriods with fetched data', async () => {
    const { useLoansAPI } = await import('@/composables/useLoansAPI')
    let api
    const scope = effectScope()
    scope.run(() => { api = useLoansAPI() })

    await flushAll()

    expect(api.repaymentPeriods.value).toEqual(MOCK_PERIODS)
    scope.stop()
  })

  it('populates loanTerms with fetched data', async () => {
    const { useLoansAPI } = await import('@/composables/useLoansAPI')
    let api
    const scope = effectScope()
    scope.run(() => { api = useLoansAPI() })

    await flushAll()

    expect(api.loanTerms.value).toEqual(MOCK_TERMS)
    scope.stop()
  })

  it('loanPurposes data is in expected format (label, value, annualRate)', async () => {
    const { useLoansAPI } = await import('@/composables/useLoansAPI')
    let api
    const scope = effectScope()
    scope.run(() => { api = useLoansAPI() })

    await flushAll()

    const purpose = api.loanPurposes.value[0]
    expect(purpose).toHaveProperty('label')
    expect(purpose).toHaveProperty('value')
    expect(purpose).toHaveProperty('annualRate')
    expect(typeof purpose.annualRate).toBe('number')
    scope.stop()
  })

  it('isLoading becomes false after data loads', async () => {
    const { useLoansAPI } = await import('@/composables/useLoansAPI')
    let api
    const scope = effectScope()
    scope.run(() => { api = useLoansAPI() })

    await flushAll()

    expect(api.isLoading.value).toBe(false)
    scope.stop()
  })

  it('handles network errors gracefully without throwing exception', async () => {
    vi.restoreAllMocks()
    vi.spyOn(globalThis, 'fetch').mockImplementation(mockErrorResponse)

    const { useLoansAPI } = await import('@/composables/useLoansAPI')
    const scope = effectScope()

    await expect(
      new Promise((resolve) => {
        scope.run(() => { useLoansAPI() })
        flushAll().then(resolve)
      })
    ).resolves.not.toThrow()

    scope.stop()
  })

  it('exposes error state for failed requests', async () => {
    vi.restoreAllMocks()
    vi.spyOn(globalThis, 'fetch').mockImplementation(mockErrorResponse)

    const { useLoansAPI } = await import('@/composables/useLoansAPI')
    let api
    const scope = effectScope()
    scope.run(() => { api = useLoansAPI() })

    await flushAll()

    expect(api.errors.value.purposes).toBeTruthy()
    expect(api.errors.value.periods).toBeTruthy()
    expect(api.errors.value.terms).toBeTruthy()
    scope.stop()
  })
})

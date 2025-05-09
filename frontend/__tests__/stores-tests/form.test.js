// tests/stores/form.spec.js
import { setActivePinia, createPinia } from 'pinia'
import { useFormStore } from '@/stores/form'
import { vi, describe, it, expect, beforeEach } from 'vitest'

// Mock the API module
vi.mock('@/services/api', () => ({
  default: {
    post: vi.fn()
  }
}))
import api from '@/services/api'

describe('useFormStore', () => {
  let store

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useFormStore()
    vi.clearAllMocks()
  })

  it('should have initial state', () => {
    expect(store.loading).toBe(false)
    expect(store.error).toBe(null)
    expect(store.success).toBe(null)
  })

  it('submitForm - success scenario', async () => {
    const mockResponse = { data: { id: 1, name: 'John' } }
    api.post.mockResolvedValue(mockResponse)

    const onSuccess = vi.fn()
    const endpoint = '/addStudent'
    const data = { name: 'John' }

    await store.submitForm(endpoint, data, onSuccess)

    expect(api.post).toHaveBeenCalledWith(endpoint, data)
    expect(store.success).toBe('Submitted successfully')
    expect(store.error).toBe(null)
    expect(store.loading).toBe(false)
    expect(onSuccess).toHaveBeenCalledWith(mockResponse.data)
  })

  it('submitForm - failure scenario', async () => {
    api.post.mockRejectedValue({
      response: { data: { message: 'Something went wrong' } }
    })

    const endpoint = '/addStudent'
    const data = { name: 'John' }

    await store.submitForm(endpoint, data)

    expect(api.post).toHaveBeenCalledWith(endpoint, data)
    expect(store.success).toBe(null)
    expect(store.error).toBe('Something went wrong')
    expect(store.loading).toBe(false)
  })

  it('submitForm - failure scenario with no response message', async () => {
    api.post.mockRejectedValue({})

    const endpoint = '/addStudent'
    const data = { name: 'John' }

    await store.submitForm(endpoint, data)

    expect(api.post).toHaveBeenCalledWith(endpoint, data)
    expect(store.success).toBe(null)
    expect(store.error).toBe('Submission failed')
    expect(store.loading).toBe(false)
  })

  it('validateForm returns valid=true when all fields are filled', () => {
    const obj = { name: 'John', age: 20 }
    const fields = ['name', 'age']

    const result = store.validateForm(obj, fields)

    expect(result.valid).toBe(true)
    expect(result.errors).toEqual({})
  })

  it('validateForm returns errors for missing fields', () => {
    const obj = { name: '', age: 20 }
    const fields = ['name', 'age', 'email']

    const result = store.validateForm(obj, fields)

    expect(result.valid).toBe(false)
    expect(result.errors).toEqual({
      name: 'name is required',
      email: 'email is required'
    })
  })

  it('clearStatus resets state', () => {
    store.loading = true
    store.error = 'error'
    store.success = 'success'

    store.clearStatus()

    expect(store.loading).toBe(false)
    expect(store.error).toBe(null)
    expect(store.success).toBe(null)
  })
})

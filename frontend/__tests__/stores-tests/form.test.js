// Tests for stores/form.js
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useFormStore } from '@/stores/form'
import api from '@/services/api'
import DOMPurify from 'dompurify'

// Mock the API module
vi.mock('@/services/api', () => ({
  default: {
    post: vi.fn()
  }
}))

// Mock DOMPurify
vi.mock('dompurify', () => ({
  default: {
    sanitize: vi.fn(str => str.replace(/<script>.*?<\/script>/g, ''))
  }
}))

describe('Form Store', () => {
  let store

  beforeEach(() => {
    // Create a fresh pinia and make it active so it's automatically picked
    // up by any useStore() call without having to pass it to it
    setActivePinia(createPinia())
    store = useFormStore()
    
    // Reset all mocks before each test
    vi.clearAllMocks()
  })

  describe('Initial State', () => {
    it('has initial state set correctly', () => {
      expect(store.loading).toBe(false)
      expect(store.error).toBeNull()
      expect(store.success).toBeNull()
      expect(store.errors).toEqual({})
    })
  })

  describe('submitForm', () => {
    it('submits form data successfully', async () => {
      // Setup
      const mockData = { name: 'Test User', email: 'test@example.com' }
      const mockResponse = { id: 1, ...mockData }
      api.post.mockResolvedValue({ data: mockResponse })
      const onSuccessMock = vi.fn()

      // Execute
      await store.submitForm('/users', mockData, onSuccessMock)

      // Verify
      expect(api.post).toHaveBeenCalledWith('/users', mockData)
      expect(store.loading).toBe(false)
      expect(store.error).toBeNull()
      expect(store.success).toBe('Submitted successfully')
      expect(onSuccessMock).toHaveBeenCalledWith(mockResponse)
    })

    it('handles API errors properly', async () => {
      // Setup - simulate API error
      const mockData = { name: 'Test User' }
      const mockError = new Error('API Error')
      mockError.response = { data: { message: 'Invalid data provided' } }
      api.post.mockRejectedValue(mockError)

      // Execute
      await store.submitForm('/users', mockData)

      // Verify
      expect(api.post).toHaveBeenCalledWith('/users', mockData)
      expect(store.loading).toBe(false)
      expect(store.error).toBe('Invalid data provided')
      expect(store.success).toBeNull()
    })

    it('sets generic error message if API error has no specific message', async () => {
      // Setup - simulate generic error
      api.post.mockRejectedValue(new Error('Network error'))

      // Execute
      await store.submitForm('/users', {})

      // Verify
      expect(store.loading).toBe(false)
      expect(store.error).toBe('Submission failed')
    })
  })

  describe('validateWithSchema', () => {
    it('returns true for valid data', async () => {
      // Setup - mock schema that always validates successfully
      const mockSchema = {
        validate: vi.fn().mockResolvedValue(true)
      }
      const data = { field: 'value' }

      // Execute
      const result = await store.validateWithSchema(data, mockSchema)

      // Verify
      expect(result).toBe(true)
      expect(store.errors).toEqual({})
      expect(mockSchema.validate).toHaveBeenCalledWith(data, { abortEarly: false })
    })

    it('returns false and sets errors for invalid data', async () => {
      // Setup - mock schema that fails validation
      const mockValidationError = {
        inner: [
          { path: 'email', message: 'Email is required' },
          { path: 'password', message: 'Password must be at least 6 characters' }
        ]
      }
      const mockSchema = {
        validate: vi.fn().mockRejectedValue(mockValidationError)
      }
      const data = { field: 'value' }

      // Execute
      const result = await store.validateWithSchema(data, mockSchema)

      // Verify
      expect(result).toBe(false)
      expect(store.errors).toEqual({
        email: 'Email is required',
        password: 'Password must be at least 6 characters'
      })
    })
  })

  describe('sanitizeInputs', () => {
    it('sanitizes string values in an object', () => {
      // Setup
      const inputData = {
        name: 'Test User <script>alert("XSS")</script>',
        age: 30,
        bio: '<script>malicious code</script> Safe content'
      }

      // Execute
      const result = store.sanitizeInputs(inputData)

      // Verify
      expect(DOMPurify.sanitize).toHaveBeenCalledTimes(2) // Only called for the two string properties
      expect(result).toEqual({
        name: 'Test User ',
        age: 30,
        bio: ' Safe content'
      })
    })

    it('preserves non-string values without sanitizing', () => {
      // Setup
      const inputData = {
        age: 30,
        active: true,
        scores: [95, 87, 92]
      }

      // Execute
      const result = store.sanitizeInputs(inputData)

      // Verify
      expect(DOMPurify.sanitize).not.toHaveBeenCalled()
      expect(result).toEqual(inputData) // Should be the same as input
    })
  })

  describe('clearStatus', () => {
    it('resets all status-related state', () => {
      // Setup - set some initial state
      store.loading = true
      store.error = 'Previous error'
      store.success = 'Previous success'
      store.errors = { field: 'Field error' }

      // Execute
      store.clearStatus()

      // Verify
      expect(store.loading).toBe(false)
      expect(store.error).toBeNull()
      expect(store.success).toBeNull()
      expect(store.errors).toEqual({})
    })
  })

  // Testing the full workflow
  describe('Integration', () => {
    it('follows the complete form submission workflow', async () => {
      // Setup
      const mockSchema = {
        validate: vi.fn().mockResolvedValue(true)
      }
      const rawData = { name: 'User <script>alert(1)</script>', email: 'user@example.com' }
      const sanitizedData = { name: 'User ', email: 'user@example.com' }
      api.post.mockResolvedValue({ data: { id: 1 } })

      // Execute - validate, sanitize then submit
      const isValid = await store.validateWithSchema(rawData, mockSchema)
      expect(isValid).toBe(true)
      
      const cleanData = store.sanitizeInputs(rawData)
      expect(cleanData).toEqual(sanitizedData)
      
      await store.submitForm('/users', cleanData)

      // Verify
      expect(api.post).toHaveBeenCalledWith('/users', sanitizedData)
      expect(store.success).toBe('Submitted successfully')
    })
  })
})
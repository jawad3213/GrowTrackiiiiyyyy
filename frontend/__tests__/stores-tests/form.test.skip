// stores/__tests__/form.test.js
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useFormStore } from '../../src/stores/form'
import api from '@/services/api'
import DOMPurify from 'dompurify'

// Mock dependencies
vi.mock('@/services/api')
vi.mock('dompurify')

describe('useFormStore', () => {
  let store
  let mockApi
  let mockDOMPurify

  beforeEach(() => {
    // Create a fresh pinia instance for each test
    setActivePinia(createPinia())
    store = useFormStore()
    
    // Setup mocks
    mockApi = vi.mocked(api)
    mockDOMPurify = vi.mocked(DOMPurify)
    
    // Reset all mocks
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  describe('Initial State', () => {
    it('should initialize with correct default values', () => {
      expect(store.loading).toBe(false)
      expect(store.error).toBe(null)
      expect(store.success).toBe(null)
      expect(store.errors).toEqual({})
      expect(store.SelectedObj).toBe(null)
    })
  })

  describe('submitForm', () => {
    it('should successfully submit form and update state', async () => {
      // Arrange
      const mockResponse = { data: { id: 1, name: 'Test User' } }
      const mockOnSuccess = vi.fn()
      mockApi.post.mockResolvedValue(mockResponse)

      const endpoint = '/addStudent'
      const data = { name: 'John Doe', email: 'john@example.com' }

      // Act
      await store.submitForm(endpoint, data, mockOnSuccess)

      // Assert
      expect(mockApi.post).toHaveBeenCalledWith(endpoint, data)
      expect(store.loading).toBe(false)
      expect(store.success).toBe('Submitted successfully')
      expect(store.error).toBe(null)
      expect(store.errors).toBe(null)
      expect(mockOnSuccess).toHaveBeenCalledWith(mockResponse.data)
    })

    it('should handle API errors with validation errors', async () => {
      // Arrange
      const mockError = {
        response: {
          data: {
            message: 'Validation failed',
            errors: [
              { path: 'name', msg: 'Name is required' },
              { path: 'email', msg: 'Invalid email format' }
            ]
          }
        }
      }
      mockApi.post.mockRejectedValue(mockError)

      const endpoint = '/addStudent'
      const data = { name: '', email: 'invalid-email' }

      // Act
      await store.submitForm(endpoint, data)

      // Assert
      expect(store.loading).toBe(false)
      expect(store.error).toBe('Validation failed')
      expect(store.success).toBe(null)
      expect(store.errors).toEqual({
        name: 'Name is required',
        email: 'Invalid email format'
      })
    })

    it('should handle API errors with error field', async () => {
      // Arrange
      const mockError = {
        response: {
          data: {
            error: 'Database connection failed'
          }
        }
      }
      mockApi.post.mockRejectedValue(mockError)

      // Act
      await store.submitForm('/addStudent', {})

      // Assert
      expect(store.error).toBe('Database connection failed')
      expect(store.errors).toEqual({})
    })

    it('should handle generic errors', async () => {
      // Arrange
      const mockError = {
        response: {
          data: {}
        }
      }
      mockApi.post.mockRejectedValue(mockError)

      // Act
      await store.submitForm('/addStudent', {})

      // Assert
      expect(store.error).toBe("Couldn't submit the form. Please retry again later")
    })

    it('should handle network errors', async () => {
      // Arrange
      const mockError = new Error('Network Error')
      mockApi.post.mockRejectedValue(mockError)

      // Act
      await store.submitForm('/addStudent', {})

      // Assert
      expect(store.error).toBe("Couldn't submit the form. Please retry again later")
    })

    it('should work without onSuccess callback', async () => {
      // Arrange
      const mockResponse = { data: { id: 1 } }
      mockApi.post.mockResolvedValue(mockResponse)

      // Act
      await store.submitForm('/addStudent', {})

      // Assert
      expect(store.success).toBe('Submitted successfully')
      expect(store.error).toBe(null)
    })

    it('should set loading state correctly during execution', async () => {
      // Arrange
      let loadingDuringExecution = false
      mockApi.post.mockImplementation(() => {
        loadingDuringExecution = store.loading
        return Promise.resolve({ data: {} })
      })

      // Act
      await store.submitForm('/addStudent', {})

      // Assert
      expect(loadingDuringExecution).toBe(true)
      expect(store.loading).toBe(false)
    })
  })

  describe('Update', () => {
    it('should successfully update and call onSuccess', async () => {
      // Arrange
      const mockResponse = { data: { id: 1, name: 'Updated User' } }
      const mockOnSuccess = vi.fn()
      mockApi.patch.mockResolvedValue(mockResponse)

      const endpoint = '/updateStudent/1'
      const data = { name: 'Updated Name' }

      // Act
      await store.Update(endpoint, data, mockOnSuccess)

      // Assert
      expect(mockApi.patch).toHaveBeenCalledWith(endpoint, data)
      expect(store.loading).toBe(false)
      expect(store.success).toBe('Submitted successfully')
      expect(store.error).toBe(null)
      expect(store.errors).toBe(null)
      expect(mockOnSuccess).toHaveBeenCalledWith(mockResponse.data)
    })

    it('should handle update errors', async () => {
      // Arrange
      const mockError = {
        response: {
          data: {
            message: 'Update failed',
            errors: [
              { path: 'name', msg: 'Name cannot be empty' }
            ]
          }
        }
      }
      mockApi.patch.mockRejectedValue(mockError)

      // Act
      await store.Update('/updateStudent/1', { name: '' })

      // Assert
      expect(store.error).toBe('Update failed')
      expect(store.errors).toEqual({
        name: 'Name cannot be empty'
      })
    })
  })

  describe('validateWithSchema', () => {
    it('should return true for valid data', async () => {
      // Arrange
      const mockSchema = {
        validate: vi.fn().mockResolvedValue(true)
      }
      const data = { name: 'John', email: 'john@example.com' }

      // Act
      const result = await store.validateWithSchema(data, mockSchema)

      // Assert
      expect(result).toBe(true)
      expect(store.errors).toEqual({})
      expect(mockSchema.validate).toHaveBeenCalledWith(data, { abortEarly: false })
    })

    it('should return false and set errors for invalid data', async () => {
      // Arrange
      const mockError = {
        inner: [
          { path: 'name', message: 'Name is required' },
          { path: 'email', message: 'Email is invalid' }
        ]
      }
      const mockSchema = {
        validate: vi.fn().mockRejectedValue(mockError)
      }
      const data = { name: '', email: 'invalid' }

      // Act
      const result = await store.validateWithSchema(data, mockSchema)

      // Assert
      expect(result).toBe(false)
      expect(store.errors).toEqual({
        name: 'Name is required',
        email: 'Email is invalid'
      })
    })
  })

  describe('sanitizeInputs', () => {
    it('should sanitize string values', () => {
      // Arrange
      mockDOMPurify.sanitize.mockImplementation((input) => `cleaned_${input}`)
      const input = {
        name: '<script>alert("xss")</script>John',
        age: 25,
        active: true
      }

      // Act
      const result = store.sanitizeInputs(input)

      // Assert
      expect(mockDOMPurify.sanitize).toHaveBeenCalledWith('<script>alert("xss")</script>John')
      expect(result).toEqual({
        name: 'cleaned_<script>alert("xss")</script>John',
        age: 25,
        active: true
      })
    })

    it('should not sanitize non-string values', () => {
      // Arrange
      const input = {
        count: 42,
        isActive: false,
        tags: ['tag1', 'tag2']
      }

      // Act
      const result = store.sanitizeInputs(input)

      // Assert
      expect(mockDOMPurify.sanitize).not.toHaveBeenCalled()
      expect(result).toEqual(input)
    })

    it('should handle empty object', () => {
      // Act
      const result = store.sanitizeInputs({})

      // Assert
      expect(result).toEqual({})
    })
  })

  describe('clearStatus', () => {
    it('should reset all state values', () => {
      // Arrange - set some values first
      store.loading = true
      store.error = 'Some error'
      store.success = 'Success message'
      store.errors = { name: 'Error message' }

      // Act
      store.clearStatus()

      // Assert
      expect(store.loading).toBe(false)
      expect(store.error).toBe(null)
      expect(store.success).toBe(null)
      expect(store.errors).toEqual({})
    })
  })

  describe('SelectedObj', () => {
    it('should allow setting and getting SelectedObj', () => {
      // Arrange
      const testObj = { id: 1, name: 'Test Object' }

      // Act
      store.SelectedObj = testObj

      // Assert
      expect(store.SelectedObj).toEqual(testObj)
    })

    it('should start as null', () => {
      expect(store.SelectedObj).toBe(null)
    })
  })

  describe('Integration Tests', () => {
    it('should handle complete form submission workflow', async () => {
      // Arrange
      const mockResponse = { data: { id: 1, name: 'John Doe' } }
      mockApi.post.mockResolvedValue(mockResponse)
      
      const mockSchema = {
        validate: vi.fn().mockResolvedValue(true)
      }
      
      mockDOMPurify.sanitize.mockImplementation((input) => input.replace(/<[^>]*>/g, ''))

      const rawData = { name: '<b>John Doe</b>', email: 'john@example.com' }

      // Act
      const isValid = await store.validateWithSchema(rawData, mockSchema)
      expect(isValid).toBe(true)

      const sanitizedData = store.sanitizeInputs(rawData)
      await store.submitForm('/addStudent', sanitizedData)

      // Assert
      expect(store.success).toBe('Submitted successfully')
      expect(store.error).toBe(null)
      expect(mockApi.post).toHaveBeenCalledWith('/addStudent', {
        name: 'John Doe',
        email: 'john@example.com'
      })
    })
  })
})
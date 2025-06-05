import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useProfStore } from '@/stores/Prof'

// Mock the API module
vi.mock('@/services/api', () => ({
  default: {
    get: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn()
  }
}))

import api from '@/services/api'

describe('Professor Store', () => {
  let store

  beforeEach(() => {
    // Create a fresh pinia instance for each test
    setActivePinia(createPinia())
    store = useProfStore()
    
    // Clear all mocks before each test
    vi.clearAllMocks()
  })

  describe('Initial State', () => {
    it('should initialize with correct default values', () => {
      expect(store.loading).toBe(false)
      expect(store.error).toBe(null)
      expect(store.success).toBe(null)
      expect(store.errors).toEqual({})
    })
  })

  describe('GetProfByCin', () => {
    it('should fetch professor by CIN successfully', async () => {
      const mockData = { id: 1, name: 'John Doe', cin: '12345' }
      api.get.mockResolvedValue({ data: mockData })

      const result = await store.GetProfByCin('12345')

      expect(api.get).toHaveBeenCalledWith('/admin/professors/search?cin=12345')
      expect(store.loading).toBe(false)
      expect(store.success).toBe(true)
      expect(store.error).toBe(null)
      expect(store.errors).toBe(null)
      expect(result).toEqual(mockData)
    })

    it('should handle API error with custom message', async () => {
      const errorResponse = {
        response: {
          data: {
            message: 'Professor not found'
          }
        }
      }
      api.get.mockRejectedValue(errorResponse)

      const result = await store.GetProfByCin('invalid')

      expect(store.loading).toBe(false)
      expect(store.success).toBe(false)
      expect(store.error).toBe('Professor not found')
      expect(result).toBeUndefined()
    })

    it('should handle API error with default message', async () => {
      const errorResponse = { response: {} }
      api.get.mockRejectedValue(errorResponse)

      await store.GetProfByCin('12345')

      expect(store.error).toBe("Couldn't fetch the Prof. Please retry again later")
      expect(store.success).toBe(false)
    })

    it('should handle network error', async () => {
      api.get.mockRejectedValue(new Error('Network error'))

      await store.GetProfByCin('12345')

      expect(store.error).toBe("Couldn't fetch the Prof. Please retry again later")
      expect(store.success).toBe(false)
    })
  })

  describe('updateProf', () => {
    it('should update professor successfully', async () => {
      api.patch.mockResolvedValue({})

      await store.updateProf(1, { name: 'Updated Name' })

      expect(api.patch).toHaveBeenCalledWith('/admin/professors/1', { name: 'Updated Name' })
      expect(store.loading).toBe(false)
      expect(store.success).toBe(true)
      expect(store.error).toBe(null)
      expect(store.errors).toBe(null)
    })

    it('should handle update error', async () => {
      const errorResponse = {
        response: {
          data: {
            error: 'Validation failed'
          }
        }
      }
      api.patch.mockRejectedValue(errorResponse)

      await store.updateProf(1, { name: 'Invalid' })

      expect(store.loading).toBe(false)
      expect(store.success).toBe(false)
      expect(store.error).toBe('Validation failed')
    })
  })

  describe('deleteProf', () => {
    it('should delete professor successfully', async () => {
      api.delete.mockResolvedValue({})

      await store.deleteProf(1)

      expect(api.delete).toHaveBeenCalledWith('/admin/professors/1')
      expect(store.loading).toBe(false)
      expect(store.success).toBe(true)
      expect(store.error).toBe(null)
      expect(store.errors).toBe(null)
    })

    it('should handle delete error', async () => {
      const errorResponse = {
        response: {
          data: {
            message: 'Cannot delete professor'
          }
        }
      }
      api.delete.mockRejectedValue(errorResponse)

      await store.deleteProf(1)

      expect(store.loading).toBe(false)
      expect(store.success).toBe(false)
      expect(store.error).toBe('Cannot delete professor')
    })
  })

  describe('NumberOfProfs', () => {
    it('should get total number of professors successfully', async () => {
      const mockData = { total: 25 }
      api.get.mockResolvedValue({ data: mockData })

      const result = await store.NumberOfProfs()

      expect(api.get).toHaveBeenCalledWith('/admin/professors/total')
      expect(store.loading).toBe(false)
      expect(store.success).toBe(true)
      expect(store.error).toBe(null)
      expect(result).toEqual(mockData)
    })

    it('should handle error when getting total', async () => {
      api.get.mockRejectedValue(new Error('Server error'))

      await store.NumberOfProfs()

      expect(store.loading).toBe(false)
      expect(store.success).toBe(false)
      expect(store.error).toBe('Something went wrong. Please retry again later')
    })
  })

  describe('GetProfByClass', () => {
    it('should fetch professors by class successfully', async () => {
      const mockData = [
        { id: 1, name: 'Prof A', class: 'Math' },
        { id: 2, name: 'Prof B', class: 'Math' }
      ]
      api.get.mockResolvedValue({ data: mockData })

      const result = await store.GetProfByClass('Math')

      expect(api.get).toHaveBeenCalledWith('/admin/professors/class?class=Math')
      expect(store.loading).toBe(false)
      expect(store.success).toBe(true)
      expect(store.error).toBe(null)
      expect(result).toEqual(mockData)
    })

    it('should handle error when fetching by class', async () => {
      api.get.mockRejectedValue(new Error('Not found'))

      await store.GetProfByClass('InvalidClass')

      expect(store.loading).toBe(false)
      expect(store.success).toBe(false)
      expect(store.error).toBe("Couldn't fetch the prof. Please retry again later")
    })
  })

  describe('GetProfBySector', () => {
    it('should fetch professors by sector successfully', async () => {
      const mockData = [
        { id: 1, name: 'Prof A', sector: 'Engineering' },
        { id: 2, name: 'Prof B', sector: 'Engineering' }
      ]
      api.get.mockResolvedValue({ data: mockData })

      const result = await store.GetProfBySector('Engineering')

      expect(api.get).toHaveBeenCalledWith('/admin/professors/sector?sector=Engineering')
      expect(store.loading).toBe(false)
      expect(store.success).toBe(true)
      expect(store.error).toBe(null)
      expect(result).toEqual(mockData)
    })

    it('should handle error when fetching by sector', async () => {
      const errorResponse = {
        response: {
          data: {
            error: 'Invalid sector'
          }
        }
      }
      api.get.mockRejectedValue(errorResponse)

      await store.GetProfBySector('InvalidSector')

      expect(store.loading).toBe(false)
      expect(store.success).toBe(false)
      expect(store.error).toBe('Invalid sector')
    })
  })

  describe('clearStatus', () => {
    it('should reset all status values', () => {
      // Set some values first
      store.loading = true
      store.error = 'Some error'
      store.success = true
      store.errors = { field: 'error' }

      store.clearStatus()

      expect(store.loading).toBe(false)
      expect(store.error).toBe(null)
      expect(store.success).toBe(null)
      expect(store.errors).toEqual({})
    })
  })

  describe('Loading States', () => {
    it('should set loading to true during API calls', async () => {
      // Mock a delayed response
      let resolvePromise
      const promise = new Promise(resolve => {
        resolvePromise = resolve
      })
      api.get.mockReturnValue(promise)

      // Start the async operation
      const operation = store.GetProfByCin('12345')
      
      // Check loading state is true
      expect(store.loading).toBe(true)

      // Resolve the promise and wait for completion
      resolvePromise({ data: {} })
      await operation

      // Check loading state is false
      expect(store.loading).toBe(false)
    })
  })

  describe('Error Handling Edge Cases', () => {
    it('should handle errors without response object', async () => {
      api.get.mockRejectedValue(new Error('Network timeout'))

      await store.GetProfByCin('12345')

      expect(store.error).toBe("Couldn't fetch the Prof. Please retry again later")
    })

    it('should handle errors with empty response data', async () => {
      const errorResponse = {
        response: {
          data: {}
        }
      }
      api.get.mockRejectedValue(errorResponse)

      await store.GetProfByCin('12345')

      expect(store.error).toBe("Couldn't fetch the Prof. Please retry again later")
    })
  })
})
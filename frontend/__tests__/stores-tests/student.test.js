import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useStudentStore } from '@/stores/student'

// Mock the API module
vi.mock('@/services/api', () => ({
  default: {
    get: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn()
  }
}))

import api from '@/services/api'

describe('Student Store - Correct Behavior Tests', () => {
  let store

  beforeEach(() => {
    // Create a fresh pinia instance for each test
    setActivePinia(createPinia())
    store = useStudentStore()
    
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

  describe('getStudentBycin', () => {
    it('should fetch student by CIN successfully', async () => {
      const mockData = { id: 1, name: 'John Doe', cin: '12345' }
      api.get.mockResolvedValue({ data: mockData })

      const result = await store.getStudentBycin('12345')

      expect(api.get).toHaveBeenCalledWith('/admin/students/search', { params: { cin: '12345' } })
      expect(store.loading).toBe(false)
      expect(store.success).toBe(true)
      expect(store.error).toBe(null)
      expect(store.errors).toBe(null)
      expect(result).toEqual(mockData)
    })

    it('should handle API error and set success to false', async () => {
      const errorResponse = {
        response: {
          data: {
            message: 'Student not found'
          }
        }
      }
      api.get.mockRejectedValue(errorResponse)

      const result = await store.getStudentBycin('invalid')

      expect(store.loading).toBe(false)
      expect(store.success).toBe(false) // SHOULD be false on error
      expect(store.error).toBe('Student not found')
      expect(result).toBeUndefined()
    })
  })

  describe('updateStudent', () => {
    it('should manage loading state properly during update', async () => {
      let resolvePromise
      const promise = new Promise(resolve => {
        resolvePromise = resolve
      })
      api.patch.mockReturnValue(promise)

      const operation = store.updateStudent(1, { name: 'Updated Name' })
      
      // SHOULD set loading to true at start
      expect(store.loading).toBe(true)

      resolvePromise({})
      await operation

      expect(store.loading).toBe(false)
      expect(store.success).toBe(true)
    })

    it('should update student successfully with proper loading management', async () => {
      api.patch.mockResolvedValue({})

      await store.updateStudent(1, { name: 'Updated Name' })

      expect(api.patch).toHaveBeenCalledWith('/admin/students/update/1', { name: 'Updated Name' })
      expect(store.loading).toBe(false)
      expect(store.success).toBe(true)
      expect(store.error).toBe(null)
      expect(store.errors).toBe(null)
    })
  })

  describe('deleteStudent', () => {
    it('should delete student successfully', async () => {
      api.delete.mockResolvedValue({})

      await store.deleteStudent(1)

      expect(api.delete).toHaveBeenCalledWith('/admin/students/delete/1')
      expect(store.loading).toBe(false)
      expect(store.success).toBe(true)
      expect(store.error).toBe(null)
      expect(store.errors).toBe(null)
    })

    it('should show correct error message for student deletion', async () => {
      api.delete.mockRejectedValue(new Error('Some error'))

      await store.deleteStudent(1)

      expect(store.error).toBe("Couldn't delete the student. Please retry again later")
      expect(store.success).toBe(false)
    })
  })

  describe('deleteProf', () => {
    it('should delete professor successfully', async () => {
      api.delete.mockResolvedValue({})

      await store.deleteProf(1)

      expect(api.delete).toHaveBeenCalledWith('/admin/professors/delete/1')
      expect(store.loading).toBe(false)
      expect(store.success).toBe(true)
      expect(store.error).toBe(null)
    })

    it('should show CORRECT error message for professor deletion', async () => {
      api.delete.mockRejectedValue(new Error('Some error'))

      await store.deleteProf(1)

      // SHOULD mention "professor" not "student"
      expect(store.error).toBe("Couldn't delete the professor. Please retry again later")
      expect(store.success).toBe(false)
    })
  })

  describe('deleteSupervisor', () => {
    it('should delete supervisor successfully', async () => {
      api.delete.mockResolvedValue({})

      await store.deleteSupervisor(1)

      expect(api.delete).toHaveBeenCalledWith('/admin/supervisors/1')
      expect(store.loading).toBe(false)
      expect(store.success).toBe(true)
      expect(store.error).toBe(null)
    })

    it('should show CORRECT error message for supervisor deletion', async () => {
      api.delete.mockRejectedValue(new Error('Some error'))

      await store.deleteSupervisor(1)

      // SHOULD mention "supervisor" not "student"
      expect(store.error).toBe("Couldn't delete the supervisor. Please retry again later")
      expect(store.success).toBe(false)
    })
  })

  describe('NumberOfStudents', () => {
    it('should manage loading state and return data', async () => {
      const mockData = { total: 100 }
      api.get.mockResolvedValue({ data: mockData })

      let resolvePromise
      const promise = new Promise(resolve => {
        resolvePromise = resolve
      })
      api.get.mockReturnValue(promise)

      const operation = store.NumberOfStudents()
      
      // SHOULD set loading to true
      expect(store.loading).toBe(true)

      resolvePromise({ data: mockData })
      const result = await operation

      expect(api.get).toHaveBeenCalledWith('/admin/students/total')
      expect(store.loading).toBe(false)
      expect(store.success).toBe(true)
      expect(store.error).toBe(null)
      expect(result).toEqual(mockData) // SHOULD return the data
    })

    it('should handle error properly with loading management', async () => {
      api.get.mockRejectedValue(new Error('Server error'))

      await store.NumberOfStudents()

      expect(store.loading).toBe(false)
      expect(store.error).toBe('Something went wrong. Please retry again later')
      expect(store.success).toBe(false)
    })
  })

  describe('GetStudentsByClass', () => {
    it('should fetch students by class with CORRECT API call format', async () => {
      const mockData = [
        { id: 1, name: 'Student A', class: 'Math' },
        { id: 2, name: 'Student B', class: 'Math' }
      ]
      api.get.mockResolvedValue({ data: mockData })

      const result = await store.GetStudentsByClass('Math')

      // SHOULD use proper query params format
      expect(api.get).toHaveBeenCalledWith('/admin/students/class', { params: { class: 'Math' } })
      expect(store.loading).toBe(false)
      expect(store.success).toBe(true)
      expect(store.error).toBe(null)
      expect(result).toEqual(mockData)
    })

    it('should set success to false on error', async () => {
      api.get.mockRejectedValue(new Error('Not found'))

      await store.GetStudentsByClass('InvalidClass')

      expect(store.loading).toBe(false)
      expect(store.success).toBe(false) // SHOULD be false on error
      expect(store.error).toBe("Couldn't fetch the students. Please retry again later")
    })
  })

  describe('GetStudentsBySector', () => {
    it('should fetch students by sector with CORRECT API call format', async () => {
      const mockData = [
        { id: 1, name: 'Student A', sector: 'Engineering' },
        { id: 2, name: 'Student B', sector: 'Engineering' }
      ]
      api.get.mockResolvedValue({ data: mockData })

      const result = await store.GetStudentsBySector('Engineering')

      // SHOULD use proper query params format
      expect(api.get).toHaveBeenCalledWith('/admin/students/sector', { params: { sector: 'Engineering' } })
      expect(store.loading).toBe(false)
      expect(store.success).toBe(true)
      expect(store.error).toBe(null)
      expect(result).toEqual(mockData)
    })

    it('should set success to false on error', async () => {
      api.get.mockRejectedValue(new Error('Invalid sector'))

      await store.GetStudentsBySector('InvalidSector')

      expect(store.loading).toBe(false)
      expect(store.success).toBe(false) // SHOULD be false on error
      expect(store.error).toBe("Couldn't fetch the students. Please retry again later")
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

  describe('Consistent Error Messages', () => {
    it('should have specific error messages for each entity type', async () => {
      // Test student deletion error message
      api.delete.mockRejectedValue(new Error('Generic error'))
      await store.deleteStudent(1)
      expect(store.error).toBe("Couldn't delete the student. Please retry again later")

      // Test professor deletion error message
      store.clearStatus()
      api.delete.mockRejectedValue(new Error('Generic error'))
      await store.deleteProf(1)
      expect(store.error).toBe("Couldn't delete the professor. Please retry again later")

      // Test supervisor deletion error message
      store.clearStatus()
      api.delete.mockRejectedValue(new Error('Generic error'))
      await store.deleteSupervisor(1)
      expect(store.error).toBe("Couldn't delete the supervisor. Please retry again later")
    })
  })

  describe('Loading State Management', () => {
    it('should properly manage loading states for all async operations', async () => {
      const operations = [
        () => store.getStudentBycin('12345'),
        () => store.updateStudent(1, { name: 'test' }),
        () => store.deleteStudent(1),
        () => store.deleteProf(1),
        () => store.deleteSupervisor(1),
        () => store.NumberOfStudents(),
        () => store.GetStudentsByClass('Math'),
        () => store.GetStudentsBySector('Engineering')
      ]

      for (const operation of operations) {
        // Mock delayed response
        let resolvePromise
        const promise = new Promise(resolve => {
          resolvePromise = resolve
        })
        
        // Mock all API methods to return the delayed promise
        api.get.mockReturnValue(promise)
        api.patch.mockReturnValue(promise)
        api.delete.mockReturnValue(promise)

        const asyncOperation = operation()
        
        // Loading should be true during operation
        expect(store.loading).toBe(true)

        // Resolve and complete
        resolvePromise({ data: {} })
        await asyncOperation

        // Loading should be false after completion
        expect(store.loading).toBe(false)

        // Reset for next iteration
        store.clearStatus()
        vi.clearAllMocks()
      }
    })
  })
})
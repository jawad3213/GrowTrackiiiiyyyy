import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useCoachStore } from '@/stores/Coach'
import api from '@/services/api'

// Mock du module API
vi.mock('@/services/api', () => ({
  default: {
    get: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn()
  }
}))

describe('useCoachStore', () => {
  let store

  beforeEach(() => {
    // Créer une nouvelle instance de Pinia pour chaque test
    setActivePinia(createPinia())
    store = useCoachStore()
    
    // Reset tous les mocks
    vi.clearAllMocks()
    
    // Reset l'état du store
    store.clearStatus()
  })

  describe('État initial', () => {
    it('devrait avoir les valeurs par défaut correctes', () => {
      expect(store.loading).toBe(false)
      expect(store.error).toBe(null)
      expect(store.success).toBe(null)
      expect(store.errors).toEqual({})
    })
  })

  describe('GetSupervisorByCin', () => {
    it('devrait récupérer un superviseur avec succès', async () => {
      const mockData = { id: 1, name: 'Test Supervisor', cin: '12345' }
      const mockResponse = { data: mockData }
      api.get.mockResolvedValueOnce(mockResponse)

      const result = await store.GetSupervisorByCin('12345')

      expect(api.get).toHaveBeenCalledWith('/admin/supervisors/search', {
        params: { cin: '12345' }
      })
      expect(store.loading).toBe(false)
      expect(store.success).toBe(true)
      expect(store.error).toBe(null)
      expect(store.errors).toBe(null)
      expect(result).toEqual(mockData)
    })

    it('devrait gérer les erreurs avec message spécifique', async () => {
      const mockError = {
        response: {
          data: {
            message: 'Superviseur non trouvé'
          }
        }
      }
      api.get.mockRejectedValueOnce(mockError)

      const result = await store.GetSupervisorByCin('12345')

      expect(store.loading).toBe(false)
      expect(store.success).toBe(false)
      expect(store.error).toBe('Superviseur non trouvé')
      expect(result).toBeUndefined()
    })

    it('devrait utiliser le message d\'erreur par défaut', async () => {
      const mockError = new Error('Network Error')
      api.get.mockRejectedValueOnce(mockError)

      await store.GetSupervisorByCin('12345')

      expect(store.loading).toBe(false)
      expect(store.success).toBe(false)
      expect(store.error).toBe("Couldn't fetch the supervisor. Please retry again later")
    })
  })

  describe('updateStudent', () => {
    it('devrait mettre à jour un étudiant avec succès', async () => {
      api.patch.mockResolvedValueOnce({})
      
      await store.updateStudent(1, { name: 'John Doe' })

      expect(api.patch).toHaveBeenCalledWith('/admin/professors/1', { name: 'John Doe' })
      expect(store.loading).toBe(false)
      expect(store.success).toBe(true)
      expect(store.error).toBe(null)
      expect(store.errors).toBe(null)
    })

    it('devrait gérer les erreurs lors de la mise à jour', async () => {
      const mockError = {
        response: {
          data: {
            error: 'Validation failed'
          }
        }
      }
      api.patch.mockRejectedValueOnce(mockError)

      await store.updateStudent(1, { name: 'John Doe' })

      expect(store.loading).toBe(false)
      expect(store.success).toBe(false)
      expect(store.error).toBe('Validation failed')
    })

    it('devrait gérer les erreurs sans message spécifique', async () => {
      const mockError = new Error('Network Error')
      api.patch.mockRejectedValueOnce(mockError)

      await store.updateStudent(1, { name: 'John Doe' })

      expect(store.loading).toBe(false)
      expect(store.success).toBe(false)
      expect(store.error).toBe("Couldn't update the student's info. Please retry again later")
    })
  })

  describe('deleteStudent', () => {
    it('devrait supprimer un étudiant avec succès', async () => {
      api.delete.mockResolvedValueOnce({})

      await store.deleteStudent(1)

      expect(api.delete).toHaveBeenCalledWith('/admin/students/1')
      expect(store.loading).toBe(false)
      expect(store.success).toBe(true)
      expect(store.error).toBe(null)
      expect(store.errors).toBe(null)
    })

    it('devrait gérer les erreurs lors de la suppression', async () => {
      const mockError = {
        response: {
          data: {
            message: 'Cannot delete student'
          }
        }
      }
      api.delete.mockRejectedValueOnce(mockError)

      await store.deleteStudent(1)

      expect(store.loading).toBe(false)
      expect(store.success).toBe(false)
      expect(store.error).toBe('Cannot delete student')
    })

    it('devrait gérer les erreurs sans message spécifique', async () => {
      const mockError = new Error('Server Error')
      api.delete.mockRejectedValueOnce(mockError)

      await store.deleteStudent(1)

      expect(store.loading).toBe(false)
      expect(store.success).toBe(false)
      expect(store.error).toBe("Couldn't delete the student. Please retry again later")
    })
  })

  describe('NumberOfStudents', () => {
    it('devrait récupérer le nombre d\'étudiants avec succès', async () => {
      const mockData = { total: 100 }
      const mockResponse = { data: mockData }
      api.get.mockResolvedValueOnce(mockResponse)

      const result = await store.NumberOfStudents()

      expect(api.get).toHaveBeenCalledWith('/admin/students/total')
      expect(store.loading).toBe(false)
      expect(store.success).toBe(true)
      expect(store.error).toBe(null)
      expect(store.errors).toBe(null)
      expect(result).toEqual(mockData)
    })

    it('devrait gérer les erreurs', async () => {
      const mockError = {
        response: {
          data: {
            message: 'Server error'
          }
        }
      }
      api.get.mockRejectedValueOnce(mockError)

      const result = await store.NumberOfStudents()

      expect(store.loading).toBe(false)
      expect(store.success).toBe(false)
      expect(store.error).toBe('Server error')
      expect(result).toBeUndefined()
    })

    it('devrait gérer les erreurs sans message spécifique', async () => {
      const mockError = new Error('Network Error')
      api.get.mockRejectedValueOnce(mockError)

      await store.NumberOfStudents()

      expect(store.loading).toBe(false)
      expect(store.success).toBe(false)
      expect(store.error).toBe('Something went wrong. Please retry again later')
    })
  })

  describe('GetStudentsByClass', () => {
    it('devrait récupérer les étudiants par classe avec succès', async () => {
      const mockData = [
        { id: 1, name: 'Student 1', class: 'ClasseA' },
        { id: 2, name: 'Student 2', class: 'ClasseA' }
      ]
      const mockResponse = { data: mockData }
      api.get.mockResolvedValueOnce(mockResponse)

      const result = await store.GetStudentsByClass('ClasseA')

      expect(api.get).toHaveBeenCalledWith('/admin/students/class', {
        params: { class: 'ClasseA' }
      })
      expect(store.loading).toBe(false)
      expect(store.success).toBe(true)
      expect(store.error).toBe(null)
      expect(store.errors).toBe(null)
      expect(result).toEqual(mockData)
    })

    it('devrait gérer les erreurs', async () => {
      const mockError = {
        response: {
          data: {
            error: 'Class not found'
          }
        }
      }
      api.get.mockRejectedValueOnce(mockError)

      const result = await store.GetStudentsByClass('InvalidClass')

      expect(store.loading).toBe(false)
      expect(store.success).toBe(false)
      expect(store.error).toBe('Class not found')
      expect(result).toBeUndefined()
    })

    it('devrait gérer les erreurs sans message spécifique', async () => {
      const mockError = new Error('Network Error')
      api.get.mockRejectedValueOnce(mockError)

      await store.GetStudentsByClass('ClasseA')

      expect(store.loading).toBe(false)
      expect(store.success).toBe(false)
      expect(store.error).toBe("Couldn't fetch the students. Please retry again later")
    })
  })

  describe('GetStudentsBySector', () => {
    it('devrait récupérer les étudiants par secteur avec succès', async () => {
      const mockData = [
        { id: 1, name: 'Student 1', sector: 'IT' },
        { id: 2, name: 'Student 2', sector: 'IT' }
      ]
      const mockResponse = { data: mockData }
      api.get.mockResolvedValueOnce(mockResponse)

      const result = await store.GetStudentsBySector('IT')

      expect(api.get).toHaveBeenCalledWith('/admin/students/sector', {
        params: { sector: 'IT' }
      })
      expect(store.loading).toBe(false)
      expect(store.success).toBe(true)
      expect(store.error).toBe(null)
      expect(store.errors).toBe(null)
      expect(result).toEqual(mockData)
    })

    it('devrait gérer les erreurs', async () => {
      const mockError = {
        response: {
          data: {
            error: 'Sector not found'
          }
        }
      }
      api.get.mockRejectedValueOnce(mockError)

      const result = await store.GetStudentsBySector('InvalidSector')

      expect(store.loading).toBe(false)
      expect(store.success).toBe(false)
      expect(store.error).toBe('Sector not found')
      expect(result).toBeUndefined()
    })

    it('devrait gérer les erreurs sans message spécifique', async () => {
      const mockError = new Error('Network Error')
      api.get.mockRejectedValueOnce(mockError)

      await store.GetStudentsBySector('IT')

      expect(store.loading).toBe(false)
      expect(store.success).toBe(false)
      expect(store.error).toBe("Couldn't fetch the students. Please retry again later")
    })
  })

  describe('clearStatus', () => {
    it('devrait réinitialiser tous les états', () => {
      // Définir des valeurs initiales
      store.$patch({
        loading: true,
        error: 'Some error',
        success: true,
        errors: { field: 'error' }
      })

      store.clearStatus()

      expect(store.loading).toBe(false)
      expect(store.error).toBe(null)
      expect(store.success).toBe(null)
      expect(store.errors).toEqual({})
    })
  })

  describe('Gestion du loading', () => {
    it('devrait définir loading à true au début des opérations async', async () => {
      let loadingDuringCall = false
      
      api.get.mockImplementationOnce(() => {
        loadingDuringCall = store.loading
        return Promise.resolve({ data: [] })
      })

      await store.GetStudentsByClass('TestClass')

      expect(loadingDuringCall).toBe(true)
      expect(store.loading).toBe(false) // Après completion
    })

    it('devrait remettre loading à false même en cas d\'erreur', async () => {
      const mockError = new Error('Network Error')
      api.get.mockRejectedValueOnce(mockError)

      await store.GetSupervisorByCin('12345')

      expect(store.loading).toBe(false)
    })
  })

  describe('Intégration - Séquence d\'actions', () => {
    it('devrait gérer une séquence d\'actions correctement', async () => {
      // Premier appel réussi
      api.get.mockResolvedValueOnce({ data: [{ id: 1, name: 'Student 1' }] })
      await store.GetStudentsByClass('ClasseA')
      expect(store.success).toBe(true)
      expect(store.error).toBe(null)

      // Deuxième appel échoué
      const mockError = { response: { data: { message: 'Error occurred' } } }
      api.patch.mockRejectedValueOnce(mockError)
      await store.updateStudent(1, { name: 'Updated Name' })
      expect(store.success).toBe(false)
      expect(store.error).toBe('Error occurred')

      // Clear status
      store.clearStatus()
      expect(store.success).toBe(null)
      expect(store.error).toBe(null)
    })
  })
})
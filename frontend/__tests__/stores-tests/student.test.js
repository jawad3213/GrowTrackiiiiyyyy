// tests/stores/student.spec.js
import { setActivePinia, createPinia } from 'pinia'
import { useStudentStore } from '@/stores/student'
import { vi, describe, it, expect, beforeEach } from 'vitest'

// Mock axios
vi.mock('axios', () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
    put: vi.fn(),
    delete: vi.fn()
  }
}))
import axios from 'axios'

describe('useStudentStore', () => {
  let store

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useStudentStore()
    vi.clearAllMocks()
  })

  it('should have initial state', () => {
    expect(store.students).toEqual([])
  })

  it('fetchStudents populates students array', async () => {
    const mockData = [{ id: 1, name: 'Alice' }]
    axios.get.mockResolvedValue({ data: mockData })

    await store.fetchStudents()

    expect(axios.get).toHaveBeenCalledWith('http://localhost:3000/students')
    expect(store.students).toEqual(mockData)
  })

  it('addStudent calls axios.post with correct data', async () => {
    const newStudent = { name: 'Bob' }

    await store.addStudent(newStudent)

    expect(axios.post).toHaveBeenCalledWith('http://localhost:3000/students', newStudent)
  })

  it('getStudentById returns the correct student', async () => {
    const mockStudent = { id: 2, name: 'Charlie' }
    axios.get.mockResolvedValue({ data: mockStudent })

    const result = await store.getStudentById(2)

    expect(axios.get).toHaveBeenCalledWith('http://localhost:3000/students/2')
    expect(result).toEqual(mockStudent)
  })

  it('updateStudent calls axios.put and fetchStudents', async () => {
    const updatedStudent = { name: 'Updated' }
    const mockStudents = [{ id: 1, name: 'Updated' }]
    axios.get.mockResolvedValue({ data: mockStudents })

    await store.updateStudent(1, updatedStudent)

    expect(axios.put).toHaveBeenCalledWith('http://localhost:3000/students/1', updatedStudent)
    expect(axios.get).toHaveBeenCalledWith('http://localhost:3000/students')
    expect(store.students).toEqual(mockStudents)
  })

  it('deleteStudent calls axios.delete and fetchStudents', async () => {
    const mockStudents = []
    axios.get.mockResolvedValue({ data: mockStudents })

    await store.deleteStudent(1)

    expect(axios.delete).toHaveBeenCalledWith('http://localhost:3000/students/1')
    expect(axios.get).toHaveBeenCalledWith('http://localhost:3000/students')
    expect(store.students).toEqual(mockStudents)
  })
})

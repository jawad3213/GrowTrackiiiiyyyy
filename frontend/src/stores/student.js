import { defineStore } from 'pinia'
import axios from 'axios'

export const useStudentStore = defineStore('student', {
  state: () => ({
    students: []
  }),
  actions: {
    async addStudent(student) {
      await axios.post('http://localhost:3000/students', student)
    },
    async fetchStudents() {
      const response = await axios.get('http://localhost:3000/students')
      this.students = response.data
    },
    async getStudentById(id) {
      const response = await axios.get(`http://localhost:3000/students/${id}`)
      return response.data
    },
    async updateStudent(id, updatedStudent) {
      await axios.put(`http://localhost:3000/students/${id}`, updatedStudent)
      await this.fetchStudents()
    },
    async deleteStudent(id) {
      await axios.delete(`http://localhost:3000/students/${id}`)
      await this.fetchStudents()
    }
  }
})

import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/services/api'

export const useCoachStore = defineStore('coach', () => {
  const loading = ref(false)
  const error = ref(null)
  const success = ref(null)
  const errors = ref({})
  
  async function GetSupervisorByCin(cin) {
    loading.value = true
    try {
      const response = await api.get(`/admin/supervisors/search`, {
        params: { cin }
      })
      success.value = true
      errors.value = null
      error.value = null
      return response.data
    }
    catch (err) {
      console.log(err)
      error.value = err.response?.data?.message || err.response?.data?.error || "Couldn't fetch the supervisor. Please retry again later"
      success.value = false
    }
    finally {
      loading.value = false
    }
  }

  async function updateStudent(id, updatedFields) {
    loading.value = true
    try {
      await api.patch(`/admin/professors/${id}`, updatedFields)
      success.value = true
      errors.value = null
      error.value = null
    } 
    catch (err) {
      error.value = err.response?.data?.message || err.response?.data?.error || "Couldn't update the student's info. Please retry again later"
      success.value = false
      console.log(err)
    } 
    finally {
      loading.value = false
    }
  }

  async function deleteStudent(id) {
    loading.value = true
    try {
      await api.delete(`/admin/students/${id}`)
      success.value = true
      errors.value = null
      error.value = null
    }
    catch (err) {
      error.value = err.response?.data?.message || err.response?.data?.error || "Couldn't delete the student. Please retry again later"
      success.value = false
      console.log(err)
    }
    finally {
      loading.value = false
    }
  }

  async function NumberOfStudents() {
    loading.value = true
    try {
      const response = await api.get(`/admin/students/total`)
      success.value = true
      errors.value = null
      error.value = null
      return response.data
    }
    catch (err) {
      error.value = err.response?.data?.message || err.response?.data?.error || "Something went wrong. Please retry again later"
      success.value = false
      console.log(err)
    }
    finally {
      loading.value = false
    }
  }

  async function GetStudentsByClass(classe) {
    loading.value = true
    try {
      const response = await api.get(`/admin/students/class`, {
        params: { class: classe }
      })
      success.value = true
      errors.value = null
      error.value = null
      return response.data
    }
    catch (err) {
      console.log(err)
      error.value = err.response?.data?.message || err.response?.data?.error || "Couldn't fetch the students. Please retry again later"
      success.value = false
    }
    finally {
      loading.value = false
    }
  }

  async function GetStudentsBySector(sector) {
    loading.value = true
    try {
      const response = await api.get(`/admin/students/sector`, {
        params: { sector }
      })
      success.value = true
      errors.value = null
      error.value = null
      return response.data
    }
    catch (err) {
      console.log(err)
      error.value = err.response?.data?.message || err.response?.data?.error || "Couldn't fetch the students. Please retry again later"
      success.value = false
    }
    finally {
      loading.value = false
    }
  }

  function clearStatus() {
    loading.value = false
    error.value = null
    success.value = null
    errors.value = {}
  }

  return {
    loading,
    error,
    success,
    errors,
    GetSupervisorByCin,
    GetStudentsByClass,
    GetStudentsBySector,
    deleteStudent,
    updateStudent,
    NumberOfStudents,
    clearStatus
  }
})
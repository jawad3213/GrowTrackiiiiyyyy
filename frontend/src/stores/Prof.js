import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/services/api'

export const useProfStore = defineStore('prof', () => {
  const loading = ref(false)
  const error = ref(null)
  const success = ref(null)
  const errors = ref({})
  
  async function GetProfByCin(cin) {
    loading.value = true
    try {
      const response = await api.get(`/admin/professors/search?cin=${cin}`)
      success.value = true
      errors.value = null
      error.value = null
      return response.data
    }
    catch (err) {
      console.log(err)
      error.value = err.response?.data?.message || err.response?.data?.error || "Couldn't fetch the Prof. Please retry again later"
      success.value = false
    }
    finally {
      loading.value = false
    }
  }

  async function updateProf(id, updatedFields) {
    loading.value = true
    try {
      await api.patch(`/admin/professors/${id}`, updatedFields)
      success.value = true
      errors.value = null
      error.value = null
    } 
    catch (err) {
      error.value = err.response?.data?.message || err.response?.data?.error || "Couldn't update the Prof's info. Please retry again later"
      success.value = false
      console.log(err)
    } 
    finally {
      loading.value = false
    }
  }

  async function deleteProf(id) {
    loading.value = true
    try {
      await api.delete(`/admin/professors/${id}`)
      success.value = true
      errors.value = null
      error.value = null
    }
    catch (err) {
      error.value = err.response?.data?.message || err.response?.data?.error || "Couldn't delete the Prof. Please retry again later"
      success.value = false
      console.log(err)
    }
    finally {
      loading.value = false
    }
  }

  async function NumberOfProfs() {
    loading.value = true
    try {
      const response = await api.get(`/admin/professors/total`)
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

  async function GetProfByClass(classe) {
    loading.value = true
    try {
      const response = await api.get(`/admin/professors/class?class=${classe}`)
      success.value = true
      errors.value = null
      error.value = null
      return response.data
    }
    catch (err) {
      console.log(err)
      error.value = err.response?.data?.message || err.response?.data?.error || "Couldn't fetch the prof. Please retry again later"
      success.value = false
    }
    finally {
      loading.value = false
    }
  }

  async function GetProfBySector(sector) {
    loading.value = true
    try {
      const response = await api.get(`/admin/professors/sector?sector=${sector}`)
      success.value = true
      errors.value = null
      error.value = null
      return response.data
    }
    catch (err) {
      console.log(err)
      error.value = err.response?.data?.message || err.response?.data?.error || "Couldn't fetch the prof. Please retry again later"
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
    GetProfByClass,
    GetProfBySector,
    GetProfByCin,
    updateProf,
    deleteProf,
    NumberOfProfs,
    clearStatus
  }
})
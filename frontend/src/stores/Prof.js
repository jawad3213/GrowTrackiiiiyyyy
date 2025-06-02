import { defineStore } from 'pinia'
import api from '@/services/api'

export const useStudentStore = defineStore('prof', ()=>{

  const loading = ref(false)
  const error = ref(null)
  const success = ref(null)
  const errors = ref({})
  
  async function GetProfByCin(cin) {
    loading.value = true
      try {
        const response = await api.get(`/admin/professors/search`, cin)
        success.value = true;
        errors.value=null;
        error.value =null;
        return response.data
      }
      catch (error) {
        console.log(error)
        error.value = err.response?.data?.message || err.response?.data?.error || "Couldn't fetch the Profs. Please retry again later"
      }
      finally {
          loading.value = false
      }
  }

    async function updateProf(id, updatedfeilds) {
      try {
        await api.patch(`/admin/professors/${id}`, updatedfeilds)
        success.value = true;
        errors.value=null;
        error.value =null;
      } 
      catch (error) {
        error.value = err.response?.data?.message || err.response?.data?.error || "Couldn't update the Prof's info. Please retry again later"
        success.value = false;
        console.log(error)
      } 
      finally {
        loading.value = false
      }
    }


    async function deleteProf(id) {
      loading.value = true
      try {
        await api.delete(`/admin/professors/${id}`)
        success.value = true;
        errors.value=null;
        error.value =null;
      }
      catch (error) {
        error.value = err.response?.data?.message || err.response?.data?.error || "Couldn't delete the Prof. Please retry again later"
        success.value = false;
        console.log(error)
      }
      finally {
        loading.value = false
      }
      }

    async function NumberOfProfs() {
      try {
        await api.get(`/admin/professors/total`)
      }
      catch (error) {
        error.value = err.response?.data?.message || err.response?.data?.error || "Something went wrong. Please retry again later"
        success.value = false;
        console.log(error)
      }

      }
      async function GetProfByClass(classe) {
      loading.value = true
      try {
        const response = await api.get(`/admin/professors/class`, classe)
        success.value = true;
        errors.value=null;
        error.value =null;
        return response.data
      }
      catch (error) {
        console.log(error)
        error.value = err.response?.data?.message || err.response?.data?.error || "Couldn't fetch the prof. Please retry again later"
      }
      finally {
          loading.value = false
      }
  }

  async function GetProfBySector(sector) {
      loading.value = true
      try {
        const response = await api.get(`/admin/professors/sector`, sector)
        success.value = true;
        errors.value=null;
        error.value =null;
        return response.data
      }
      catch (error) {
        console.log(error)
        error.value = err.response?.data?.message || err.response?.data?.error || "Couldn't fetch the prof. Please retry again later"
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
  }
)
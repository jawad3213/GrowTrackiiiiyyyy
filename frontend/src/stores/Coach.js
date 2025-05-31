import { defineStore } from 'pinia'
import api from '@/services/api'

export const useStudentStore = defineStore('coach', ()=>{

  const loading = ref(false)
  const error = ref(null)
  const success = ref(null)
  const errors = ref({})
  
  async function GetSupervisorByCin(cin) {
    loading.value = true
      try {
        const response = await api.get(`/admin/supervisors/search`, cin)
        success.value = true;
        errors.value=null;
        error.value =null;
        return response.data
      }
      catch (error) {
        console.log(error)
        error.value = err.response?.data?.message || err.response?.data?.error || "Couldn't fetch the students. Please retry again later"
      }
      finally {
          loading.value = false
      }
  }

    async function updateStudent(id, updatedfeilds) {
      try {
        await api.patch(`/admin/professors/${id}`, updatedfeilds)
        success.value = true;
        errors.value=null;
        error.value =null;
      } 
      catch (error) {
        error.value = err.response?.data?.message || err.response?.data?.error || "Couldn't update the student's info. Please retry again later"
        success.value = false;
        console.log(error)
      } 
      finally {
        loading.value = false
      }
    }


    async function deleteStudent(id) {
      loading.value = true
      try {
        await api.delete(`/admin/students/${id}`)
        success.value = true;
        errors.value=null;
        error.value =null;
      }
      catch (error) {
        error.value = err.response?.data?.message || err.response?.data?.error || "Couldn't delete the student. Please retry again later"
        success.value = false;
        console.log(error)
      }
      finally {
        loading.value = false
      }
      }

    async function NumberOfStudents() {
      try {
        await api.get(`/admin/students/total`)
      }
      catch (error) {
        error.value = err.response?.data?.message || err.response?.data?.error || "Something went wrong. Please retry again later"
        success.value = false;
        console.log(error)
      }

      }
      async function GetStudentsByClass(classe) {
      loading.value = true
      try {
        const response = await api.get(`/admin/students/class`, classe)
        success.value = true;
        errors.value=null;
        error.value =null;
        return response.data
      }
      catch (error) {
        console.log(error)
        error.value = err.response?.data?.message || err.response?.data?.error || "Couldn't fetch the students. Please retry again later"
      }
      finally {
          loading.value = false
      }
  }

  async function GetStudentsBySector(sector) {
      loading.value = true
      try {
        const response = await api.get(`/admin/students/sector`, sector)
        success.value = true;
        errors.value=null;
        error.value =null;
        return response.data
      }
      catch (error) {
        console.log(error)
        error.value = err.response?.data?.message || err.response?.data?.error || "Couldn't fetch the students. Please retry again later"
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
    GetStudentsByClass,
    deleteStudent,
    updateStudent,
    getStudentBycin,
    NumberOfStudents,
    clearStatus
  }
  }
)
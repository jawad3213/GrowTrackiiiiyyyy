import { defineStore } from 'pinia'
import api from '@/services/api'
import {ref} from 'vue'

export const useStudentStore = defineStore('student', ()=>{

  const loading = ref(false)
  const error = ref(null)
  const success = ref(null)
  const errors = ref({})
  
  // Get all students and Add student are handeled by form.js in their vues

  async function getStudentBycin(cin) {
    loading.value = true
      try {
        console.log(cin)
        const response = await api.get(`/admin/students/search`,{ params:{cin}})
        success.value = true;
        errors.value=null;
        error.value =null;
        return response.data
      }
      catch (err) {
        console.log(err)
        success.value = false; // Fix: Set success to false on error
        error.value = err.response?.data?.message || err.response?.data?.error || "Couldn't fetch the students. Please retry again later"
      }
      finally {
          loading.value = false
      }
  }

    async function updateStudent(id, updatedfeilds) {
      loading.value = true // Fix: Set loading to true at start
      try {
        await api.patch(`/admin/students/update/${id}`, updatedfeilds)
        success.value = true;
        errors.value=null;
        error.value =null;
      } 
      catch (err) {
        error.value = err.response?.data?.message || err.response?.data?.error || "Couldn't update the student's info. Please retry again later"
        success.value = false;
        console.log(err)
      } 
      finally {
        loading.value = false
      }
    }
    async function deleteStudent(id_member) {
      loading.value = true
      try {
        await api.delete(`/admin/students/delete/${id_member}`)
        success.value = true;
        errors.value=null;
        error.value =null;
      }
      catch (err) {
        error.value = err.response?.data?.message || err.response?.data?.error || "Couldn't delete the student. Please retry again later"
        success.value = false;
        console.log(err)
      }
      finally {
        loading.value = false
      }
      }
    async function deleteProf(id_member) {
      loading.value = true
      try {
        await api.delete(`/admin/professors/delete/${id_member}`)
        success.value = true;
        errors.value=null;
        error.value =null;
      }
      catch (err) {
        // Fix: Correct error message for professor deletion
        error.value = err.response?.data?.message || err.response?.data?.error || "Couldn't delete the professor. Please retry again later"
        success.value = false;
        console.log(err)
      }
      finally {
        loading.value = false
      }
      }
      
    async function deleteSupervisor(id_member) {
      loading.value = true
      try {
        await api.delete(`/admin/supervisors/${id_member}`)
        success.value = true;
        errors.value=null;
        error.value =null;
      }
      catch (err) {
        // Fix: Correct error message for supervisor deletion
        error.value = err.response?.data?.message || err.response?.data?.error || "Couldn't delete the supervisor. Please retry again later"
        success.value = false;
        console.log(err)
      }
      finally {
        loading.value = false
      }
      }

    async function NumberOfStudents() {
      loading.value = true // Fix: Set loading to true at start
      try {
        const response = await api.get(`/admin/students/total`) // Fix: Store response
        success.value = true; // Fix: Set success to true
        errors.value = null;
        error.value = null;
        return response.data // Fix: Return the data
      }
      catch (err) {
        error.value = err.response?.data?.message || err.response?.data?.error || "Something went wrong. Please retry again later"
        success.value = false;
        console.log(err)
      }
      finally {
        loading.value = false // Fix: Set loading to false in finally
      }
    }

    async function GetStudentsByClass(classe) {
      loading.value = true
      try {
        // Fix: Use proper params format
        const response = await api.get(`/admin/students/class`, { params: { class: classe } })
        success.value = true;
        errors.value=null;
        error.value =null;
        return response.data
      }
      catch (err) {
        console.log(err)
        success.value = false; // Fix: Set success to false on error
        error.value = err.response?.data?.message || err.response?.data?.error || "Couldn't fetch the students. Please retry again later"
      }
      finally {
          loading.value = false
      }
  }

  async function GetStudentsBySector(sector) {
      loading.value = true
      try {
        // Fix: Use proper params format
        const response = await api.get(`/admin/students/sector`, { params: { sector: sector } })
        success.value = true;
        errors.value=null;
        error.value =null;
        return response.data
      }
      catch (err) {
        console.log(err)
        success.value = false; // Fix: Set success to false on error
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
    deleteProf,
    deleteSupervisor,
    deleteStudent,
    GetStudentsBySector,
    updateStudent,
    getStudentBycin,
    NumberOfStudents,
    clearStatus
  }
  }
)
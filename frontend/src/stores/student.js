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
        error.value = err.response?.data?.message || err.response?.data?.error || "Couldn't fetch the students. Please retry again later"
      }
      finally {
          loading.value = false
      }
  }

    async function updateStudent(id, updatedfeilds) {
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

    async function NumberOfStudents() {
      try {
        await api.get(`/admin/students/total`)
      }
      catch (err) {
        error.value = err.response?.data?.message || err.response?.data?.error || "Something went wrong. Please retry again later"
        success.value = false;
        console.log(err)
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
      catch (err) {
        console.log(err)
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
      catch (err) {
        console.log(err)
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
    GetStudentsBySector,
    updateStudent,
    getStudentBycin,
    NumberOfStudents,
    clearStatus
  }
  }
)
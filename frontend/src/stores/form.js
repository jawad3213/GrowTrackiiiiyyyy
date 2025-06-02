// stores/form.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/services/api'
import DOMPurify from 'dompurify'

export const useFormStore = defineStore('form', () => {
  // État global partagé
  const loading = ref(false)
  const error = ref(null)
  const success = ref(null)
  const errors = ref({})
  /**
   * Fonction générique pour soumettre un formulaire via POST
   * @param {string} endpoint - URL backend, ex: '/addStudent'
   * @param {object} data - données à envoyer (étudiant, prof, etc.)
   * @param {function} onSuccess - fonction à exécuter après succès (facultatif)
   */
  async function submitForm(endpoint, data, onSuccess = null) {
    loading.value = true
    error.value = null
    success.value = null

    try {
      const res = await api.post(endpoint, data)
      success.value = 'Submitted successfully'
      errors.value=null;
      if (onSuccess) onSuccess(res.data)
    } catch (err) {
      error.value = err.response?.data?.message || err.response?.data?.error || "Couldn't submit the form. Please retry again later"
      const result = {}
      err.response?.data?.errors?.forEach(e => {
      result[e.path] = e.msg
      })
      errors.value = result
    } finally {
      loading.value = false
    }
  }

async function Update(endpoint, data, onSuccess = null) {
    loading.value = true
    error.value = null
    success.value = null

    try {
      const res = await api.patch(endpoint, data)
      success.value = 'Submitted successfully'
      errors.value=null;
      if (onSuccess) onSuccess(res.data)
    } catch (err) {
      error.value = err.response?.data?.message || err.response?.data?.error || "Couldn't submit the form. Please retry again later"
      const result = {}
      err.response?.data?.errors?.forEach(e => {
      result[e.path] = e.msg
      })
      errors.value = result
    } finally {
      loading.value = false
    }
  }


  async function validateWithSchema(data, schema) { 
    try {
      await schema.validate(data, { abortEarly: false })
      errors.value = {} 
      return true
    } catch (err) {
      console.log(err)
      const result = {}
      err.inner.forEach(e => {
        result[e.path] = e.message
      })
      errors.value = result
      return false
    }
  }

  function sanitizeInputs(obj) {
    const sanitized = {}
    for (const key in obj) {
      const value = obj[key]
      sanitized[key] = typeof value === 'string' ? DOMPurify.sanitize(value) : value
    }
    return sanitized
  }
  

  function clearStatus() {
    loading.value = false
    error.value = null
    success.value = null
    errors.value = {}
  }
// 3melt hadxi li maji hnaya because mafiya li y creayi store jdid 3la functionality wahda :)
  const SelectedObj = ref(null);

  return {
    loading,
    error,
    SelectedObj,
    success,
    errors,
    submitForm,
    clearStatus,
    validateWithSchema,
    sanitizeInputs,
    Update
  }
})

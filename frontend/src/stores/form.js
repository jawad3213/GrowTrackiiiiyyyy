// stores/form.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/services/api'

export const useFormStore = defineStore('form', () => {
  // État global partagé
  const loading = ref(false)
  const error = ref(null)
  const success = ref(null)

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

      // Si une fonction de rappel est passée, on lui donne res.data
      if (onSuccess) onSuccess(res.data)

    } catch (err) {
      error.value = err.response?.data?.message || 'Submission failed'
    } finally {
      loading.value = false
    }
  }

  /**
   * Fonction de validation générique
   * @param {object} obj - objet à valider (étudiant, skill, etc.)
   * @param {array} requiredFields - tableau des champs obligatoires
   * @returns { valid: boolean, errors: object }
   */
  function validateForm(obj, requiredFields = []) {
    const errors = {}
    let valid = true

    requiredFields.forEach(field => {
      if (!obj[field] || obj[field].toString().trim() === '') {
        errors[field] = `${field} is required`
        valid = false
      }
    })

    return { valid, errors }
  }

  function clearStatus() {
    loading.value = false
    error.value = null
    success.value = null
  }

  return {
    loading,
    error,
    success,
    submitForm,
    validateForm,
    clearStatus
  }
})

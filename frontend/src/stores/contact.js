//stores/contact.js

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/api'

export const useContactStore = defineStore('contact', () => {

    const error = ref(null)
    const success = ref(null)
    const sending = ref(false)
    
    async function sendMsg(payload) {
        error.value = null
        success.value = null
        sending.value = true

        try {
            const response = await api.post('/contact', payload)
            success.value = 'Message sent successfully!'
        } catch (err) {
            error.value = err.response?.data?.message || 'Error while sending. Please try again.'
        } finally {
            sending.value = false
        }
    }

  // Getters (computed)
    const errormsg = computed(() => error.value)
    const successmsg = computed(() => success.value)
    const isSending = computed(() => sending.value)

    return {
    //pas besoin de returner le state car on aura besoin juste par lecture 
    // getters
    errormsg,
    successmsg,
    isSending,

    // actions
    sendMsg,
    }
})

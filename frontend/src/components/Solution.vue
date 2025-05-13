<template>
    <div v-if="isOpen" class="fixed inset-0 bg-gray-900 bg-opacity-60 flex items-center justify-center z-50 font-inter">
      <div class="bg-white border-2 border-purple-500 rounded-2xl shadow-xl w-full max-w-xl p-6 sm:p-8">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-gray-900">Personalized Monitoring</h2>
          <button @click="closeModal" class="text-gray-500 hover:text-gray-800 text-2xl font-bold">&times;</button>
        </div>
  
        <form @submit.prevent>
          <div>
            <label class="text-sm font-semibold">Proposed Corrective Solutions*</label>
            <input v-model="monitor.solutions" class="input" required />
          </div>
          <div>
            <label class="text-sm font-semibold">Details*</label>
            <textarea v-model="monitor.details" rows="3" class="input" required></textarea>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="text-sm font-semibold">Reporter full name</label>
              <input v-model="monitor.reporter" class="input" />
            </div>
            <div>
              <label class="text-sm font-semibold">Reported User</label>
              <input v-model="monitor.user" class="input" />
            </div>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="font-semibold">CIN Reporter*</label>
            <input v-model="monitor.cinReporter" type="text"
              class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
            <p v-if="errors.cinReporter" class="text-red-500 text-xs mt-1">{{ errors.cinReporter }}</p>
          </div>
          <div>
            <label class="font-semibold">CIN Reported User*</label>
            <input v-model="monitor.cinReportedUser" type="text"
              class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
            <p v-if="errors.cinReportedUser" class="text-red-500 text-xs mt-1">{{ errors.cinReportedUser }}</p>
          </div>
        </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="text-sm font-semibold">Date of Beginning*</label>
              <input v-model="monitor.startDate" type="date" class="input" required />
            </div>
            <div>
              <label class="text-sm font-semibold">Date of ending*</label>
              <input v-model="monitor.endDate" type="date" class="input" required />
            </div>
          </div>
  
          <div class="flex justify-between mt-4">
            <button @click="goBack" class="px-6 py-2 bg-gray-200 hover:bg-gray-300 rounded-md">Go Back</button>
            <button @click="sendMonitoringNotif" class="px-6 py-2 bg-orange-500 text-white rounded-md">Send Notifications</button>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import api from '@/services/api'
  import { useRouter } from 'vue-router'
  import { useFormStore } from '@/stores/form'
  
  const router = useRouter()
  const isOpen = ref(true)
  
  const monitor = ref({
    solutions: '',
    details: '',
    reporter: '',
    user: '',
    cinReporter:'',
    cinReportedUser:'',
    startDate: '',
    endDate: ''
  })
  
  function closeModal() {
    isOpen.value = false
  }
  
  function goBack() {
    router.back()
  }

    const errors = ref({})
    const errorApi = ref('null')

    async function sendMonitoringNotif() {
        const { valid, errors: formErrors } = useFormStore.validateForm(monitor.value, [ 
        'solutions', 'details', 'reporter', 'user', 'startDate', 'endDate','cin Reporter','cin Reported User'
    ])
    errors.value = formErrors
    if (!valid) return

    try {
      await api.post('/notifications', monitor.value)
      alert('Notification sent!')
    } catch (err) {
        console.error('Notification error:', err)
        errorApi.value = err.response?.data?.message ||"error while sending"
    }
  }

  </script>
  
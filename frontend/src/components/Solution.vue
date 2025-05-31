<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-gray-200/60 px-4 py-8 overflow-auto font-inter">
    
    <div class="bg-white border-2 border-purple-500 rounded-2xl shadow-2xl w-full max-w-2xl p-8 relative">
      
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-xl font-bold text-gray-900">Personalized Monitoring</h2>
        <button @click="closeModal" class="text-gray-500 hover:text-gray-800 text-2xl font-bold">&times;</button>
      </div>

      <!-- Form -->
      <form @submit.prevent class="space-y-5">

        <!-- Solutions -->
        <div>
          <label class="text-sm font-semibold">Proposed Corrective Solutions*</label>
          <input v-model="monitor.solutions" class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-purple-500" required />
        </div>

        <!-- Details -->
        <div>
          <label class="text-sm font-semibold">Details*</label>
          <textarea v-model="monitor.details" rows="3"
            class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-purple-500" required></textarea>
        </div>

        <!-- Reporter & User -->
        <div class="grid sm:grid-cols-2 gap-4">
          <div>
            <label class="text-sm font-semibold">Reporter full name</label>
            <input v-model="monitor.reporter"
              class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-purple-500" />
          </div>
          <div>
            <label class="text-sm font-semibold">Reported User</label>
            <input v-model="monitor.user"
              class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-purple-500" />
          </div>
        </div>

        <!-- Dates -->
        <div class="grid sm:grid-cols-2 gap-4">
          <div>
            <label class="text-sm font-semibold">Date of Beginning*</label>
            <input v-model="monitor.startDate" type="date"
              class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-purple-500" required />
          </div>
          <div>
            <label class="text-sm font-semibold">Date of Ending*</label>
            <input v-model="monitor.endDate" type="date"
              class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-purple-500" required />
          </div>
        </div>

        <!-- Alertes -->
        <p v-if="errorApi" class="text-red-500 text-sm animate-pulse">{{ errorApi }}</p>
        <p v-if="formStore.error" class="text-red-500 text-sm animate-pulse">{{ formStore.error }}</p>
        <p v-if="formStore.success" class="text-green-500 text-sm animate-pulse">{{ formStore.success }}</p>

        <!-- Actions -->
        <div class="flex justify-between pt-6">
          <button @click="goBack"
            class="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition">Go Back</button>
          <button @click="sendMonitoringNotif"
            class="px-6 py-2 bg-orange-500 text-white rounded-md font-semibold hover:bg-orange-600 transition">Send Notifications</button>
        </div>

      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import api from '@/services/api'
import { useRouter, useRoute } from 'vue-router'
import { useFormStore } from '@/stores/form'

const route = useRoute()
const router = useRouter()
const isOpen = ref(true)

const formStore = useFormStore()

const monitor = ref({
  solutions: 'Provide individual counseling sessions.',
  details: 'Schedule weekly one-on-one meetings to monitor behavior improvement and provide personalized feedback.',
  reporter: 'Sarah Johnson',
  user: 'Mike Anderson',
  startDate: '2025-05-10',
  endDate: '2025-06-10',
  Id // Récupéré de l'URL automatiquement
})


// ID du signal envoyé en query param
const Id = route.query.signalId

/* const monitor = ref({
  solutions: '',
  details: '',
  reporter: '',
  user: '',
  startDate: '',
  endDate: '',
  Id
})
 */
const errors = ref({})
const errorApi = ref(null)

function closeModal() {
  isOpen.value = false
}

function goBack() {
  router.back()
}

async function sendMonitoringNotif() {
  const { valid, errors: formErrors } = formStore.validateForm(monitor.value, [
    'solutions', 'details', 'reporter', 'user', 'startDate', 'endDate'
  ])
  errors.value = formErrors
  if (!valid) return

  try {
    await api.post('/notifications', monitor.value)
    alert('Notification sent!')
  } catch (err) {
    console.error('Notification error:', err)
    errorApi.value = err.response?.data?.message || 'Error while sending'
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
 }
  </script>
 
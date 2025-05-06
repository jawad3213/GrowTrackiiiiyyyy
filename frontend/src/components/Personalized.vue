<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-gray-200/60 px-4 py-8 overflow-auto font-inter">
    <div class="bg-white border-2 border-purple-500 rounded-2xl shadow-2xl w-full max-w-2xl p-8 relative">

      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-xl font-bold text-gray-800">Personalized Monitoring</h2>
        <button @click="closeModal" class="text-gray-500 hover:text-gray-800 text-2xl font-bold">&times;</button>
      </div>

      <!-- Form -->
      <form @submit.prevent="submitForm" class="space-y-5">

        <div>
          <label class="font-semibold">Proposed Corrective Solutions*</label>
          <input v-model="monitoring.solutions" type="text" placeholder="Tutoring, Workshop, etc"
            class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-purple-500" />
          <p v-if="errors.solutions" class="text-red-500 text-xs mt-1">{{ errors.solutions }}</p>
        </div>

        <div>
          <label class="font-semibold">Details*</label>
          <textarea v-model="monitoring.details" rows="3"
            class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-purple-500"></textarea>
          <p v-if="errors.details" class="text-red-500 text-xs mt-1">{{ errors.details }}</p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="font-semibold">Reporter full name*</label>
            <input v-model="monitoring.reporter" type="text"
              class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-purple-500" />
            <p v-if="errors.reporter" class="text-red-500 text-xs mt-1">{{ errors.reporter }}</p>
          </div>
          <div>
            <label class="font-semibold">Reported User*</label>
            <input v-model="monitoring.reportedUser" type="text"
              class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-purple-500" />
            <p v-if="errors.reportedUser" class="text-red-500 text-xs mt-1">{{ errors.reportedUser }}</p>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="font-semibold">Date of Beginning*</label>
            <input v-model="monitoring.startDate" type="date"
              class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-purple-500" />
            <p v-if="errors.startDate" class="text-red-500 text-xs mt-1">{{ errors.startDate }}</p>
          </div>
          <div>
            <label class="font-semibold">Date of ending*</label>
            <input v-model="monitoring.endDate" type="date"
              class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-purple-500" />
            <p v-if="errors.endDate" class="text-red-500 text-xs mt-1">{{ errors.endDate }}</p>
          </div>
        </div>

        <!-- Alertes -->
        <p v-if="errorApi" class="text-red-500 text-sm animate-pulse">{{ errorApi }}</p>

        <!-- Boutons -->
        <div class="flex justify-between pt-6">
          <button @click="closeModal" type="button"
            class="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100">Go Back</button>
          <button type="submit"
            class="px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition font-semibold"
            :disabled="loading">
            <span v-if="loading">Sending...</span>
            <span v-else>Send Notifications</span>
          </button>
        </div>

      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import api from '@/services/api'
import { useFormStore } from '@/stores/form'
import { useRoute } from 'vue-router'

const route = useRoute()
const Id = route.query.signalTd // récupérer l'id du signal
const isOpen = ref(true)

const formStore = useFormStore()
const loading = ref(false)
const errorApi = ref(null)

const monitoring = ref({
  solutions: '',
  details: '',
  reporter: '',
  reportedUser: '',
  startDate: '',
  endDate: '',
  Id
})

const errors = ref({})

function closeModal() {
  isOpen.value = false
}

async function submitForm() {
  const { valid, errors: formErrors } = formStore.validateForm(monitoring.value, [
    'solutions', 'details', 'reporter', 'reportedUser', 'startDate', 'endDate'
  ])
  errors.value = formErrors
  if (!valid) return

  loading.value = true
  errorApi.value = null

  try {
    await api.post('/monitoring', monitoring.value)
    alert('Notification sent successfully!')
    closeModal()
  } catch (error) {
    errorApi.value = error.response?.data?.message || 'An error occurred while sending. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>

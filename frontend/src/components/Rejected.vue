<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-gray-200/60 px-4 py-8 overflow-auto font-inter">
    <div class="bg-white border-2 border-purple-500 rounded-2xl shadow-2xl w-full max-w-md p-8 relative">

      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-xl font-bold text-gray-800">Rejection Reason</h2>
        <button @click="closeModal" class="text-gray-500 hover:text-gray-800 text-2xl font-bold">&times;</button>
      </div>

      <!-- Form -->
      <form @submit.prevent="submitForm" class="space-y-5">

        <div>
          <label class="font-semibold mb-2 block">For which reason ?</label>
          <textarea
            v-model="monitoring.details"
            rows="4"
            placeholder="reason of rejection."
            class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-purple-500"
          ></textarea>
          <p v-if="errors.details" class="text-red-500 text-xs mt-1">{{ errors.details }}</p>
        </div>

        <p v-if="errorApi" class="text-red-500 text-sm animate-pulse">{{ errorApi }}</p>

        <!-- Boutons -->
        <div class="flex justify-between gap-4 pt-6">
          <button @click="closeModal" type="button"
            class="flex-1 px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 font-semibold">Cancel</button>
          <button type="submit"
            class="flex-1 px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition font-semibold"
            :disabled="loading">
            <span v-if="loading">Sending...</span>
            <span v-else>Send Notification</span>
          </button>
        </div>

      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import api from '@/services/api'
import { useRoute } from 'vue-router'
import router from '@/routers'

const route = useRoute()
const Id = route.query.signalTd
const isOpen = ref(true)
const loading = ref(false)
const errorApi = ref(null)

const monitoring = ref({
  details: '',
  Id
})

const errors = ref({})

function closeModal() {
  isOpen.value = false
  router.back()
}

async function submitForm() {
  errors.value = {}
  if (!monitoring.value.details) {
    errors.value.details = "This field is required."
    return
  }
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

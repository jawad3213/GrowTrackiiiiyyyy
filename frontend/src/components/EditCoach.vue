<!-- src/views/EditCoach.vue -->
<template>
  <!-- Modal Overlay -->
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-gray-800/70 backdrop-blur-sm flex items-center justify-center z-50 font-inter"
  >
    <!-- Form Container -->
    <div class="bg-white border-2 border-purple-500 rounded-2xl shadow-2xl w-full max-w-2xl p-8 relative">
      <!-- Header -->
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-2xl font-bold text-gray-900">Edit Coach</h2>
        <button @click="closeModal" class="text-gray-500 hover:text-gray-800 text-2xl font-bold">
          &times;
        </button>
      </div>

      <!-- Form -->
      <form @submit.prevent="submitForm" class="space-y-5">
        <!-- Full Name + CIN (CIN is disabled) -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="text-sm font-medium text-gray-700">Full Name *</label>
            <input
              v-model="coach.full_name"
              type="text"
              placeholder="Full name"
              class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <span class="text-red-500 text-sm">{{ formStore.errors.full_name }}</span>
          </div>
          <div>
            <label class="text-sm font-medium text-gray-700">CIN *</label>
            <input
              v-model="coach.cin"
              type="text"
              disabled
              class="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-md text-sm cursor-not-allowed"
            />
          </div>
        </div>

        <!-- Field -->
        <div>
          <label class="text-sm font-medium text-gray-700">Field *</label>
          <input
            v-model="coach.field"
            type="text"
            placeholder="Field"
            class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <span class="text-red-500 text-sm">{{ formStore.errors.field }}</span>
        </div>

        <!-- Admin Notes -->
        <div>
          <label class="text-sm font-medium text-gray-700">Admin Notes</label>
          <textarea
            v-model="coach.note"
            rows="3"
            placeholder="e.g. Joined last month..."
            class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          ></textarea>
          <span class="text-red-500 text-sm">{{ formStore.errors.note }}</span>
        </div>

        <!-- API Error / Success Messages -->
        <p v-if="formStore.error" class="text-red-500 text-sm animate-pulse">{{ formStore.error }}</p>
        <p v-if="formStore.success" class="text-green-500 text-sm animate-pulse">{{ formStore.success }}</p>

        <!-- Buttons -->
        <div class="flex justify-end gap-4 pt-6">
          <button
            type="button"
            @click="closeModal"
            class="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="px-6 py-2 font-semibold text-white rounded-md bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 transition-all duration-300 transform hover:scale-105"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useFormStore } from '@/stores/form'
import { useRouter, useRoute } from 'vue-router'
import api from '@/services/api'
import coachSchema from '@/schemas/Coach.schema'

const formStore = useFormStore()
const router = useRouter()
const route = useRoute()

// Modal open state
const isOpen = ref(true)

// Coach object: full_name, cin, field, note
const coach = ref({
  full_name: '',
  cin: '',
  field: '',
  note: ''
})

// Get ID from route params (cin is used as unique identifier)
const coachId = route.params.id_coach 

// Fetch existing coach data on mount
const fetchCoach = async () => {
  try {
    const res = await api.get(`/admin/coachs/${coachId}`)
    // Assuming the API returns data in res.data.data with matching keys
    const data = res.data.data
    coach.value.full_name = data.full_name
    coach.value.cin = data.cin
    coach.value.field = data.field
    coach.value.note = data.note
  } catch (error) {
    console.error('Erreur lors du chargement du coach :', error)
    // Optionally navigate back if not found
    closeModal()
  }
}

// Close modal and return to list
function closeModal() {
  isOpen.value = false
  router.push('/Coach')
}

// Handle form submission
const submitForm = async () => {
  try {
    const sanitizedData = formStore.sanitizeInputs({
      full_name: coach.value.full_name,
      // CIN should remain unchanged; send it anyway if backend expects it
      cin: coach.value.cin,
      field: coach.value.field,
      note: coach.value.note
    })
    // Validate against schema (assumes coachSchema has rules for full_name, cin, field, note)
    const valid = await formStore.validateWithSchema(sanitizedData, coachSchema)
    if (!valid) return

    // Send updated data to backend
    // Adjust the endpoint/method if your API expects another route (e.g., /admin/coachs/update/:id)
    await api.put(`/admin/coachs/${coachId}`, sanitizedData)

    formStore.success = 'Coach mis à jour avec succès.'
    // Brief delay to show success message, then close
    setTimeout(() => {
      closeModal()
    }, 800)
  } catch (error) {
    console.error('Erreur lors de la mise à jour :', error)
    formStore.error = error.response?.data?.message || 'Une erreur est survenue.'
  }
}

onMounted(async () => {
  formStore.clearStatus()
  await fetchCoach()
})
</script>

<template>
  <div>
    <!-- Trigger -->
    <button
      @click="open"
      class="text-blue-600 hover:text-blue-800 font-medium"
    >
      See Details
    </button>

    <!-- Modal -->
    <teleport to="body">
      <div
        v-if="showModal"
        class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-6"
      >
        <div
          class="relative bg-white w-full max-w-3xl max-h-[90vh] p-8 rounded-3xl border-4 border-purple-500 shadow-2xl overflow-y-auto space-y-6 animate-slide-up-fade"
        >
          <!-- Close -->
          <button
            @click="closeAll"
            aria-label="Close"
            class="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl font-bold"
          >&times;</button>

          <!-- DETAILS VIEW -->
          <template v-if="!showForm">
            <h2 class="text-2xl font-extrabold text-center mb-4">
              Signal #{{ data.id_signal }}
            </h2>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <!-- Reporter -->
              <div class="flex flex-col items-center space-y-2">
                <div
                  class="w-28 h-28 rounded-full flex items-center justify-center text-white text-3xl font-bold"
                  :style="{ backgroundColor: stringToColor(data.reporter_name) }"
                >
                  {{ data.reporter_name.charAt(0) }}
                </div>
                <p class="font-semibold">{{ data.reporter_name }}</p>
                <p class="text-sm text-gray-500">{{ data.reporter_role }}</p>
              </div>
              <!-- Reported -->
              <div class="flex flex-col items-center space-y-2">
                <div
                  class="w-28 h-28 rounded-full flex items-center justify-center text-white text-3xl font-bold"
                  :style="{ backgroundColor: stringToColor(data.reported_name) }"
                >
                  {{ data.reported_name.charAt(0) }}
                </div>
                <p class="font-semibold">{{ data.reported_name }}</p>
                <p class="text-sm text-gray-500">{{ data.reported_role }}</p>
              </div>
            </div>

            <p><strong>Submitted Date:</strong> {{ formatDate(data.submitted_date) }}</p>
            <p><strong>Reason:</strong></p>
            <p class="ml-4 italic text-gray-700">"{{ data.reason }}"</p>

            <div class="pt-4 flex space-x-4">
              <button
                @click="closeAll"
                class="flex-1 py-3 font-semibold rounded-full bg-gray-300 hover:bg-gray-400"
              >
                Back
              </button>
              <button
                @click="showForm = true"
                class="flex-1 py-3 text-white font-semibold rounded-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600"
              >
                Approved
              </button>
            </div>
          </template>

          <!-- FORM VIEW -->
          <template v-else>
            <h2 class="text-2xl font-extrabold text-center mb-4">
              Process Signal #{{ data.id_signal }}
            </h2>
            <form @submit.prevent="submitForm" class="space-y-4">
              <div>
                <label class="block font-medium mb-1">Option Solution</label>
                <input
                  v-model="form.option_solution"
                  type="text"
                  required
                  class="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label class="block font-medium mb-1">Details</label>
                <textarea
                  v-model="form.details"
                  required
                  class="w-full border rounded px-3 py-2"
                ></textarea>
              </div>
              <div>
                <label class="block font-medium mb-1">Coach Name</label>
                <input
                  v-model="form.name_coach"
                  type="text"
                  required
                  class="w-full border rounded px-3 py-2"
                />
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block font-medium mb-1">Start Date</label>
                  <input
                    v-model="form.start_date"
                    type="date"
                    required
                    class="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label class="block font-medium mb-1">Date Done</label>
                  <input
                    v-model="form.date_done"
                    type="date"
                    required
                    class="w-full border rounded px-3 py-2"
                  />
                </div>
              </div>
              <div class="pt-4 flex space-x-4">
                <button
                  type="button"
                  @click="showForm = false"
                  class="flex-1 py-3 font-semibold rounded-full bg-gray-300 hover:bg-gray-400"
                >
                  Back
                </button>
                <button
                  type="submit"
                  class="flex-1 py-3 text-white font-semibold rounded-full bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600"
                >
                  Submit
                </button>
              </div>
            </form>
          </template>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import api from '@/services/api'

const props = defineProps({
  id: { type: Number, required: true }
})

const showModal = ref(false)
const showForm  = ref(false)
const data      = ref({})
const form      = reactive({
  option_solution: '',
  details: '',
  name_coach: '',
  start_date: '',
  date_done: ''
})

async function open() {
  try {
    const res = await api.get(`/admin/signals/review/${props.id}`)
    data.value = res.data.data
    showModal.value = true
    // sync URL if you want
    window.history.replaceState(null, '', `${location.pathname}?signalId=${props.id}`)
  } catch (e) {
    console.error(e)
    alert('Failed to load signal details.')
  }
}

function closeAll() {
  showModal.value = false
  showForm.value  = false
  window.history.replaceState(null, '', location.pathname)
}

function formatDate(iso) {
  return new Date(iso).toLocaleString()
}

function stringToColor(str) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  return `hsl(${Math.abs(hash) % 360},50%,60%)`
}

async function submitForm() {
  try {
    await api.post(`/admin/signals/sendnotification/${props.id}`, { ...form })
    alert('Signal processed successfully.')
    closeAll()
  } catch (err) {
    console.error(err)
    alert('Failed to process signal.')
  }
}
</script>

<style scoped>
@keyframes slide-up-fade {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}
.animate-slide-up-fade {
  animation: slide-up-fade 0.5s ease-out forwards;
}
</style>

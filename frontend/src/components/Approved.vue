<template>
  <div>
    <!-- Approved button -->
    <button
      @click="openForm"
      class="text-green-600 hover:text-green-800 font-medium"
    >
      Approved
    </button>

    <!-- Modal with form -->
    <teleport to="body">
      <div
        v-if="showForm"
        class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-6"
      >
        <div
          class="relative bg-white w-full max-w-md p-8 rounded-3xl border-4 border-purple-500 shadow-2xl overflow-y-auto space-y-6 animate-slide-up-fade"
        >
          <!-- Close Icon -->
          <button
            @click="closeForm"
            aria-label="Close form"
            class="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl font-bold"
          >
            &times;
          </button>

          <h2 class="text-2xl font-extrabold text-center mb-4">
            Process Signal #{{ id }}
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

            <div class="pt-4 flex space-x-4">
              <button
                type="button"
                @click="closeForm"
                class="w-full py-2 font-semibold rounded-full bg-gray-300 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="w-full py-2 text-white font-semibold rounded-full bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600"
              >
                Submit
              </button>
            </div>
          </form>
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

const showForm = ref(false)
const form = reactive({
  option_solution: '',
  details: '',
  name_coach: '',
  start_date: '',
  date_done: ''
})

function openForm() {
  showForm.value = true
  // reflect in URL if you want
  const newUrl = `${location.pathname}?signalId=${props.id}`
  window.history.replaceState(null, '', newUrl)
}

function closeForm() {
  showForm.value = false
  window.history.replaceState(null, '', location.pathname)
}

async function submitForm() {
  try {
    await api.post(
      `/admin/signals//sendnotification/${props.id}`,
      { ...form }
    )
    alert('Signal processed successfully.')
    closeForm()
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

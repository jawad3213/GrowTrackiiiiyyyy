<template>
  <div class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4 py-10 overflow-auto z-50">
    <div class="bg-white rounded-2xl shadow-2xl p-8 max-w-3xl w-full relative">

      <!-- Close Button -->
      <button @click="closeModal" class="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl font-bold">
        &times;
      </button>

      <!-- Title -->
      <h1 class="text-4xl font-black text-center mb-8">
        Signals <span class="bg-red-500 text-white px-3 py-1 rounded">History</span>
      </h1>

      <!-- Loader -->
      <div v-if="isLoading" class="flex justify-center py-10">
        <svg class="animate-spin h-10 w-10 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
        </svg>
      </div>

      <!-- History Table -->
      <div v-else class="overflow-x-auto">
        <table class="w-full text-sm text-center border-collapse">
          <thead class="bg-gray-100 text-gray-800 font-semibold">
            <tr>
              <th class="py-2">Reporter</th>
              <th class="py-2">Role</th>
              <th class="py-2">Date</th>
              <th class="py-2">Signal State</th>
              <th class="py-2">Solution State</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="entry in signalHistory"
              :key="`${entry.id_signal}-${entry.date}`"
              class="border-t border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <td class="py-2">{{ entry.full_name }}</td>
              <td class="py-2">{{ entry.role }}</td>
              <td class="py-2">{{ entry.date }}</td>
              <td class="py-2">
                <span :class="statusClass(entry.signal_state)">
                  {{ entry.signal_state ?? 'N/A' }}
                </span>
              </td>
              <td class="py-2">
                <span :class="solutionClass(entry.solution_state)">
                  {{ entry.solution_state || 'No Action Taken' }}
                </span>
              </td>
            </tr>
            <tr v-if="!isLoading && signalHistory.length === 0">
              <td colspan="5" class="py-4 text-gray-600 dark:text-gray-400">
                No history available.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Go Back Button -->
      <div class="mt-8 text-center">
        <button @click="closeModal" class="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-10 rounded shadow">
          Go Back
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api from '@/services/api'

const router    = useRouter()
const route     = useRoute()
const studentId = route.query.id
const classId   = route.query.classId

const signalHistory = ref([])
const isLoading     = ref(false)

const closeModal = () => {
  router.push({ path: '/ClassesSignal', query: { classId } })
}

const fetchHistory = async () => {
  isLoading.value = true
  try {
    const token = localStorage.getItem('token')
    const res   = await api.get(
      `/api/signal_classes/history_signal/${studentId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
    const data = Array.isArray(res.data.result) ? res.data.result : []
    signalHistory.value = data.map(s => ({
      id_signal:       s.id_signal,
      id_class:        s.id_class,
      cne:             s.cne,
      full_name:       s.full_name,
      role:            s.role,
      profile_picture: s.profile_picture,
      date:            s.date_add
                        ? new Date(s.date_add).toLocaleDateString()
                        : '',
      signal_state:    s.signal_state,
      solution_state:  s.solution_state
    }))
  } catch (err) {
    console.error('Error loading history:', err)
    signalHistory.value = []
  } finally {
    isLoading.value = false
  }
}

// Updated statusClass to handle New/Approved/Rejected
const statusClass = status => {
  const st = (status || '').toLowerCase()
  if (st === 'new')      return 'text-blue-700 bg-blue-100 px-2 py-1 rounded-full text-xs font-semibold'
  if (st === 'approved') return 'text-green-700 bg-green-100 px-2 py-1 rounded-full text-xs font-semibold'
  if (st === 'rejected') return 'text-red-700 bg-red-100 px-2 py-1 rounded-full text-xs font-semibold'
  return 'text-gray-600 bg-gray-100 px-2 py-1 rounded-full text-xs font-semibold'
}

const solutionClass = solution =>
  (solution || '').toLowerCase() === 'resolved'
    ? 'text-green-700 bg-green-100 px-2 py-1 rounded-full text-xs font-semibold'
    : 'text-gray-600 bg-gray-100 px-2 py-1 rounded-full text-xs font-semibold'

onMounted(fetchHistory)
</script>

<style>
/* No additional styles */
</style>

<template>
  <ProfLayout>
    <div class="p-6 min-h-screen bg-gray-50 dark:bg-[#121212]">
      <!-- Header -->
      <h1 class="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
        Signals
        <span
          class="bg-purple-100 text-purple-600 text-sm font-semibold px-3 py-1 rounded-full ml-2"
        >
          {{ signals.length }} signals this month
        </span>
      </h1>

      <!-- Signals Table -->
      <div class="overflow-x-auto transform scale-105 origin-top-left">
        <!-- Loader -->
        <div v-if="isLoading" class="flex justify-center items-center h-40">
          <div class="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
        </div>

        <!-- Table -->
        <table
          v-else
          class="w-full bg-white dark:bg-gray-900 shadow rounded text-base"
        >
          <thead class="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-semibold">
            <tr>
              <th class="text-left p-4">Signal ID</th>
              <th class="text-left p-4">Class</th>
              <th class="text-left p-4">Reported User</th>
              <th class="text-left p-4">Signal State</th>
              <th class="text-left p-4">Solution State</th>
              <th class="text-left p-4">Review</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="signal in filteredSignals"
              :key="signal.id"
              class="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <td class="p-4">{{ signal.signalId }}</td>
              <td class="p-4">{{ signal.id_class }}</td>
              <td class="p-4 flex items-center gap-3">
                <!-- real avatar if available -->
                <template v-if="signal.avatar">
                  <img
                    :src="signal.avatar"
                    class="w-10 h-10 rounded-full object-cover"
                    alt="avatar"
                  />
                </template>
                <!-- letter-avatar fallback -->
                <template v-else>
                  <div
                    class="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-lg"
                    :style="{ backgroundColor: signal.bgColor }"
                  >
                    {{ signal.initial }}
                  </div>
                </template>

                <div>
                  <div class="font-medium text-gray-800 dark:text-white">
                    {{ signal.fullName }}
                  </div>
                  <div class="text-sm text-gray-500 dark:text-gray-400">
                    @{{ signal.username }}
                  </div>
                </div>
              </td>
              <td class="p-4">
                <span :class="badgeClass(signal.status)">{{ signal.status }}</span>
              </td>
              <td class="p-4">
                <span :class="solutionClass(signal.solution)">{{ signal.solution }}</span>
              </td>
              <td class="p-4">
                <button
                  @click="viewSignal(signal.id)"
                  class="inline-flex items-center space-x-2 bg-purple-100 hover:bg-purple-200 text-purple-600 font-bold px-5 py-2 rounded transition"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="w-6 h-6"
                    viewBox="0 -960 960 960"
                    fill="currentColor"
                  >
                    <path d="m560-240-56-58 142-142H160v-80h486L504-662l56-58 240 240-240 240Z"/>
                  </svg>
                  <span>View Solution</span>
                </button>
              </td>
            </tr>
            <tr v-if="!isLoading && signals.length === 0">
              <td colspan="6" class="p-4 text-center text-gray-600 dark:text-gray-400">
                No signals found.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </ProfLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'
import ProfLayout from '@/components/layout/ProfLayout.vue'

// Helper to pick a background color from the initial
function generateColor(letter) {
  const palette = [
    '#F56565', '#ED8936', '#ECC94B',
    '#48BB78', '#4299E1', '#9F7AEA',
    '#ED64A6'
  ]
  return palette[letter.charCodeAt(0) % palette.length]
}

const router = useRouter()
const signals = ref([])
const isLoading = ref(false)
const searchId = ref('')

// Fetch all signals
const fetchSignals = async () => {
  isLoading.value = true
  try {
    const token = localStorage.getItem('token')
    const res = await api.get('/api/signal_history/all_signal', {
      headers: { Authorization: `Bearer ${token}` }
    })
    const data = Array.isArray(res.data.result) ? res.data.result : []

    signals.value = data.map(s => {
      const name    = s.full_name?.trim() || 'N'
      const initial = name.charAt(0).toUpperCase()
      return {
        id:         s.id_signal,
        signalId:   s.id_signal,
        id_class:   s.id_class,
        avatar:     s.profile_picture || null,
        initial,
        bgColor:    generateColor(initial),
        fullName:   name,
        username:   s.cne,
        status:     s.signal_state === 'approved' ? 'Approved' : 'New',
        solution:   s.solution_state || 'No Action Taken'
      }
    })
  } catch (err) {
    console.error('Error loading signals:', err)
    signals.value = []
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchSignals)

// Computed filter by ID
const filteredSignals = computed(() =>
  signals.value.filter(s =>
    searchId.value
      ? s.signalId.toString().includes(searchId.value)
      : true
  )
)

// Badge styling
const badgeClass = status =>
  status === 'Approved'
    ? 'text-green-700 bg-green-100 px-3 py-1 rounded-full text-base font-semibold'
    : 'text-blue-700 bg-blue-100 px-3 py-1 rounded-full text-base font-semibold'

const solutionClass = solution => {
  const base = 'px-3 py-1 rounded-full text-base font-semibold'
  if (solution === 'Resolved')     return `text-green-700 bg-green-100 ${base}`
  if (solution === 'In Progress') return `text-pink-700 bg-pink-100 ${base}`
  if (solution === 'Blocked')     return `text-red-700 bg-red-100 ${base}`
  return `text-gray-600 bg-gray-100 ${base}`
}

// Navigation to solution view
const viewSignal = id => {
  router.push({ path: '/SolutionSignal', query: { id } })
}
</script>

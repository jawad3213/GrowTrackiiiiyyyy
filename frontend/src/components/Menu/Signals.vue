<template>
  <AdminLayout>
    <div class="p-6 bg-gray-100 min-h-screen font-inter">
      <!-- Titre -->
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-xl font-bold text-gray-900">
          Signals
          <span class="bg-purple-100 text-purple-600 text-sm font-semibold px-3 py-1 rounded-full">
            100 signals in months
          </span>
        </h1>

        <!-- Recherche -->
        <div class="flex items-center gap-3">
          <div class="relative w-[300px]">
            <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">🔍</span>
            <input
              v-model="search"
              placeholder="Search"
              class="h-11 w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-800 placeholder:text-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-300"
            />
          </div>
          <button class="px-4 py-2 border border-gray-300 rounded-md text-sm bg-white text-gray-700 hover:bg-gray-100">
            Filters
          </button>
        </div>
      </div>

      <!-- Tableau -->
      <div class="overflow-x-auto">
        <table class="w-full text-sm bg-white rounded shadow">
          <thead class="bg-gray-100 text-gray-700">
            <tr>
              <th class="p-3 text-left">Signal ID</th>
              <th class="p-3 text-left">Reason</th>
              <th class="p-3 text-left">Reported By</th>
              <th class="p-3 text-left">Reported User</th>
              <th class="p-3 text-left">Signal State</th>
              <th class="p-3 text-left">Solution State</th>
              <th class="p-3 text-left">Review</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="signal in filteredSignals"
              :key="signal.id"
              class="border-t border-gray-200 hover:bg-gray-50"
            >
              <td class="p-3"><input type="checkbox" /></td>
              <td class="p-3">{{ signal.id }}</td>
              <td class="p-3">{{ signal.reason }}</td>

              <td class="p-3 flex items-center gap-2">
                <img :src="signal.reporterAvatar" class="w-8 h-8 rounded-full object-cover" />
                <div>
                  <div class="font-semibold">{{ signal.reportedBy }}</div>
                  <div class="text-xs text-gray-500">{{ signal.reporterRole }}</div>
                </div>
              </td>

              <td class="p-3 flex items-center gap-2">
                <img :src="signal.userAvatar" class="w-8 h-8 rounded-full object-cover" />
                <div>
                  <div class="font-semibold">{{ signal.reportedUser }}</div>
                  <div class="text-xs text-gray-500">{{ signal.reportedUserRole }}</div>
                </div>
              </td>

              <td class="p-3">
                <span :class="badgeClass(signal.state)">{{ signal.state }}</span>
              </td>

              <td class="p-3">
                <span :class="solutionBadge(signal.solution)">{{ signal.solution }}</span>
              </td>

              <td class="p-3">
                <button @click="openSignal(signal)" class="text-purple-600 hover:text-purple-800">
                  <i class="fas fa-file-alt"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="flex justify-between items-center py-4 text-sm text-gray-600">
        <span>Page 1 of 10</span>
        <div class="flex gap-2">
          <button class="px-4 py-2 border rounded-md">Previous</button>
          <button class="px-4 py-2 border rounded-md">Next</button>
        </div>
      </div>

      <!-- Modal -->
      <SignalEvaluationModal v-if="showModal" :signal="selectedSignal" @fermer="showModal = false" />
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import AdminLayout from '../layout/AdminLayout.vue'
import SignalEvaluationModal from '@/components/SignalEvaluationModal.vue'

const search = ref('')
const signals = ref([])
const selectedSignal = ref(null)
const showModal = ref(false)

// Appel API direct
onMounted(async () => {
  try {
    const res = await axios.get('http://localhost:3001/signals') // adapte l’URL à ton backend
    signals.value = res.data
  } catch (error) {
    console.error('Erreur chargement signals :', error)
  }
})

const filteredSignals = computed(() =>
  signals.value.filter((s) =>
    s.reportedBy.toLowerCase().includes(search.value.toLowerCase()) ||
    s.reportedUser.toLowerCase().includes(search.value.toLowerCase()) ||
    s.reason.toLowerCase().includes(search.value.toLowerCase())
  )
)

function openSignal(signal) {
  selectedSignal.value = signal
  showModal.value = true
}

const badgeClass = (state) => {
  return {
    New: 'bg-blue-100 text-blue-600',
    Approved: 'bg-green-100 text-green-600',
    Rejected: 'bg-red-100 text-red-600'
  }[state] + ' px-3 py-1 rounded-full text-xs font-semibold'
}

const solutionBadge = (solution) => {
  return {
    'No Action Taken': 'bg-gray-200 text-gray-600',
    'In Progress': 'bg-purple-100 text-purple-600',
    Blocked: 'bg-red-100 text-red-600'
  }[solution] + ' px-3 py-1 rounded-full text-xs font-semibold'
}
</script>

<template>
    <StudentLayout>
    <div class="p-6 min-h-screen bg-gray-50 dark:bg-[#121212]">
      <h1 class="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
        Signals <span class="bg-purple-100 text-purple-600 text-sm font-semibold px-3 py-1 rounded-full">{{ signals.length }} signals in months</span>
      </h1>
  
      <!-- Search bar -->
      <div class="flex justify-between items-center mb-6">
        <div class="relative w-[400px]">
          <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">🔍</span>
          <input
            type="text"
            v-model="search"
            placeholder="Search"
            class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-900 dark:text-white"
          />
        </div>
      </div>

      <!-- Search and Filter -->
      <div class="flex gap-3 mb-4">
        <select v-model="searchType" class="border rounded px-2 py-1">
          <option value="all">All</option>
          <option value="name">By Name</option>
          <option value="module">By Module</option>
          <option value="signal_state">By Signal State</option>
          <option value="solution_state">By Solution State</option>
        </select>
        <input
          v-model="search"
          type="text"
          placeholder="Search value"
          class="border rounded px-2 py-1"
          :disabled="searchType === 'all'"
        />
        <button @click="doSearch" class="bg-purple-600 text-white px-4 py-1 rounded">Search</button>
      </div>
  
      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="w-full bg-white dark:bg-gray-900 shadow rounded text-sm">
          <thead class="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-semibold">
            <tr>
              <th class="text-left p-3"><input type="checkbox" /></th>
              <th class="text-left p-3">Signal ID</th>
              <th class="text-left p-3">Reported User</th>
              <th class="text-left p-3">Signal State</th>
              <th class="text-left p-3">Solution State</th>
              <th class="text-left p-3">Review</th>
            </tr>
          </thead>
          <tbody>
             <tr v-if="signals.length === 0">
    <td colspan="6" class="text-center text-gray-500 py-6">No signals found.</td>
  </tr>
  <tr
    v-for="signal in filteredSignals"
    :key="signal.id_signal"
    class="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
  >
    <td class="p-3"><input type="checkbox" /></td>
    <td class="p-3">{{ signal.id_signal }}</td>
    <td class="p-3 flex items-center gap-2">
      <img :src="signal.profile_picture" class="w-8 h-8 rounded-full object-cover" />
      <div>
        <div class="font-medium text-gray-800 dark:text-white">{{ signal.full_name }}</div>
        <!-- Username non disponible -->
      </div>
    </td>
    <td class="p-3">
      <span :class="badgeClass(signal.signal_state)">{{ signal.signal_state }}</span>
    </td>
    <td class="p-3">
      <span :class="solutionClass(signal.solution_state)">{{ signal.solution_state }}</span>
    </td>
    <td class="p-3 text-purple-600 hover:underline cursor-pointer" @click="viewSignal(signal.id_signal)">
      View the Solution Taken →
    </td>
  </tr>
</tbody>
        </table>
      </div>
  
      <!-- Pagination -->
      <div class="flex justify-between items-center mt-6 text-sm text-gray-600 dark:text-white">
        <span>Page 1 of 10</span>
        <div class="space-x-2">
          <button class="px-4 py-2 border rounded border-gray-300 dark:border-gray-700">Previous</button>
          <button class="px-4 py-2 border rounded border-gray-300 dark:border-gray-700">Next</button>
        </div>
      </div>
    </div>
  </StudentLayout>
  </template>
  
  <script setup>
import { ref, onMounted, computed } from 'vue'
import api from '@/services/api'
import { useRouter } from 'vue-router'
import StudentLayout from '@/components/layout/StudentLayout.vue'

const router = useRouter()
const signals = ref([])
const searchType = ref('all')
const search = ref('')

const filteredSignals = computed(() => signals.value)

const doSearch = async () => {
  const token = localStorage.getItem('token')
  let url = '/api/student_signal_history/signal_history_all'
  if (searchType.value === 'name' && search.value) {
    url = `/api/student_signal_history/signal_history_search_id_all/${encodeURIComponent(search.value)}`
  } else if (searchType.value === 'module' && search.value) {
    url = `/api/student_signal_history/signal_history_search_module_all/${encodeURIComponent(search.value)}`
  } else if (searchType.value === 'signal_state' && search.value) {
    url = `/api/student_signal_history/signal_history_filtre_statesignal_all/${encodeURIComponent(search.value)}`
  } else if (searchType.value === 'solution_state' && search.value) {
    url = `/api/student_signal_history/signal_history_filtre_solutionsignal_all/${encodeURIComponent(search.value)}`
  }
  try {
    const res = await api.get(url, {
      headers: { Authorization: `Bearer ${token}` }
    })
    console.log('Signals fetched:', res.data)
    signals.value = res.data
  } catch (err) {
    if (err.response && err.response.status === 404) {
      signals.value = []
      // Affiche un message utilisateur si tu veux :
      // alert("Aucun signal trouvé.")
    } else {
      console.error('Erreur lors de la recherche :', err)
    }
  }
}

const viewSignal = (id_signal) => {
  router.push({ name: 'StudSolution', query: { id: id_signal } })
}

onMounted(doSearch)
</script>

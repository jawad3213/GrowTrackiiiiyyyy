<template>
    <ProfLayout>
    <div class="p-6 min-h-screen bg-gray-50 dark:bg-[#121212]">
      <h1 class="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
        Signals <span class="bg-purple-100 text-purple-600 text-sm font-semibold px-3 py-1 rounded-full">{{ signals.length }} signals in months</span>
      </h1>
  
      <!-- Search bar corrigée -->
      <div class="flex justify-between items-center mb-6">
        <div class="relative w-[400px] flex">
          <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">🔍</span>
          <input
            type="text"
            v-model="searchId"
            placeholder="Search by signal ID"
            class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-900 dark:text-white"
          />
          <button
            @click="searchBySignalId(searchId)"
            class="ml-2 bg-purple-600 text-white px-3 py-1 rounded"
          >
            Search
          </button>
        </div>
      </div>

      <!-- Filtres -->
      <div class="flex gap-4 mb-6">
        <select @change="filterBySignalState($event.target.value)" class="border rounded px-2 py-1">
          <option value="">All Signal States</option>
          <option value="approved">Approved</option>
          <option value="new">New</option>
        </select>
        <select @change="filterBySolutionState($event.target.value)" class="border rounded px-2 py-1">
          <option value="">All Solution States</option>
          <option value="Resolved">Resolved</option>
          <option value="In Progress">In Progress</option>
          <option value="Blocked">Blocked</option>
        </select>
        
        
        <button @click="fetchSignals" class="bg-gray-300 px-3 py-1 rounded">Reset</button>
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
            <tr
              v-for="signal in filteredSignals"
              :key="signal.id"
              class="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <td class="p-3"><input type="checkbox" /></td>
              <td class="p-3">{{ signal.signalId }}</td>
              <td class="p-3 flex items-center gap-2">
                <img :src="signal.avatar" class="w-8 h-8 rounded-full object-cover" />
                <div>
                  <div class="font-medium text-gray-800 dark:text-white">{{ signal.fullName }}</div>
                  <div class="text-xs text-gray-500">@{{ signal.username }}</div>
                </div>
              </td>
              <td class="p-3">
                <span :class="badgeClass(signal.status)">{{ signal.status }}</span>
              </td>
              <td class="p-3">
                <span :class="solutionClass(signal.solution)">{{ signal.solution }}</span>
              </td>
              <td class="p-3 text-purple-600 hover:underline cursor-pointer" @click="viewSignal(signal.id)">
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
</ProfLayout>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue'
 import api from '@/services/api'
  import { useRouter } from 'vue-router'
import ProfLayout from '@/components/layout/ProfLayout.vue'
  
  const router = useRouter()
  const signals = ref([])
  const search = ref('')
  const searchId = ref('')
  
  const fetchSignals = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await api.get('/api/signal_history/all_signal', {
        headers: { Authorization: `Bearer ${token}` }
      })

    const data = Array.isArray(res.data.result) ? res.data.result : []
      signals.value = data.map(s => ({
        id: s.id_signal,
        signalId: s.id_signal,
        avatar: s.profile_picture,
        fullName: s.full_name,
        username: s.cne,
        status: s.signal_state === 'approved' ? 'Approved' : 'New',
        solution: s.solution_state || 'No Action Taken'
      }))
      console.log('Signaux chargés avec succès:', signals.value)
    } catch (err) {
      console.error('Erreur chargement des signaux :', err)
    }
  }
  
  onMounted(fetchSignals)
  
  const filteredSignals = computed(() =>
  signals.value.filter((s) =>
    s.fullName.toLowerCase().includes(search.value.toLowerCase()) ||
    s.username.toLowerCase().includes(search.value.toLowerCase()) ||
    s.signalId.toString().includes(search.value)
  )
)
  
  const badgeClass = (status) => {
    if (status === 'Approved') return 'text-green-700 bg-green-100 px-2 py-1 rounded-full text-xs font-semibold'
    if (status === 'Rejected') return 'text-red-700 bg-red-100 px-2 py-1 rounded-full text-xs font-semibold'
    return 'text-blue-700 bg-blue-100 px-2 py-1 rounded-full text-xs font-semibold'
  }
  
  const solutionClass = (solution) => {
    if (solution === 'Resolved') return 'text-green-700 bg-green-100 px-2 py-1 rounded-full text-xs font-semibold'
    if (solution === 'In Progress') return 'text-pink-700 bg-pink-100 px-2 py-1 rounded-full text-xs font-semibold'
    if (solution === 'Blocked') return 'text-red-700 bg-red-100 px-2 py-1 rounded-full text-xs font-semibold'
    return 'text-gray-600 bg-gray-100 px-2 py-1 rounded-full text-xs font-semibold'
  }
  
  const viewSignal = (id) => {
    router.push(`/SolutionSignal?id=${id}`)
  }

  const filterBySignalState = async (statut) => {
    const token = localStorage.getItem('token')
    const res = await api.get(`/api/signal_history/filtre_signal_state/${statut}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
     console.log('Réponse backend:', res.data)
    const data = Array.isArray(res.data.result) ? res.data.result : [];
signals.value = data.map(s => ({
  id: s.id_signal,
  signalId: s.id_signal,
  avatar: s.profile_picture,
  fullName: s.full_name,
  username: s.cne,
  status: s.signal_state === 'approved' ? 'Approved' : 'New',
  solution: s.solution_state || 'No Action Taken'
}));
  }

  const filterBySolutionState = async (statut) => {
    const token = localStorage.getItem('token')
    const res = await api.get(`/api/signal_history/filtre_solution_state/${statut}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    const data = Array.isArray(res.data.result) ? res.data.result : [];
signals.value = data.map(s => ({
  id: s.id_signal,
  signalId: s.id_signal,
  avatar: s.profile_picture,
  fullName: s.full_name,
  username: s.cne,
  status: s.signal_state === 'approved' ? 'Approved' : 'New',
  solution: s.solution_state || 'No Action Taken'
}));
  }

  const searchBySignalId = async (id_signal) => {
  const token = localStorage.getItem('token')
  const res = await api.get(`/api/signal_history/search_signal_id/${id_signal}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  const data = Array.isArray(res.data.result) ? res.data.result : [];
signals.value = data.map(s => ({
  id: s.id_signal,
  signalId: s.id_signal,
  avatar: s.profile_picture,
  fullName: s.full_name,
  username: s.cne,
  status: s.signal_state === 'approved' ? 'Approved' : 'New',
  solution: s.solution_state || 'No Action Taken'
}));
}
  </script>

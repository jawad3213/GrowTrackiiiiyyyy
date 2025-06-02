<template>
    <ProfLayout>
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
  import axios from 'axios'
  import { useRouter } from 'vue-router'
import ProfLayout from '@/components/layout/ProfLayout.vue'
  
  const router = useRouter()
  const signals = ref([])
  const search = ref('')
  
  const fetchSignals = async () => {
    try {
      const res = await axios.get('http://localhost:3001/signals')
      signals.value = res.data
    } catch (err) {
      console.error('Erreur chargement des signaux :', err)
    }
  }
  
  onMounted(fetchSignals)
  
  const filteredSignals = computed(() =>
    signals.value.filter((s) =>
      s.fullName.toLowerCase().includes(search.value.toLowerCase())
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
  </script>
  
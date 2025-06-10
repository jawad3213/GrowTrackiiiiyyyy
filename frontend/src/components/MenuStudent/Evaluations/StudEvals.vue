<template>
    <StudentLayout>
    <div class="p-6 min-h-screen bg-gray-50 dark:bg-[#121212]">
      <h1 class="text-2xl font-bold flex items-center space-x-2 text-gray-800 dark:text-white">
    <span>Evaluations History</span>
    <span class="bg-purple-100 text-purple-600 text-sm font-semibold px-3 py-1 rounded-full dark:bg-purple-200/10 dark:text-purple-300">
      <!-- {{ avaluations.length }} evaluations(month) -->
    </span>
  </h1>
  
       <!-- Recherche  -->
        <div class="flex items-center gap-3 mt-6">
          <div class="relative w-[400px]">
            <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 dark:text-white/30">🔍</span>
            <input
              type="text"
              v-model="search"
              placeholder="Search "
              class="h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pl-10 pr-4 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-[#692CF3] focus:outline-none focus:ring-2 focus:ring-[#692CF3]/30 hover:border-[#692CF3] transition-colors duration-200 dark:border-gray-800 dark:bg-gray-900 dark:bg-white/[0.03] dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-[#692CF3]"
            />
          </div>
        </div>
  
      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="w-full bg-white dark:bg-gray-900 shadow rounded text-sm">
          <thead class="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-semibold">
            <tr>
              <th class="text-left p-3">Evaluated Full Name</th>
              <th class="text-left p-3">Module Name</th>
              <th class="text-left p-3">Project Name</th>
              <th class="text-left p-3">Registration Date</th>

            </tr>
          </thead>
          <tbody>
            <tr
              v-for="evaluation in filteredEvals"
              :key="evaluation.id"
              class="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <td class="p-3 flex items-center gap-2">
                <img :src="evaluation.avatar" class="w-8 h-8 rounded-full object-cover" />
                <div>
                  <div class="font-medium text-gray-800 dark:text-white">{{ evaluation.fullName }}</div>
                  <div class="text-xs text-gray-500">@{{ evaluation.username }}</div>
                </div>
              </td>
              <td class="p-3">{{ evaluation.moduleName }}</td>
              <td class="p-3">{{ evaluation.projectName }}</td>
              <td class="p-3">{{ evaluation.registrationdate }}</td>
              
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
  import { ref, computed, onMounted } from 'vue'
  import axios from 'axios'
  import { useRouter } from 'vue-router'
import StudentLayout from '@/components/layout/StudentLayout.vue'
  
  const router = useRouter()
  const evaluations = ref([])
  const search = ref('')
  
  const fetchEvals = async () => {
    try {
      const res = await axios.get('http://localhost:3001/studEvals')
      evaluations.value = res.data
    } catch (err) {
      console.error('Erreur chargement des signaux :', err)
    }
  }
  
  onMounted(fetchEvals)
  
  const filteredEvals = computed(() =>
    evaluations.value.filter((s) =>
      s.fullName.toLowerCase().includes(search.value.toLowerCase())
    )
  )
  
  
  

  </script>
  
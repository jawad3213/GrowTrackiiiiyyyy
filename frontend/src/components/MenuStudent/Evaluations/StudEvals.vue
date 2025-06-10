<template>
    <StudentLayout>
    <div class="p-6 min-h-screen bg-gray-50 dark:bg-[#121212]">
      <h1 class="text-2xl font-bold flex items-center space-x-2 text-gray-800 dark:text-white">
    <span>Evaluations History</span>
    <span class="bg-purple-100 text-purple-600 text-sm font-semibold px-3 py-1 rounded-full dark:bg-purple-200/10 dark:text-purple-300">
      {{ evaluations.length }} evaluations(month)
    </span>
  </h1>
  
       <!-- Recherche  -->
       <div class="flex gap-3 mb-4">
       <select v-model="searchType" class="border rounded px-2 py-1">
         <option value="all">All</option>
         <option value="evaluator">By Evaluator Name</option>
         <option value="module">By Module</option>
         <option value="project">By Project</option>
       </select>
       <div class="relative w-[400px]">
         <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 dark:text-white/30">🔍</span>
         <input
           type="text"
           v-model="search"
           placeholder="Search value"
           class="h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pl-10 pr-4 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-[#692CF3] focus:outline-none focus:ring-2 focus:ring-[#692CF3]/30 hover:border-[#692CF3] transition-colors duration-200 dark:border-gray-800 dark:bg-gray-900 dark:bg-white/[0.03] dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-[#692CF3]"
           :disabled="searchType === 'all'"
         />
       </div>
       <button @click="doSearch" class="bg-purple-600 text-white px-4 py-1 rounded">Search</button>
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
              v-for="evaluation in evaluations"
              :key="evaluation.id_evaluation"
              class="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <td class="p-3 flex items-center gap-2">
                <img :src="evaluation.profile_picture" class="w-8 h-8 rounded-full object-cover" />
                <div>
                  <div class="font-medium text-gray-800 dark:text-white">{{ evaluation.full_name }}</div>
                  <!-- Username non disponible, on peut l’omettre ou afficher un champ vide -->
                  <div class="text-xs text-gray-500"></div>
                </div>
              </td>
              <td class="p-3">{{ evaluation.course }}</td>
              <td class="p-3">{{ evaluation.name_project }}</td>
              <td class="p-3">{{ evaluation.date_add }}</td>
              
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
  import api from '@/services/api'
  import { useRouter } from 'vue-router'
import StudentLayout from '@/components/layout/StudentLayout.vue'
  
  const router = useRouter()
  const evaluations = ref([])
  const searchType = ref('all')
  const search = ref('')

  const doSearch = async () => {
    const token = localStorage.getItem('token')
    let url = '/api/student_evaluation_history/evaluation_history_all'
    if (searchType.value === 'evaluator' && search.value) {
      url = `/api/student_evaluation_history/evaluation_search_evaluator_name_history_all/${encodeURIComponent(search.value)}`
    } else if (searchType.value === 'module' && search.value) {
      url = `/api/student_evaluation_history/evaluation_search_module_history_all/${encodeURIComponent(search.value)}`
    } else if (searchType.value === 'project' && search.value) {
      url = `/api/student_evaluation_history/evaluation_search_project_history_all/${encodeURIComponent(search.value)}`
    }
    try {
      const res = await api.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      })
      evaluations.value = res.data
    } catch (err) {
      console.error('Erreur lors de la recherche :', err)
    }
  }

  onMounted(doSearch)
  </script>

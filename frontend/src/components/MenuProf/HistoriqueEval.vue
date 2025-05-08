<template>
    <admin-layout>
      <div class="flex min-h-screen bg-gray-50 dark:bg-gray-900 font-sans">
        <main class="flex-1 flex flex-col">
  
          <!-- Titre + compteur + barre de recherche en une seule ligne -->
<div class="flex items-center justify-between flex-wrap gap-4 p-6">
  <!-- Titre + compteur -->
  <h1 class="text-2xl font-bold flex items-center space-x-2 text-gray-800 dark:text-white">
    <span>Evaluation</span>
    <span class="bg-purple-100 text-purple-600 text-sm font-semibold px-3 py-1 rounded-full dark:bg-purple-200/10 dark:text-purple-300">
      {{ evaluations.length }} evaluations
    </span>
  </h1>

  <!-- Barre de recherche -->
  <div class="relative w-[400px]">
    <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 dark:text-white/30">
      🔍
    </span>
    <input
      type="text"
      v-model="search"
      placeholder="Search by Student ID, Course Status or Project Status"
      class="h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pl-10 pr-4 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400
             focus:border-[#692CF3] focus:outline-none focus:ring-2 focus:ring-[#692CF3]/30
             hover:border-[#692CF3] transition-colors duration-200
             dark:border-gray-800 dark:bg-gray-900 dark:bg-white/[0.03] dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-[#692CF3]"
    />
  </div>
</div>

  
          <!-- Tableau -->
          <div class="overflow-x-auto px-6 pb-6">
            <table class="min-w-full bg-white dark:bg-gray-800  shadow text-gray-800 dark:text-gray-100">
                <thead class="bg-gray-100 dark:bg-gray-700">
                <tr>
                  <th class="px-4 py-2 text-left text-sm font-medium">ID</th>
                  <th class="px-4 py-2 text-left text-sm font-medium">Full Name</th>
                  <th class="px-4 py-2 text-left text-sm font-medium">Levels</th>
                  <th class="px-4 py-2 text-left text-sm font-medium">Classe</th>
                  <th class="px-4 py-2 text-left text-sm font-medium">Type</th>
                  <th class="px-4 py-2 text-left text-sm font-medium">Submitted In</th>
                  <th class="px-4 py-2 text-left text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="evaluation in evaluations"
                  :key="evaluation.id"
                  class="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td class="px-4 py-2">{{ evaluation.id }}</td>
                  <td class="px-4 py-2">{{ evaluation.fullName }}</td>
                  <td class="px-4 py-2">{{ evaluation.level }}</td>
                  <td class="px-4 py-2">{{ evaluation.classe }}</td>
                  <td class="px-4 py-2">{{ evaluation.type }}</td>
                  <td class="px-4 py-2">{{ evaluation.submittedIn }}</td>
                  
                  <td class="p-3 text-purple-600 hover:underline cursor-pointer" @click="goToViewReport(evaluation.id)">View Report →</td>
                </tr>
              </tbody>
            </table>
          </div>
  
        </main>
      </div>
    </admin-layout>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import axios from 'axios'
  import AdminLayout from '../layout/ProfLayout.vue'
  import { useRouter } from 'vue-router'
  
  const evaluations = ref([])


  const router = useRouter()
  
  const fetchEvaluations = async () => {
    try {
      const response = await axios.get('http://localhost:3001/evaluations')
      evaluations.value = response.data
    } catch (error) {
      console.error('Erreur lors du chargement des évaluations:', error)
    }
  }

  const goToViewReport = (id) => {
    router.push(`/viewreport?id=${id}`)
  }
  
  onMounted(fetchEvaluations)
  </script>
  
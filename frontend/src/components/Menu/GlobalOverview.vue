<template>
  <admin-layout>
    <div class="relative min-h-screen bg-gray-50 dark:bg-gray-900 p-6 font-inter text-gray-800 dark:text-gray-100">
      <div :class="{ 'blur-sm pointer-events-none': showModal }">

        <!-- Graphique -->
        <div class="mb-6">
          <!--<StatisticsChart /> -->
        </div>

        <!-- Header tableau -->
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-bold">
            Evaluations
            <span class="text-sm text-gray-500 dark:text-gray-400">{{ evaluations.length }} evaluations</span>
          </h2>
          <div class="flex gap-2">
            <input
              v-model="search"
              type="text"
              placeholder="Search"
              class="px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm rounded-md text-gray-800 dark:text-white placeholder:text-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-purple-500"
            />
            <button class="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-sm bg-white dark:bg-gray-800 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
              Filters
            </button>
          </div>
        </div>

        <!-- Tableau -->
        <div class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-auto">
          <table class="min-w-full text-sm text-left">
            <thead class="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
              <tr>
                <th class="px-6 py-3 font-semibold">Evaluation ID</th>
                <th class="px-6 py-3 font-semibold">Evaluator name</th>
                <th class="px-6 py-3 font-semibold">Evaluated name</th>
                <th class="px-6 py-3 font-semibold">Submitted date</th>
                <th class="px-6 py-3 font-semibold">Type</th>
                <th class="px-6 py-3 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              
              <tr v-for="evaluation in filteredEvaluations" :key="evaluation.id_evaluation" class="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                <td class="px-6 py-4">{{ evaluation.id_evaluation }}</td>
                <td class="px-6 py-4">{{ evaluation.evaluator_full_name }}</td>
                <td class="px-6 py-4">{{ evaluation.student_full_name }}</td>
                <td class="px-6 py-4">{{new Date(evaluation.date_add).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric'  }) }}</td> <!-- Date formating -->
                <td class="px-6 py-4">{{ evaluation.type_evaluation }}</td>
                <td class="px-6 py-4">
                  <button @click="openEvaluation(evaluation)" class="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 3C5 3 1 10 1 10s4 7 9 7 9-7 9-7-4-7-9-7zm0 12a5 5 0 110-10 5 5 0 010 10zm0-8a3 3 0 100 6 3 3 0 000-6z" />
                    </svg>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="flex justify-between items-center mt-6 text-gray-600 dark:text-gray-300">
          <p>Page 1 of 10</p>
          <div class="flex gap-2">
            <button class="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-sm">Previous</button>
            <button class="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-sm">Next</button>
          </div>
        </div>
      </div>

      <!-- Overlay sombre -->
      <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-40 z-40"></div>

      <!-- Modale -->
      <EvaluationModal
        v-if="showModal"
        :id="selectedEvaluation"
        @fermer="showModal = false"
        class="fixed inset-0 z-50 flex items-center justify-center"
      />

      <!-- État de chargement -->
      <p v-if="loading" class="text-gray-500 dark:text-gray-400 mt-4">Loading evaluations...</p>
      <p v-if="error" class="text-red-500 mt-4">{{ error }}</p>
    </div>
  </admin-layout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import StatisticsChart from '../ecommerce/StatisticsChart.vue'
import EvaluationModal from '@/components/Evaluation.vue'
import api from '@/services/api'
import AdminLayout from '@/components/layout/AdminLayout.vue'

const loading = ref(false)
const error = ref(null)
const search = ref('')
const showModal = ref(false)
const selectedEvaluation = ref(null)
// Données statiques pour tester
const evaluations = ref([{}])

// Pour tester le filtre dynamique

 const filteredEvaluations = computed(() => {
  const filtered = evaluations.value.result
  return filtered
})


// Afficher modal
function openEvaluation(evaluation) {
  selectedEvaluation.value = evaluation.id_evaluation;
  showModal.value = true;
}


onMounted(async () => {
  loading.value = true;
  try {
    const res = await api.get('/api/GlobalOverView/all_evaluation')
    evaluations.value = res.data
  } catch (error) {
    console.error('Erreur lors du chargement des étudiants :', error)
  }finally{
    loading.value = false
  }
});
</script>

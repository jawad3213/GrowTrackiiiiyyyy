<template>
  <admin-layout>
    <div class="relative min-h-screen bg-gray-50 dark:bg-gray-900 p-6 font-inter text-gray-800 dark:text-gray-100">

      <!-- Contenu principal flouté si la modale est ouverte -->
      <div :class="{ 'blur-sm pointer-events-none': showModal }">

        <!-- Titre du tableau -->
        <div
          class="flex items-center justify-between p-6 mb-4
                 bg-white dark:bg-gray-800
                 border border-gray-200 dark:border-gray-700
                 rounded-md shadow-sm"
        >
          <h1 class="text-2xl font-bold flex items-center space-x-2 text-gray-800 dark:text-gray-100">
            <span>Evaluations</span>
            <span
              class="bg-purple-100 text-purple-600 text-sm font-semibold px-3 py-1 rounded-full
                     dark:bg-purple-200/10 dark:text-purple-300"
            >
              {{ filteredEvaluations.length }} Evaluations for this month
            </span>
          </h1>
              
          
        </div>

        <!-- Loader (affiché tant que loading == true) -->
        <div v-if="loading" class="flex justify-center items-center h-64">
          <div
            class="w-16 h-16 border-4 border-purple-600 border-t-transparent
                   rounded-full animate-spin"
            aria-label="Loading evaluations..."
          ></div>
        </div>

        <!-- Tableau DES ÉVALUATIONS (après chargement ET s’il y a des données) -->
        <div v-else-if="filteredEvaluations.length > 0" class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-auto">
          <table class="min-w-full text-sm text-left">
            <thead class="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th class="px-6 py-3 font-semibold text-gray-600 dark:text-gray-200">
                  Evaluation ID
                </th>
                <th class="px-6 py-3 font-semibold text-gray-600 dark:text-gray-200">
                  Evaluator name
                </th>
                <th class="px-6 py-3 font-semibold text-gray-600 dark:text-gray-200">
                  Evaluated name
                </th>
                <th class="px-6 py-3 font-semibold text-gray-600 dark:text-gray-200">
                  Submitted date
                </th>
                <th class="px-6 py-3 font-semibold text-gray-600 dark:text-gray-200">
                  Type
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="evaluation in filteredEvaluations"
                :key="evaluation.id_evaluation"
                class="odd:bg-white even:bg-gray-50
                       dark:odd:bg-gray-800 dark:even:bg-gray-700
                       hover:bg-gray-50 dark:hover:bg-gray-700
                       transition-colors duration-150 cursor-pointer"
                @click="openEvaluation(evaluation)"
              >
                <td class="px-6 py-4 text-gray-800 dark:text-gray-100">
                  {{ evaluation.id_evaluation }}
                </td>
                <td class="px-6 py-4 text-gray-800 dark:text-gray-100">
                  {{ evaluation.evaluator_full_name }}
                </td>
                <td class="px-6 py-4 text-gray-800 dark:text-gray-100">
                  {{ evaluation.student_full_name }}
                </td>
                <td class="px-6 py-4 text-gray-800 dark:text-gray-100">
                  {{
                    new Date(evaluation.date_add).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })
                  }}
                </td>
                <td class="px-6 py-4 text-gray-800 dark:text-gray-100">
                  {{ evaluation.type_evaluation }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Si pas d’évaluations (après chargement ET filteredEvaluations est vide) -->
        <div
          v-else
          class="flex flex-col items-center justify-center text-center
                 text-gray-600 dark:text-gray-300 py-20"
        >
          <div class="text-6xl mb-4">🔍</div>
          <p class="text-lg font-semibold mb-2">No evaluations found</p>
          <p class="mb-6">There are no evaluations to display.</p>
        </div>

      </div>

      <!-- Overlay sombre si la modale est ouverte -->
      <div
        v-if="showModal"
        class="fixed inset-0 bg-black bg-opacity-40 z-40"
      ></div>

      <!-- Modale d’évaluation (centrée) -->
      <EvaluationModal
        v-if="showModal"
        :id="selectedEvaluation"
        @fermer="showModal = false"
        class="fixed inset-0 z-50 flex items-center justify-center"
      />

      <!-- Affiche l’erreur si l’appel API a échoué -->
      <p v-if="error" class="text-red-500 mt-4">{{ error }}</p>
    </div>
  </admin-layout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import EvaluationModal from '@/components/Evaluation.vue'
import api from '@/services/api'
import AdminLayout from '@/components/layout/AdminLayout.vue'

const loading = ref(false)
const error = ref(null)
const showModal = ref(false)
const selectedEvaluation = ref(null)

// Contiendra la réponse brute de l’API : { result: [...] }
const rawEvaluations = ref([])

// Computed pour extraire la liste des évaluations sans planter si rawEvaluations n’est pas encore défini
const filteredEvaluations = computed(() => {
  return Array.isArray(rawEvaluations.value.result)
    ? rawEvaluations.value.result
    : []
})

// Ouvre la modale en passant l’ID de l’évaluation
function openEvaluation(evaluation) {
  selectedEvaluation.value = evaluation.id_evaluation
  showModal.value = true
}

onMounted(async () => {
  loading.value = true
  try {
    const res = await api.get('/api/GlobalOverView/all_evaluation')
    // Ici on suppose que l’API renvoie un objet { result: [ ... ] }
    rawEvaluations.value = res.data
  } catch (err) {
    console.error('Erreur lors du chargement des évaluations :', err)
    error.value = 'Failed to load evaluations.'
    rawEvaluations.value = { result: [] }
  } finally {
    loading.value = false
  }
})
</script>

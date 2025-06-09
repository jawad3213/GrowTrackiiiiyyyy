<template>
  <admin-layout>
    <div class="flex min-h-screen bg-gray-50 dark:bg-gray-900 font-sans">
      <main class="flex-1 flex flex-col">
        <!-- Header -->
        <div class="flex items-center justify-between flex-wrap gap-4 p-6">
          <h1 class="text-2xl font-bold flex items-center space-x-2 text-gray-800 dark:text-white">
            <span>Evaluation</span>
            <span
              class="bg-purple-100 text-purple-600 text-sm font-semibold px-3 py-1 rounded-full dark:bg-purple-200/10 dark:text-purple-300"
            >
              {{ filteredEvaluations.length }} evaluations
            </span>
          </h1>
          <!-- (filters & search slots here) -->
        </div>

        <!-- Error message -->
        <div v-if="errorMessage" class="px-6 pb-4 text-red-600 dark:text-red-400">
          {{ errorMessage }}
        </div>

        <!-- Table or Loader -->
        <div class="overflow-x-auto px-6 pb-6">
          <!-- Loader -->
          <div v-if="isLoading" class="flex justify-center items-center h-40">
            <div
              class="w-10 h-10 border-4 border-t-transparent border-purple-500 rounded-full animate-spin"
            ></div>
          </div>

          <!-- Evaluations Table -->
          <table
            v-else
            class="min-w-full bg-white dark:bg-gray-800 shadow text-gray-800 dark:text-gray-100"
          >
            <thead class="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th class="px-4 py-2 text-left text-sm font-medium">ID</th>
                <th class="px-4 py-2 text-left text-sm font-medium">Full Name</th>
                <th class="px-4 py-2 text-left text-sm font-medium">Level</th>
                <th class="px-4 py-2 text-left text-sm font-medium">Class</th>
                <th class="px-4 py-2 text-left text-sm font-medium">Type</th>
                <th class="px-4 py-2 text-left text-sm font-medium">Submitted In</th>
                <th class="px-4 py-2 text-left text-sm font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="evaluation in filteredEvaluations"
                :key="evaluation.id"
                class="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <td class="px-4 py-2">{{ evaluation.id }}</td>
                <td class="px-4 py-2">{{ evaluation.fullName }}</td>
                <td class="px-4 py-2">{{ evaluation.level }}</td>
                <td class="px-4 py-2">{{ evaluation.classe }}</td>
                <td class="px-4 py-2">{{ evaluation.type }}</td>
                <td class="px-4 py-2">{{ evaluation.submittedIn }}</td>
                <td class="p-3">
                  <button
                    @click="goToViewReport(evaluation.id)"
                    class="inline-flex items-center space-x-1 bg-purple-100 hover:bg-purple-200 text-purple-600 font-bold px-4 py-2 rounded transition"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="w-5 h-5"
                      viewBox="0 -960 960 960"
                      fill="currentColor"
                    >
                      <path
                        d="m560-240-56-58 142-142H160v-80h486L504-662l56-58 240 240-240 240Z"
                      />
                    </svg>
                    <span>View Evaluation</span>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  </admin-layout>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import api from '@/services/api'
import AdminLayout from '@/components/layout/ProfLayout.vue'
import { useRouter } from 'vue-router'
import { debounce } from 'lodash'

const evaluations = ref([])
const search = ref('')
const levelFilter = ref('')
const classFilter = ref('')
const typeFilter = ref('')
const levels = ref([])
const classes = ref([])
const types = ref([])
const errorMessage = ref('')
const isLoading = ref(false)           // ← loader state
const router = useRouter()

// Fetch all evaluations
const fetchEvaluations = async () => {
  isLoading.value = true
  try {
    const token = localStorage.getItem('token')
    const response = await api.get('/api/prof_evaluation_history/evaluation_all', {
      headers: { Authorization: `Bearer ${token}` }
    })
    const data = response.data.result || []
    evaluations.value = data.map(item => ({
      id: item.id_evaluation,
      fullName: item.full_name,
      level: item.sector_id,
      classe: item.id_class,
      type: item.evaluation_context,
      submittedIn: new Date(item.date_add).toLocaleDateString(),
    }))
    errorMessage.value = ''
  } catch (err) {
    console.error('Erreur lors du chargement des évaluations:', err)
    errorMessage.value =
      err.response?.data?.message || 'Failed to load evaluations. Please try again.'
    evaluations.value = []
  } finally {
    isLoading.value = false
  }
}

// Fetch filter dropdown options
const fetchFilterOptions = async () => {
  try {
    const token = localStorage.getItem('token')
    const response = await api.get('/api/prof_evaluation_history/evaluation_all', {
      headers: { Authorization: `Bearer ${token}` }
    })
    const data = response.data.result || []
    levels.value = [...new Set(data.map(i => i.sector_id))].sort()
    classes.value = [...new Set(data.map(i => i.id_class))].sort()
    types.value = [...new Set(data.map(i => i.evaluation_context))].sort()
  } catch (err) {
    console.error('Erreur lors du chargement des filtres:', err)
  }
}

// Debounced search by ID
const searchEvaluations = debounce(async (term) => {
  if (!term) {
    return fetchEvaluations()
  }
  if (!/^\d+$/.test(term)) {
    errorMessage.value = 'Please enter a valid numeric ID.'
    evaluations.value = []
    return
  }
  isLoading.value = true
  try {
    const token = localStorage.getItem('token')
    const res = await api.get(
      `/api/prof_evaluation_history/search_by_id_evaluation/${term}`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
    const data = res.data.result || []
    evaluations.value = data.map(item => ({
      id: item.id_evaluation,
      fullName: item.full_name,
      level: item.sector_id,
      classe: item.id_class,
      type: item.evaluation_context,
      submittedIn: new Date(item.date_add).toLocaleDateString(),
    }))
    errorMessage.value = data.length ? '' : 'No evaluations found.'
  } catch (err) {
    console.error('Erreur lors de la recherche:', err)
    errorMessage.value =
      err.response?.data?.message || 'Search failed. Please try again.'
    evaluations.value = []
  } finally {
    isLoading.value = false
  }
}, 500)

watch(search, searchEvaluations)

const filteredEvaluations = computed(() => evaluations.value)

const goToViewReport = (id) => {
  router.push(`/ViewEval?id=${id}`)
}

onMounted(() => {
  fetchEvaluations()
  fetchFilterOptions()
})
</script>

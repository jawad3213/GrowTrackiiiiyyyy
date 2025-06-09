<template>
  <admin-layout>
    <div class="relative min-h-screen bg-gray-50 dark:bg-gray-900 p-6 font-inter text-gray-800 dark:text-gray-100">
      <!-- header -->
      <div
        class="flex items-center justify-between p-6 mb-4
               bg-white dark:bg-gray-800
               border border-gray-200 dark:border-gray-700
               rounded-md shadow-sm"
      >
        <h1 class="text-2xl font-bold flex items-center space-x-2">
          <span>Evaluations</span>
          <span
            class="bg-purple-100 text-purple-600 text-sm font-semibold px-3 py-1 rounded-full
                   dark:bg-purple-200/10 dark:text-purple-300"
          >
            {{ filteredEvaluations.length }} this month
          </span>
        </h1>
      </div>

      <!-- loader -->
      <div v-if="loading" class="flex justify-center items-center h-64">
        <div class="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
      </div>

      <!-- table -->
      <div v-else-if="filteredEvaluations.length" class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-auto">
        <table class="min-w-full text-sm text-left">
          <thead class="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th class="px-6 py-3">ID</th>
              <th class="px-6 py-3">Evaluator</th>
              <th class="px-6 py-3">Student</th>
              <th class="px-6 py-3">Date</th>
              <th class="px-6 py-3">Type</th>
              <th class="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="ev in filteredEvaluations"
              :key="ev.id_evaluation"
              class="odd:bg-white even:bg-gray-50 dark:odd:bg-gray-800 dark:even:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <td class="px-6 py-4">{{ ev.id_evaluation }}</td>

              <!-- Evaluator -->
              <td class="px-6 py-4">
                <div class="flex items-center space-x-3">
                  <div
                    class="w-8 h-8 rounded-full flex items-center justify-center text-white border border-gray-200"
                    :style="{ backgroundColor: stringToColor(ev.evaluator_full_name) }"
                  >
                    {{ ev.evaluator_full_name.charAt(0).toUpperCase() }}
                  </div>
                  <div>
                    <p class="font-medium">{{ ev.evaluator_full_name }}</p>
                    <p class="text-xs text-gray-500">{{ ev.evaluator_role }}</p>
                  </div>
                </div>
              </td>

              <!-- Student -->
              <td class="px-6 py-4">
                <div class="flex items-center space-x-3">
                  <div
                    class="w-8 h-8 rounded-full flex items-center justify-center text-white border border-gray-200"
                    :style="{ backgroundColor: stringToColor(ev.student_full_name) }"
                  >
                    {{ ev.student_full_name.charAt(0).toUpperCase() }}
                  </div>
                  <div>
                    <p class="font-medium">{{ ev.student_full_name }}</p>
                    <p class="text-xs text-gray-500">{{ ev.student_role }}</p>
                  </div>
                </div>
              </td>

              <!-- Date -->
              <td class="px-6 py-4">
                {{ new Date(ev.date_add).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) }}
              </td>

              <!-- Type -->
              <td class="px-6 py-4">{{ ev.type_evaluation }}</td>

              <!-- Actions Button -->
              <td class="px-6 py-4">
                <ShowDetailsButton :id="ev.id_evaluation" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- empty state -->
      <div v-else class="flex flex-col items-center justify-center py-20 text-gray-600 dark:text-gray-300">
        <div class="text-6xl mb-4">🔍</div>
        <p class="text-lg font-semibold mb-2">No evaluations found</p>
      </div>
    </div>
  </admin-layout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '@/services/api'
import ShowDetailsButton from '@/components/ShowDetailsButton.vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'

const loading = ref(false)
const error = ref(null)
const raw = ref([])

onMounted(async () => {
  loading.value = true
  try {
    const res = await api.get('/api/GlobalOverView/all_evaluation')
    raw.value = res.data.result || []
  } catch {
    raw.value = []
  } finally {
    loading.value = false
  }
})

const filteredEvaluations = computed(() =>
  [...raw.value].sort((a, b) => new Date(a.date_add) - new Date(b.date_add))
)

/**
 * Returns a reproducible HSL color from a string.
 */
const stringToColor = (str) => {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  const h = Math.abs(hash) % 360
  return `hsl(${h}, 50%, 60%)`
}
</script>

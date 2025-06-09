<template>
  <AdminLayout>
   
      <!-- Titre + Nombre de signals -->
      <div
        class="flex items-center justify-between p-6 mb-4
               bg-white dark:bg-gray-800
               border border-gray-200 dark:border-gray-700
               rounded-md shadow-sm"
      >
        <h1 class="text-2xl font-bold flex items-center space-x-2 text-gray-800 dark:text-gray-100">
          <span>Signals</span>
          <span
            class="bg-purple-100 text-purple-600 text-sm font-semibold px-3 py-1 rounded-full
                   dark:bg-purple-200/10 dark:text-purple-300"
          >
            {{ filteredSignals.length }} Signals for this month
          </span>
        </h1>
        <!-- (Barre de recherche ou autre bouton peuvent venir ici) -->
      </div>

      <!-- Loader -->
      <div v-if="isLoading" class="flex justify-center items-center h-64">
        <div
          class="w-16 h-16 border-4 border-purple-600 border-t-transparent
                 rounded-full animate-spin"
          aria-label="Loading signals..."
        ></div>
      </div>

      <!-- Tableau des signals -->
      <div v-else-if="filteredSignals.length > 0" class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-auto">
        <table class="min-w-full text-sm text-left">
          <thead class="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th class="px-6 py-3 font-semibold text-gray-600 dark:text-gray-200">Signal ID</th>
              <th class="px-6 py-3 font-semibold text-gray-600 dark:text-gray-200">Reported By</th>
              <th class="px-6 py-3 font-semibold text-gray-600 dark:text-gray-200">Reported User</th>
              <th class="px-6 py-3 font-semibold text-gray-600 dark:text-gray-200">Solution State</th>
              <th class="px-6 py-3 font-semibold text-gray-600 dark:text-gray-200">Review</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="signal in filteredSignals"
              :key="signal.id_signal"
              class="odd:bg-white even:bg-gray-50
                     dark:odd:bg-gray-800 dark:even:bg-gray-700
                     hover:bg-gray-50 dark:hover:bg-gray-700
                     transition-colors duration-150 cursor-pointer"
              @click="openSignal(signal)"
            >
              <!-- Signal ID -->
              <td class="px-6 py-4 text-gray-800 dark:text-gray-100">
                {{ signal.id_signal }}
              </td>

              <!-- Reported By with fallback -->
              <td class="px-6 py-4">
                <div class="flex items-center space-x-3">
                  <template v-if="signal.reporterAvatar">
                    <img
                      :src="signal.reporterAvatar"
                      alt="Reporter Avatar"
                      class="w-8 h-8 rounded-full object-cover border border-gray-200"
                    />
                  </template>
                  <template v-else>
                    <div
                      class="w-8 h-8 rounded-full flex items-center justify-center text-white border border-gray-200"
                      :style="{ backgroundColor: stringToColor(signal.reporder_name) }"
                    >
                      {{ signal.reporder_name.charAt(0).toUpperCase() }}
                    </div>
                  </template>
                  <div>
                    <p class="font-medium text-gray-800 dark:text-gray-100">
                      {{ signal.reporder_name }}
                    </p>
                    <p class="text-xs text-gray-500 dark:text-gray-300">
                      {{ signal.reporder_role }}
                    </p>
                  </div>
                </div>
              </td>

              <!-- Reported User with fallback -->
              <td class="px-6 py-4">
                <div class="flex items-center space-x-3">
                  <template v-if="signal.userAvatar">
                    <img
                      :src="signal.userAvatar"
                      alt="Reported User Avatar"
                      class="w-8 h-8 rounded-full object-cover border border-gray-200"
                    />
                  </template>
                  <template v-else>
                    <div
                      class="w-8 h-8 rounded-full flex items-center justify-center text-white border border-gray-200"
                      :style="{ backgroundColor: stringToColor(signal.reported_name) }"
                    >
                      {{ signal.reported_name.charAt(0).toUpperCase() }}
                    </div>
                  </template>
                  <div>
                    <p class="font-medium text-gray-800 dark:text-gray-100">
                      {{ signal.reported_name }}
                    </p>
                    <p class="text-xs text-gray-500 dark:text-gray-300">
                      {{ signal.reported_role }}
                    </p>
                  </div>
                </div>
              </td>

              <!-- Solution State -->
              <td class="px-6 py-4">
                <span :class="solutionBadge(signal.solution_state || 'No Action Taken')">
                  {{ signal.solution_state || 'No Action Taken' }}
                </span>
              </td>

              <!-- Review Button -->
              <td class="px-6 py-4">
                <ShowSignalDetailsButton :id="signal.id_signal" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pas de signaux -->
      <div
        v-else
        class="flex flex-col items-center justify-center text-center
               text-gray-600 dark:text-gray-300 py-20"
      >
        <div class="text-6xl mb-4">🔍</div>
        <p class="text-lg font-semibold mb-2">No signals found</p>
        <p class="mb-6">There are no signals to display.</p>
      </div>

      <!-- Overlay & Modal -->
     
      
    
  </AdminLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '@/services/api'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import SignalEvaluationModal from '@/components/SignalEvaluationModal.vue'
import ShowSignalDetailsButton from '@/components/ShowSignalDetailsButton.vue'

const search = ref('')
const signals = ref([])
const selectedSignal = ref(null)
const showModal = ref(false)
const isLoading = ref(true)

onMounted(async () => {
  try {
    const res = await api.get('/admin/signals')
    signals.value = res.data.data
  } catch (error) {
    console.error('Erreur chargement signals :', error)
  } finally {
    isLoading.value = false
  }
})

const filteredSignals = computed(() =>
  signals.value
    .filter((s) =>
      s.reporder_name.toLowerCase().includes(search.value.toLowerCase()) ||
      s.reported_name.toLowerCase().includes(search.value.toLowerCase()) ||
      s.reason.toLowerCase().includes(search.value.toLowerCase())
    )
    .sort((a, b) => new Date(b.date_add) - new Date(a.date_add))
)

function openSignal(signal) {
  selectedSignal.value = signal
  showModal.value = true
}

const solutionBadge = (solution) =>
  ({
    'No Action Taken': 'bg-gray-200 text-gray-600',
    'In Progress': 'bg-purple-100 text-purple-600',
    'Blocked': 'bg-red-100 text-red-600',
    'Approved': 'bg-green-100 text-green-600'
  }[solution] || 'bg-gray-200 text-gray-600') +
  ' px-3 py-1 rounded-full text-xs font-semibold'

/**
 * Same helper to generate a consistent HSL color from a string
 */
const stringToColor = (str) => {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  const hue = Math.abs(hash) % 360
  return `hsl(${hue}, 50%, 60%)`
}
</script>

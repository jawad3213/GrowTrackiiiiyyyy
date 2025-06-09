<template>
  <AdminLayout>
    <div class="relative min-h-screen bg-gray-50 dark:bg-gray-900 p-6 font-inter text-gray-800 dark:text-gray-100">
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

      <!-- Loader (affiché tant que isLoading == true) -->
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
              <!-- Signal ID -->
              <th class="px-6 py-3 font-semibold text-gray-600 dark:text-gray-200">
                Signal ID
              </th>

              <!-- Reported By (fusion photo + nom + rôle) -->
              <th class="px-6 py-3 font-semibold text-gray-600 dark:text-gray-200">
                Reported By
              </th>

              <!-- Reported User (fusion photo + nom + rôle) -->
              <th class="px-6 py-3 font-semibold text-gray-600 dark:text-gray-200">
                Reported User
              </th>

              <!-- Solution State -->
              <th class="px-6 py-3 font-semibold text-gray-600 dark:text-gray-200">
                Solution State
              </th>

              <!-- Review -->
              <th class="px-6 py-3 font-semibold text-gray-600 dark:text-gray-200">
                Review
              </th>
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

              <!-- Reported By (photo + nom + rôle) -->
              <td class="px-6 py-4">
                <div class="flex items-center space-x-3">
                  <!-- Avatar -->
                  <img
                    :src="signal.reporterAvatar"
                    alt="Reporter Avatar"
                    class="w-8 h-8 rounded-full object-cover border border-gray-200"
                  />
                  <!-- Nom + rôle -->
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

              <!-- Reported User (photo + nom + rôle) -->
              <td class="px-6 py-4">
                <div class="flex items-center space-x-3">
                  <!-- Avatar -->
                  <img
                    :src="signal.userAvatar"
                    alt="Reported User Avatar"
                    class="w-8 h-8 rounded-full object-cover border border-gray-200"
                  />
                  <!-- Nom + rôle -->
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
                <router-link
                  :to="`/SignalModal/${signal.id_signal}`"
                  class="text-blue-500 hover:text-blue-700 transform hover:scale-110 transition-transform duration-150"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#8C1AF6">
                    <path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Zm0-300Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z"/>
                  </svg>
                </router-link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Si pas de signaux (après chargement ET filteredSignals est vide) -->
      <div
        v-else
        class="flex flex-col items-center justify-center text-center
               text-gray-600 dark:text-gray-300 py-20"
      >
        <div class="text-6xl mb-4">🔍</div>
        <p class="text-lg font-semibold mb-2">No signals found</p>
        <p class="mb-6">There are no signals to display.</p>
      </div>

      <!-- Overlay sombre si la modale est ouverte -->
      <div
        v-if="showModal"
        class="fixed inset-0 bg-black bg-opacity-40 z-40"
      ></div>

      <!-- Modal d’évaluation du signal -->
      <SignalEvaluationModal
        v-if="showModal"
        :signal="selectedSignal"
        @fermer="showModal = false"
        class="fixed inset-0 z-50 flex items-center justify-center"
      />
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '@/services/api'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import SignalEvaluationModal from '@/components/SignalEvaluationModal.vue'

const search = ref('')
const signals = ref([])
const selectedSignal = ref(null)
const showModal = ref(false)
const isLoading = ref(true)

// Récupération des signaux depuis l’API
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

// Computed pour filtrer (si vous ajoutez une barre de recherche)
const filteredSignals = computed(() => {
  return signals.value
    .filter((s) =>
      s.reporder_name.toLowerCase().includes(search.value.toLowerCase()) ||
      s.reported_name.toLowerCase().includes(search.value.toLowerCase()) ||
      s.reason.toLowerCase().includes(search.value.toLowerCase())
    )
    .sort((a, b) => new Date(b.date_add) - new Date(a.date_add))
})

// Ouvre la modale en passant le signal sélectionné
function openSignal(signal) {
  selectedSignal.value = signal
  showModal.value = true
}

/**
 * Applique un style (couleur) sur la solution_state
 */
const solutionBadge = (solution) => {
  return (
    (
      {
        'No Action Taken': 'bg-gray-200 text-gray-600',
        'in progress': 'bg-purple-100 text-purple-600',
        'Blocked': 'bg-red-100 text-red-600',
        'Approved': 'bg-green-100 text-green-600'
      }[solution] || 'bg-gray-200 text-gray-600'
    ) + ' px-3 py-1 rounded-full text-xs font-semibold'
  )
}
</script>

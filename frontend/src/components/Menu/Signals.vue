<template>
  <AdminLayout>
    <div class="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen font-inter text-gray-800 dark:text-gray-100">
      <!-- Titre -->
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-xl font-bold">
          Signals
          <span class="bg-purple-100 text-purple-600 text-sm font-semibold px-3 py-1 rounded-full dark:bg-purple-300/10 dark:text-purple-300">
            {{ signals.length }} signals in months
          </span>
        </h1>

        <!-- Recherche -->
        
      </div>

      <!-- Tableau -->
      <div class="overflow-x-auto">
        <table class="w-full text-sm bg-white dark:bg-gray-800 rounded shadow">
          <thead class="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
            <tr>
              
              <th class="p-3 text-left">Signal ID</th>
              <th class="p-3 text-left">Reported By</th>
              <th class="p-3 text-left">Reported User</th>
              <th class="p-3 text-left">Signal State</th>
              <th class="p-3 text-left">Solution State</th>
              <th class="p-3 text-left">Review</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="signal in filteredSignals"
              :key="signal.id_signal"
              class="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
            >
              <td class="p-3">{{ signal.id_signal }}</td>

              <td class="p-3 flex items-center gap-2">
                <img :src="signal.reporder_profile_picture_url" class="w-8 h-8 rounded-full object-cover" loading="lazy" />
                <div>
                  <div class="font-semibold">{{ signal.reporder_name }}</div>
                  <div class="text-xs text-gray-500 dark:text-gray-400">{{ signal.reporder_role }}</div>
                </div>
              </td>
              <td>
              <td class="p-3 flex items-center gap-2">
                <img :src="signal.reported_profile_picture_url" crossorigin="anonymous" class="w-8 h-8 rounded-full object-cover" loading="lazy" />
                <div>
                  <div class="font-semibold">{{ signal.reported_name }}</div>
                  <div class="text-xs text-gray-500 dark:text-gray-400">{{ signal.reported_role }}</div>
                </div>
              </td>
              </td>
            

              <td class="p-3">
                <span :class="badgeClass(signal.approved)">{{ signal.approved }}</span>
              </td>

              <td class="p-3">
                <span :class="solutionBadge(signal.solution_state || 'No Action Taken')">{{ signal.solution_state || 'No Action Taken'}}</span>
              </td>

              <td class="p-3">
                <button @click="openSignal(signal)" class="px-2 py-5 text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300">
                  <i class="fas fa-file-alt"></i> 
                  Click me
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
     

      <!-- Modal -->
      <SignalEvaluationModal v-if="showModal" :signal="selectedSignal" @fermer="showModal = false" />
    </div>
  </AdminLayout>
</template>


<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '@/services/api'
import AdminLayout from '../layout/AdminLayout.vue'
import SignalEvaluationModal from '@/components/SignalEvaluationModal.vue'

const search = ref('')
const signals = ref([])
const selectedSignal = ref(null)
const showModal = ref(false)

// Appel API direct
onMounted(async () => {
  try {
    const res = await api.get('/admin/signals') // adapte l’URL à ton backend
    signals.value = res.data.data
    console.log(res.data)
  } catch (error) {
    console.error('Erreur chargement signals :', error)
  }
})

const filteredSignals = computed(() =>{
     const filtered = signals.value.filter((s) =>
    s.reporder_name.toLowerCase().includes(search.value.toLowerCase()) ||
    s.reported_name.toLowerCase().includes(search.value.toLowerCase()) ||
    s.reason.toLowerCase().includes(search.value.toLowerCase())
  ) 
return filtered.sort((a, b) => a.date_add - b.date_add)
}
)

function openSignal(signal) {
  selectedSignal.value = signal
  showModal.value = true
}

const badgeClass = (state) => {
  return {
    New: 'bg-blue-100 text-blue-600',
    Approved: 'bg-green-100 text-green-600',
    Rejected: 'bg-red-100 text-red-600'
  }[state] + ' px-3 py-1 rounded-full text-xs font-semibold'
}

const solutionBadge = (solution) => {
  return {
    'No Action Taken': 'bg-gray-200 text-gray-600',
    'in progress': 'bg-purple-100 text-purple-600',
    Blocked: 'bg-red-100 text-red-600'
  }[solution] + ' px-3 py-1 rounded-full text-xs font-semibold'
}
</script>
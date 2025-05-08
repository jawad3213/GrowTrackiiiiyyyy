<template>
  <div class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4 py-10 overflow-auto z-50">
    <div class="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full relative">

      <!-- Bouton Fermer -->
      <button @click="closeModal" class="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl font-bold">
        &times;
      </button>

      <!-- Titre -->
      <h1 class="text-4xl font-black text-center mb-8">
        Signals <span class="bg-red-500 text-white px-3 py-1 rounded">History</span>
      </h1>

      <!-- Tableau -->
      <table class="w-full text-sm text-center border-collapse">
        <thead class="bg-gray-100 text-gray-800 font-semibold">
          <tr>
            <th class="py-2">Date</th>
            <th class="py-2">Reported By</th>
            <th class="py-2">Role</th>
            <th class="py-2">Signal Status</th>
            <th class="py-2">Solution Status</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="signal in signalHistory"
            :key="signal.id"
            class="border-t border-gray-200 hover:bg-gray-50"
          >
            <td class="py-2">{{ signal.date }}</td>
            <td class="py-2">{{ signal.reportedBy }}</td>
            <td class="py-2">{{ signal.role }}</td>
            <td class="py-2">
              <span :class="statusClass(signal.status)">{{ signal.status }}</span>
            </td>
            <td class="py-2">
              <span :class="solutionClass(signal.solution)">{{ signal.solution }}</span>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Bouton Retour -->
      <div class="mt-8 text-center">
        <button @click="closeModal" class="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-10 rounded shadow">
          Go Back
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const route = useRoute()
const studentId = route.query.id

const signalHistory = ref([])

const classId = route.query.classId

  function closeModal() {
    router.push({ path: '/ClassesSignal', query: { classId } })

  }

const fetchHistory = async () => {
  try {
    const res = await axios.get(`http://localhost:3001/signals?studentId=${studentId}`)
    signalHistory.value = res.data
  } catch (err) {
    console.error("Erreur chargement historique:", err)
  }
}

const statusClass = (status) => {
  return status === 'Approved'
    ? 'text-green-700 bg-green-100 px-2 py-1 rounded-full text-xs font-semibold'
    : 'text-red-700 bg-red-100 px-2 py-1 rounded-full text-xs font-semibold'
}

const solutionClass = (solution) => {
  if (solution === 'Resolved') {
    return 'text-green-700 bg-green-100 px-2 py-1 rounded-full text-xs font-semibold'
  } else if (solution === 'In Progress') {
    return 'text-pink-700 bg-pink-100 px-2 py-1 rounded-full text-xs font-semibold'
  } else if (solution === 'Blocked') {
    return 'text-red-700 bg-red-100 px-2 py-1 rounded-full text-xs font-semibold'
  } else {
    return 'text-gray-600 bg-gray-100 px-2 py-1 rounded-full text-xs font-semibold'
  }
}

onMounted(fetchHistory)
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/60 px-4 py-8">
    <div class="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-xl relative border border-purple-400">

      <!-- Bouton de fermeture -->
      <button @click="router.back()" class="absolute top-4 right-4 text-gray-400 hover:text-gray-800 text-2xl font-bold">
        &times;
      </button>

      <!-- Titre -->
      <h2 class="text-2xl font-bold mb-8 text-center text-gray-800">Solutions Details</h2>

      <form  v-if="solution"  class="space-y-6">
        <!-- Solution Type -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Solution Type</label>
          <input type="text" class="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-100 text-gray-700" :value="solution.solutionType" readonly />
        </div>

        <!-- Coach Name -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Coach Name</label>
          <input type="text" class="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-100 text-gray-700" :value="solution.coachName" readonly />
        </div>

        <!-- Details -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Solutions Details</label>
          <textarea class="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-100 text-gray-700 h-28 resize-none" :value="solution.details" readonly></textarea>
        </div>

        <!-- Dates -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Date of Beginning*</label>
            <input type="text" class="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-100 text-gray-700" :value="solution.startDate" readonly />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Date of Ending*</label>
            <input type="text" class="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-100 text-gray-700" :value="solution.endDate" readonly />
          </div>
        </div>

        <!-- Return Button -->
        <button type="button" @click="router.back()" class="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg font-semibold transition duration-200">
          Return
        </button>
      </form>
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const router = useRouter()

const solution = ref(null)


const fetchSolution = async () => {
  try {
    const response = await axios.get(`http://localhost:3001/solutions?signalId=${Number(route.query.id)}`)
    console.log('données recues ',response.data)
    if (response.data.length > 0) {
      solution.value = response.data[0] //donne le premier (et souvent seul) objet correspondant à ce signal.
    } else {
      // Aucune solution trouvée → redirige vers page d'erreur
      router.push('/SolutionError')
    }
  } catch (err) {
    console.error('Erreur API :', err)
    // Erreur serveur → redirige aussi
    router.push('/SolutionError')
  }
}

onMounted(fetchSolution)
</script>

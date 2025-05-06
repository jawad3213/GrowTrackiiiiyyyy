<template>
  <div class="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
    <div class="bg-white rounded-xl shadow-xl p-8 w-full max-w-xl relative">
      
      <!-- Bouton fermer -->
      <button @click="router.back()" class="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl font-bold">
        &times;
      </button>

      <!-- Affichage de la solution -->
      <div v-if="solution">
        <h2 class="text-xl font-bold mb-6">Solution Details</h2>
        <p><strong>Type:</strong> {{ solution.solutionType }}</p>
        <p><strong>Coach:</strong> {{ solution.coachName }}</p>
        <p><strong>Details:</strong> {{ solution.details }}</p>
        <p><strong>From:</strong> {{ solution.startDate }}</p>
        <p><strong>To:</strong> {{ solution.endDate }}</p>

        <button class="mt-6 px-6 py-2 bg-purple-600 text-white rounded" @click="router.back()">Return</button>
      </div>
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
    const response = await axios.get(`/api/solutions?signalId=${Number(route.query.id)}`)
    console.log('données recues ',response.data)
    if (response.data.length > 0) {
      solution.value = response.data[0]
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

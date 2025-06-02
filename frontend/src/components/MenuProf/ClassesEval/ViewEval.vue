<template>
  <div class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 font-inter">
    <div class="bg-white w-[600px] h-[550px] p-6 rounded-xl shadow-xl relative">
      
      <!-- Header -->
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-md text-2xl font-semibold">View Evaluation Details</h2>
        <button @click="close" class="text-gray-500 text-2xl font-bold hover:text-gray-800">&times;</button>
      </div>

      <!-- Grid Skills -->
      <div class="grid grid-cols-2 gap-3 text-center mt-15 mb-15">
        <div
          v-for="(skill, index) in averages"
          :key="index"
          class="text-xl font-medium text-gray-800"
        >
          {{ skill.skill }} : <span class="font-bold">{{ skill.avg }}/5</span>
        </div>
      </div>

      <!-- Commentaire -->
      <div class="mb-5">
        <label class="text-lg font-semibold">Description Given:</label>
        <textarea
          v-model="feedbackComment"
          rows="4"
          class="w-full border border-gray-300 rounded-md px-3 py-2 text-lg mt-1"
          placeholder="e.g. Your explanation about why you gave this feedback..."
        ></textarea>
      </div>

      <!-- Button -->
      <button
        @click="submitComment"
        class="w-full py-2 bg-purple-600 hover:bg-purple-700 text-xl text-white font-semibold rounded">
        Back
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const skillsList = ref([])
const averages = ref([])
const feedbackComment = ref('')
const router = useRouter()

onMounted(async () => {
  try {
    // Récupérer tous les skills choisis
    const skillRes = await axios.get('http://localhost:3001/ChooseSkills')
    skillsList.value = skillRes.data.map(s => s.name)

    // Récupérer les réponses
    const answerRes = await axios.get('http://localhost:3001/answers')
    const grouped = {}

    answerRes.data.forEach(entry => {
      if (!grouped[entry.skill]) grouped[entry.skill] = []
      entry.answers.forEach(a => grouped[entry.skill].push(a.rating))
    })

    // Calcul des moyennes
    averages.value = Object.entries(grouped).map(([skill, ratings]) => ({
      skill,
      avg: (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1)
    }))
  } catch (err) {
    console.error('❌ Erreur récupération données :', err)
  }
})

// Envoyer commentaire
const submitComment = async () => {
  try {
    await axios.post('http://localhost:3001/finalComment', {
      comment: feedbackComment.value,
      date: new Date().toISOString()
    })
    alert('✅ Commentaire envoyé avec succès !')
  } catch (err) {
    console.error('❌ Erreur envoi commentaire :', err)
  }
  router.push('/HistoriqueEval')
}

// Fermer
const close = () => {
  window.history.back()
}
</script>

<style scoped>
.font-inter {
  font-family: 'Inter', sans-serif;
}
</style>

<template>
  <div class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 font-inter">
    <div class="bg-white w-[500px] h-[600px] p-8 rounded-xl shadow-xl relative overflow-y-auto">

      <!-- Titre -->
      <div class="text-center mb-6">
        <h2 class="text-purple-600 text-lg font-semibold mb-4">Project Evaluation</h2>
        <h1 class="text-4xl font-bold">
          Gives your <span class="bg-orange-500 text-white px-2 rounded">Feedback</span>
        </h1>
      </div>
      <p class="text-sm text-purple-600 font-semibold mb-3 mt-2">Step {{ totalSteps }}/{{ totalSteps }}</p>

      <!-- Recapitulatif -->
      <div class="mb-6">
        <h3 class="font-bold mb-2">Recapitulation</h3>
        <ul class="space-y-1">
          <li v-for="(entry, index) in averages" :key="index">
            <strong>{{ entry.skill }}</strong> : {{ entry.avg }}/5
          </li>
        </ul>
      </div>

      <!-- Justification -->
      <div class="mb-4">
        <label class="text-sm font-semibold mb-1 block">Why did you choose to give such marks?</label>
        <textarea v-model="feedbackComment" rows="4" placeholder="e.g. I evaluated based on teamwork & communication..."
          class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
        </textarea>
      </div>

      <!-- Actions -->
      <div class="flex justify-between">
        <button @click="goBack" class="px-4 py-2 bg-orange-500 text-white rounded">Previous Skill</button>
        <button @click="submitFinal" class="px-4 py-2 bg-purple-600 text-white rounded">Submit</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()

const answers = ref([])
const averages = ref([])
const feedbackComment = ref('')
const totalSteps = ref(5)

onMounted(async () => {
  try {
    const { data } = await axios.get('http://localhost:3001/answers')
    answers.value = data

    // Regrouper par compétence et calculer la moyenne
    const grouped = {}
    data.forEach(item => {
      if (!grouped[item.skill]) grouped[item.skill] = []
      item.answers.forEach(ans => grouped[item.skill].push(ans.rating))
    })

    averages.value = Object.entries(grouped).map(([skill, notes]) => ({
      skill,
      avg: (notes.reduce((a, b) => a + b, 0) / notes.length).toFixed(1)
    }))
  } catch (err) {
    console.error("❌ Erreur chargement des réponses :", err)
  }
})

const goBack = () => {
  router.back()
}

const submitFinal = async () => {
  try {
    const payload = {
      summary: averages.value,
      comment: feedbackComment.value,
      submittedAt: new Date().toISOString()
    }

    await axios.post('http://localhost:3001/finalFeedback', payload)
    router.push('/Thanku') // redirection
  } catch (err) {
    console.error("❌ Erreur soumission finale :", err)
  }
}
</script>

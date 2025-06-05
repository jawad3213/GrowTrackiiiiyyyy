<template>
  <div class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 font-inter">
    <div class="bg-white w-[600px] h-[550px] p-6 rounded-xl shadow-xl relative">
      <!-- Header -->
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-md text-2xl font-semibold">View Evaluation Details</h2>
        <button @click="close" class="text-gray-500 text-2xl font-bold hover:text-gray-800">×</button>
      </div>

      <!-- Grid Skills -->
      <div class="grid grid-cols-2 gap-3 text-center mt-15 mb-15">
        <div
          v-for="(skill, index) in skills"
          :key="index"
          class="text-xl font-medium text-gray-800"
        >
          {{ skill.skill_name }} : <span class="font-bold">{{ skill.note_skill }}/5</span>
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
          readonly
        ></textarea>
      </div>

      <!-- Button -->
      <button
        @click="close"
        class="w-full py-2 bg-purple-600 hover:bg-purple-700 text-xl text-white font-semibold rounded">
        Back
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/services/api'

const route = useRoute()
const router = useRouter()
const id_evaluation = route.query.id || route.params.id_evaluation

const skills = ref([])
const feedbackComment = ref('')

const fetchEvaluation = async () => {
  try {
    const res = await api.get(`/api/prof_evaluation_history/view_evaluation/${id_evaluation}`)
    skills.value = res.data.result
    feedbackComment.value = res.data.comment[0]?.comment_evaluation || ''
  } catch (error) {
    console.error('Erreur lors du chargement de l\'évaluation:', error)
    alert('Erreur lors du chargement des données. Veuillez réessayer.')
  }
}

onMounted(fetchEvaluation)

// Fermer
const close = () => {
  router.back()
}
</script>

<style scoped>
.font-inter {
  font-family: 'Inter', sans-serif;
}
</style>

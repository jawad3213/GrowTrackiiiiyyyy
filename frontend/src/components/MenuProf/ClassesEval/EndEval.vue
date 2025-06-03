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
        <button @click="goToThanku" class="px-4 py-2 bg-purple-600 text-white rounded">Submit</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const studentId = route.query.id // ou adapte selon ta navigation

const answers = ref([])
const averages = ref([])
const feedbackComment = ref('')
const totalSteps = ref(5)

onMounted(async () => {
  try {
    const token = localStorage.getItem('token')
    const { data } = await axios.get(`/api/prof_evaluation_classes/view_report/${studentId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    // data est un tableau avec les notes et skills
    if (Array.isArray(data) && data.length > 0) {
      const report = data[0]
      averages.value = [
        { skill: report.skill1, avg: report.note1 },
        { skill: report.skill2, avg: report.note2 },
        { skill: report.skill3, avg: report.note3 },
        { skill: report.skill4, avg: report.note4 },
        { skill: report.skill5, avg: report.note5 },
        { skill: report.skill6, avg: report.note6 }
      ]
      feedbackComment.value = report.comment || ''
    }
  } catch (err) {
    console.error("❌ Erreur chargement du rapport :", err)
  }
})

const goBack = () => {
  router.back()
}
const goToThanku = () => {
  router.push('/Thanku')
}
</script>

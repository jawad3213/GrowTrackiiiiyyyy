<template>
  <div ref="reportContent" class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 font-inter">
    <div class="bg-white w-[800px] max-h-[100vh] p-6 rounded-xl shadow-xl overflow-y-auto">
      <h1 class="text-6xl font-bold text-center mb-15">
        Student <span class="bg-purple-600 text-white px-2 rounded">Report</span>
      </h1>

      <!-- Profile Section -->
      <details class="mb-4">
        <summary class="bg-purple-200 px-4 py-2 font-semibold text-xl rounded cursor-pointer">Profile Section</summary>
        <div class="mt-10 ml-10 text-2xl">
          <p><strong>Student full name:</strong> {{ profile.name }}</p>
          <p><strong>CNE:</strong> {{ profile.cne }}</p>
          <p><strong>Level:</strong> {{ profile.level }}</p>
          <p><strong>Field:</strong> {{ profile.field }}</p>
          <p><strong>Projects:</strong> {{ joinedProjects }}</p>
        </div>
      </details>


      <!-- Evaluation Section -->
      <details class="mb-4">
        <summary class="bg-purple-200 px-4 py-2 font-semibold text-xl rounded cursor-pointer">Evaluation Section</summary>
        <div class="mt-10 ml-10 text-2xl">
          <p><strong>Number of Evaluations Completed:</strong> {{ evaluations.completed }}</p>
          <p><strong>Number of Evaluations Received:</strong> {{ evaluations.received }}</p>
          <p><strong>Average Score:</strong> {{ evaluations.average }}</p>

          <!-- Skills Average Table -->
          <h4 class="font-bold text-2xl mb-4 mt-8">Skill Evaluation:</h4>
           <table class="w-full border text-lg text-center">
            <thead class="bg-gray-100">
              <tr>
                <th class="p-2">Date</th>
                <th v-for="skill in skillNames" :key="skill" class="p-2">{{ skill }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="date in uniqueDates" :key="date" class="border-t">
                <td class="p-2 font-medium">{{ date }}</td>
                <td v-for="skill in skillNames" :key="skill + date" class="p-2">
                  {{ getAverageRating(date, skill) ?? '-' }}
                </td>
              </tr>
            </tbody>
          </table>
          <!-- Source Pie Chart Placeholder -->
          <h4 class="font-bold text-2xl mt-4">Evaluation Sources:</h4>
          <div class="relative max-h-[195px]">
            <div id="chartTwo" class="h-full">
              <div class="radial-bar-chart">
                  <VueApexCharts
                    width="400"
                    type="pie"
                    :options="chartOptions"
                    :series="chartSeries"
                  />
                  
              </div>
            </div>
          </div>

        </div>
      </details>

      <!-- Signal Section -->
      <details class="mb-4">
        <summary class="bg-purple-200 px-4 py-2 font-semibold text-xl rounded cursor-pointer">Signal Section</summary>
        <div class="mt-10 mb-10">
          <table class="w-full text-sm border">
            <thead class="bg-gray-100">
              <tr>
                <th class="p-2">Date</th>
                <th class="p-2">Reported By</th>
                <th class="p-2">Role</th>
                <th class="p-2">Signal Status</th>
                <th class="p-2">Solution Status</th>
                <th class="p-2">Solution Taken</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="sig in signals" :key="sig.id" class="text-center border-t">
                <td class="p-2">{{ sig.date }}</td>
                <td class="p-2">{{ sig.reporter }}</td>
                <td class="p-2">{{ sig.role }}</td>
                <td class="p-2">{{ sig.status }}</td>
                <td class="p-2">{{ sig.solution }}</td>
                <td class="p-2">{{ sig.solutionTaken }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </details>

      <!-- Comment Section -->
      <details class="mb-4">
        <summary class="bg-purple-200 px-4 py-2 font-semibold text-xl rounded cursor-pointer">Comment Section</summary>
        <div class="ml-10 mt-10">
          <div v-for="role in Object.keys(comments)" :key="role">
            <p class="font-bold mb-4 text-2xl text-orange-600">Comments given by {{ role }}:</p>
            <ul class="list-disc mb-6 text-lg ml-15">
              <li v-for="(comment, i) in comments[role]" :key="i">{{ comment }}</li>
            </ul>
          </div>
        </div>
      </details>

      <!-- Actions -->
      <div class="flex justify-between mt-10">
        <button @click="goBack" class="bg-gray-200 px-6 py-4 rounded">Back</button>
        <button @click="downloadPdf" class="bg-orange-500 text-white px-8 py-4 rounded">Download as PDF</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
import api from '@/services/api'
import html2pdf from 'html2pdf.js'
import VueApexCharts from 'vue3-apexcharts'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const studentId = useAuthStore().ID 


if (route.query.id) {
  studentId.value = route.query.id
}
    console.log('studentId:', studentId.value)

    
// 🧭 Navigation
const router = useRouter()
const reportContent = ref(null)

// 🔹 Données Profil étudiant (statique ou récupérable si API dispo)
// Script setup
const joinedProjects = computed(() => profile.value.projects?.join(', ') || 'No projects')
const profile = ref({
  name: '',
 
})

// 🔸 Évaluations par date et par compétence
const evaluations = ref([])

// 🔸 Graphique circulaire
const chartOptions = ref({
  chart: {
    type: 'pie'
  },
  labels: [], // ex: ["Professors", "Peers", "Supervisors"]
  legend: {
    position: 'right'
  }
})

const chartSeries = ref([]) // ex: [100, 62, 50]

// 🔸 Signaux
const signals = ref([])

// 🔸 Commentaires
const comments = ref({})

// 🟡 Initialisation des données
onMounted(async () => {
  try {
    // 1. Profile
    const token = localStorage.getItem('token');
    const response = await api.get(`/api/report/profile_section/${studentId.value}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = response.data.result || [];
    if (data.length > 0) {
      profile.value = {
        name: data[0].full_name,
        cne: data[0].cne,
        level: data[0].id_sector,
        field: data[0].id_class,
        projects: Array.isArray(data[0].id_project) ? data[0].id_project : [data[0].id_project]
      }
    }

    // 2. Evaluations
    const { data: evalData } = await api.get(`/api/report/Evaluation_Section/${studentId.value}`)
    evaluations.value = (evalData.skill_evaluation || []).map(e => ({
      date: e.date,
      skill: e.skill_name,
      ratings: [e.note_skill]
    }))
    evaluations.completed = evalData.completed
    evaluations.received = evalData.received
    evaluations.average = evalData.average_score
    chartOptions.value.labels = (evalData.evaluation_sources || []).map(e => e.type_evaluation)
    chartSeries.value = (evalData.evaluation_sources || []).map(e => e.count)

    // 3. Signaux
    const { data: signalData } = await api.get(`/api/report/Signal_History/${studentId.value}`)
    signals.value = signalData.map(s => ({
      date: new Date(s.date_add).toLocaleDateString(),
      reporter: s.full_name,
      role: s.role,
      status: s.signal_state,
      solution: s.id_solution,
      solutionTaken: s.solution_state
    }))

    // 4. Commentaires
    const { data: commentData } = await api.get(`/api/report/Comment_Section/${studentId.value}`)
    comments.value = {
      professor: (commentData.professor || []).map(c => c.comment_evaluation),
      supervisor: (commentData.supervisor || []).map(c => c.comment_evaluation),
      student: (commentData.student || []).map(c => c.comment_evaluation)
    }
  } catch (error) {
    console.error("❌ Erreur chargement données:", error)
  }
})

// 📊 Colonnes dynamiques (compétences)
const skillNames = computed(() => {
  const names = evaluations.value.map(e => e.skill)
  return [...new Set(names)] //ignorer les doublons
})

// 📆 Lignes dynamiques (dates)
const uniqueDates = computed(() => {
  const dates = evaluations.value.map(e => e.date)
  return [...new Set(dates)]
})

// 🔢 Fonction moyenne par compétence/date
const getAverageRating = (date, skill) => {
  const entry = evaluations.value.find(e => e.date === date && e.skill === skill)
  if (!entry) return '-'
  const avg = entry.ratings.reduce((a, b) => a + b, 0) / entry.ratings.length
  return avg.toFixed(1)
}

// ⬅️ Retour
const goBack = () => router.back()
console.log('hello back')

// 📥 Télécharger PDF
const downloadPdf = () => {
  html2pdf().from(reportContent.value).save('Rapport.pdf')
  console.log('hello hassan')
}

// pour les couleurs metionnee dans le tableau
const getStatusClass = (status) => {
  switch (status) {
    case 'Approved':
      return 'bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold';
    case 'Rejected':
      return 'bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-semibold';
    default:
      return 'bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-xs font-semibold';
  }
}

const getSolutionClass = (solution) => {
  switch (solution) {
    case 'Resolved':
      return 'bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold';
    case 'In Progress':
      return 'bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-xs font-semibold';
    case 'Blocked':
      return 'bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-semibold';
    case 'No Action Taken':
      return 'bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-semibold';
    default:
      return 'bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-xs font-semibold';
  }
}

</script>


<style scoped>
details[open] summary {
  background-color: #d6bbfb;
}

</style>

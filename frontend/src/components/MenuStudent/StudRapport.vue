<template>
   <StudentLayout>
  <div ref="reportContent" class="p-10 bg-white min-h-screen font-inter">
  <div class="max-w-10xl mx-auto">

    <div class="flex justify-between items-center mb-10">
        <h1 class="text-3xl font-bold">
            Student <span class="bg-purple-600 text-white px-2 rounded">Report</span>
        </h1>
        <button @click="downloadPdf" class="bg-orange-500 text-white px-8 py-2 rounded">
            Download as PDF
        </button>
    </div>

      <!-- Profile Section -->
      <details class="mb-4">
        <summary class="bg-purple-200 px-4 py-2 font-semibold text-xl rounded cursor-pointer">Profile Section</summary>
        <div class="mt-10 mb-10 ml-10 text-2xl">
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
           <table class="w-full mb-10 border text-lg text-center">
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
          

        </div>
      </details>

      <!-- Signal Section -->
      <details class="mb-4">
        <summary class="bg-purple-200 px-4 py-2 font-semibold text-xl rounded cursor-pointer">Signal Section</summary>
        <div class="mt-10 mb-10">
          <table class="w-full text-lg border">
            <thead class="bg-gray-100">
              <tr>
                <th class="p-2">Date</th>
                <th class="p-2">Reported By</th>
                <th class="p-2">Role</th>
                <th class="p-2">Signal Status</th>
                <th class="p-2">Solution Status</th>
                <th class="p-2">Solution Taken</th>
                <th class="p-2">Coach name</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="sig in signals" :key="sig.id" class="text-center border-t">
                <td class="p-2">{{ sig.date }}</td>
                <td class="p-2">{{ sig.reporter }}</td>
                <td class="p-2">{{ sig.role }}</td>

                <td class="p-2">
                <span :class="getStatusClass(sig.status)">
                    {{ sig.status }}
                </span>
                </td>
                <td class="p-2">
                <span :class="getSolutionClass(sig.solution)">
                    {{ sig.solution }}
                </span>
                </td>

                <td class="p-2">{{ sig.solutionTaken }}</td>
                <td class="p-2">{{ sig.coachName }}</td>
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
      
    </div>
  </div>
  </StudentLayout>
</template>

<script setup>
import StudentLayout from '../layout/StudentLayout.vue'
import { ref, onMounted, computed } from 'vue'
import api from '../../services/api'
import { useRouter } from 'vue-router'
import html2pdf from 'html2pdf.js'

import VueApexCharts from 'vue3-apexcharts'

// 🧭 Navigation
const router = useRouter()
const reportContent = ref(null)

// 🔹 Données Profil étudiant (statique ou récupérable si API dispo)
// Script setup
const joinedProjects = computed(() => profile.value.projects?.join(', ') || 'No projects')
const profile = ref({
  name: '',
  cne: '',
  level: '',
  field: '',
  projects: []
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
    // 1. Évaluations compétences par date
    const evalRes = await api.get('http://localhost:3001/skillEvaluations')
    evaluations.value = evalRes.data

    // 2. Graphique sources d'évaluations
    const { data: pieData } = await api.get('http://localhost:3001/evaluationSources')
    console.log('soukaina')
    chartOptions.value.labels = Object.keys(pieData)
    chartSeries.value = Object.values(pieData)

    // 3. Signaux
    const { data: signalData } = await api.get('http://localhost:3001/signals')
    signals.value = signalData.map(s => ({    //on transforme ses données en un nouvel objet
      date: new Date(s.date).toLocaleDateString(),
      reporter: s.reporter,
      role: s.role,
      status: s.state,
      solution: s.solution,
      solutionTaken: s.solution_taken,
      coachName: s.Coach_name
    }))

    // 4. Commentaires
    const { data: commentData } = await api.get('http://localhost:3001/comments')
    comments.value = commentData.reduce((acc, c) => {
      if (!acc[c.role]) acc[c.role] = []
      acc[c.role].push(c.text)
      return acc
    }, {})

    //profile
    const res = await api.get('http://localhost:3001/ProfileStudents')
    console.log('hello guys')
    profile.value = res.data[0] || {}

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

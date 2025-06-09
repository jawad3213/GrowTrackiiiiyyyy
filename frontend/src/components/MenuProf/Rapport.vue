<template>
  <div
    ref="reportContent"
    class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 font-inter p-6"
  >
    <div
      class="relative bg-white w-full max-w-2xl max-h-[90vh] p-10 rounded-3xl border-4 border-purple-500 shadow-2xl overflow-y-auto space-y-8 animate-slide-up-fade"
    >
      <!-- Header -->
      <h1 class="text-5xl font-extrabold text-center mb-8">
        Student
        <span class="bg-gradient-to-r from-purple-600 to-orange-500 text-white px-3 py-1 rounded-lg">
          Report
        </span>
      </h1>

      <!-- Profile Section -->
      <details class="group">
        <summary
          class="bg-gradient-to-r from-purple-200 to-purple-300 px-4 py-2 font-semibold text-xl rounded-lg cursor-pointer transition-colors duration-200"
        >
          Profile Section
        </summary>
        <div class="mt-6 ml-8 text-lg space-y-2 animate-slide-up-fade">
          <p><strong>Student full name:</strong> {{ profile.full_name }}</p>
          <p><strong>CNE:</strong> {{ profile.cne }}</p>
          <p><strong>Level:</strong> {{ profile.id_sector }}</p>
          <p><strong>Field:</strong> {{ profile.id_class }}</p>

          <p><strong>Projects:</strong></p>
          <div class="ml-8">
            <p v-if="!profile.name_projects || profile.name_projects.length === 0" class="italic text-gray-500">
              No projects assigned.
            </p>
            <ul v-else class="list-disc ml-6 space-y-1 text-base">
              <li v-for="(proj, i) in profile.name_projects" :key="i">{{ proj }}</li>
            </ul>
          </div>
        </div>
      </details>

      <!-- Evaluation Section -->
      <details class="group">
        <summary
          class="bg-gradient-to-r from-purple-200 to-purple-300 px-4 py-2 font-semibold text-xl rounded-lg cursor-pointer transition-colors duration-200"
        >
          Evaluation Section
        </summary>
        <div class="p-6 max-w-xl mx-auto font-sans animate-slide-up-fade">
          <h1 class="text-3xl font-bold mb-4">Student Evaluation</h1>

          <div v-if="!evale">Loading…</div>
          <div v-else>
            <section class="mb-6">
              <p><strong>Completed:</strong> {{ evale.completed }}</p>
              <p><strong>Received:</strong> {{ evale.received }}</p>
            </section>

            <!-- Skill Evaluations Table -->
            <section class="mb-6">
              <h2 class="text-2xl font-semibold mb-2">Skill Evaluations</h2>
              <div class="overflow-x-auto">
                <table class="min-w-full bg-white border">
                  <thead>
                    <tr class="bg-gray-100">
                      <th class="px-4 py-2 border">Date</th>
                      <th
                        v-for="(skill, i) in evale.skill_evaluation"
                        :key="i"
                        class="px-4 py-2 border"
                      >
                        {{ skill.skill_name }}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td class="px-4 py-2 border text-center">
                        {{ formatDate(evale.skill_evaluation[0].date) }}
                      </td>
                      <td
                        v-for="(skill, i) in evale.skill_evaluation"
                        :key="i"
                        class="px-4 py-2 border text-center"
                      >
                        {{ skill.note_skill.toFixed(2) }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section class="mb-6">
              <p>
                <strong>Average Score:</strong>
                <span class="text-indigo-600 font-bold">{{ evale.average_score.toFixed(2) }}</span>
              </p>
            </section>

            <section>
              <h2 class="text-2xl font-semibold mb-2">Evaluation Sources</h2>
              <ul class="list-disc list-inside space-y-1">
                <li v-for="(src, i) in evale.evaluation_sources" :key="i">
                  {{ src.type_evaluation }}: {{ src.count }}
                </li>
              </ul>
            </section>
          </div>
        </div>
      </details>

      <!-- Signal Section -->
      <details class="group">
        <summary
          class="bg-gradient-to-r from-purple-200 to-purple-300 px-4 py-2 font-semibold text-xl rounded-lg cursor-pointer transition-colors duration-200"
        >
          Signal Section
        </summary>

        <div v-if="signalLoading" class="p-6 text-center">Loading signals…</div>
        <div v-else-if="signalError" class="p-6 text-red-600">{{ signalError }}</div>
        <div v-else class="mt-6 mb-6 animate-slide-up-fade overflow-x-auto">
          <table class="w-full text-sm border text-center">
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
              <tr v-for="sig in signals" :key="sig.id_signal" class="border-t">
                <td class="p-2">{{ formatDate(sig.date_add) }}</td>
                <td class="p-2">{{ sig.full_name }}</td>
                <td class="p-2">{{ sig.role }}</td>
                <td class="p-2">
                  <span :class="getStatusClass(sig.signal_state)">{{ sig.signal_state }}</span>
                </td>
                <td class="p-2">
                  <span :class="getSolutionClass(sig.solution_state)">{{ sig.solution_state ?? 'No Action' }}</span>
                </td>
                <td class="p-2">{{ sig.id_solution ?? '–' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </details>

      <!-- Comment Section -->
      <details class="group">
        <summary
          class="bg-gradient-to-r from-purple-200 to-purple-300 px-4 py-2 font-semibold text-xl rounded-lg cursor-pointer transition-colors duration-200"
        >
          Comment Section
        </summary>

        <div v-if="commentsLoading" class="p-6 text-center">Loading comments…</div>
        <div v-else-if="commentsError" class="p-6 text-red-600">{{ commentsError }}</div>
        <div v-else class="ml-8 mt-6 space-y-6 animate-slide-up-fade">
          <div v-if="commentResults.professor.length">
            <p class="font-bold mb-2 text-xl text-orange-600">Comments by Professor:</p>
            <ul class="list-disc ml-6 space-y-1 text-base">
              <li v-for="(c, i) in commentResults.professor" :key="i">{{ c.comment_evaluation }}</li>
            </ul>
          </div>
          <div v-if="commentResults.supervisor.length">
            <p class="font-bold mb-2 text-xl text-orange-600">Comments by Supervisor:</p>
            <ul class="list-disc ml-6 space-y-1 text-base">
              <li v-for="(c, i) in commentResults.supervisor" :key="i">{{ c.comment_evaluation }}</li>
            </ul>
          </div>
          <div v-if="commentResults.student.length">
            <p class="font-bold mb-2 text-xl text-orange-600">Comments by Student:</p>
            <ul class="list-disc ml-6 space-y-1 text-base">
              <li v-for="(c, i) in commentResults.student" :key="i">{{ c.comment_evaluation }}</li>
            </ul>
          </div>
          <div
            v-if="!commentResults.professor.length && !commentResults.supervisor.length && !commentResults.student.length"
            class="italic text-gray-500"
          >
            No comments available.
          </div>
        </div>
      </details>

      <!-- Actions -->
      <div class="flex justify-between mt-8 space-x-4">
        <button
          @click="goBack"
          class="flex-1 py-3 text-white text-lg font-semibold rounded-full shadow-lg transition-transform duration-200 hover:shadow-xl hover:scale-105 bg-gradient-to-r from-purple-600 to-orange-500"
        >
          Back
        </button>
        <button
          @click="generatePdf"
          :disabled="loading"
          class="flex-1 py-3 text-white text-lg font-semibold rounded-full shadow-lg transition-transform duration-200 hover:shadow-xl hover:scale-105 bg-gradient-to-r from-purple-600 to-orange-500"
        >
          {{ loading ? 'Downloading…' : 'Download as PDF' }}
        </button>
      </div>

      <div v-if="error" class="mt-4 text-center text-red-600">
        {{ error }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'

axios.defaults.withCredentials = true

// Data refs
const profile        = ref({})
const evale          = ref(null)
const signals        = ref([])
const commentResults = ref({ professor: [], supervisor: [], student: [] })

// Loading/error refs used by generatePdf()
const loading = ref(false)
const error   = ref(null)

// Other loading/error states…
const signalLoading   = ref(true)
const signalError     = ref(null)
const commentsLoading = ref(true)
const commentsError   = ref(null)

const route     = useRoute()
const studentId = route.query.id || ''
const router    = useRouter()

function formatDate(iso) {
  return new Date(iso).toLocaleDateString()
}

function getStatusClass(status) {
  if (status === 'new')    return 'bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs'
  if (status === 'open')   return 'bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs'
  if (status === 'closed') return 'bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs'
  return 'bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs'
}

function getSolutionClass(sol) {
  if (sol === 'Resolved')    return 'bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs'
  if (sol === 'In Progress') return 'bg-pink-100 text-pink-800 px-2 py-1 rounded-full text-xs'
  if (sol === 'Blocked')     return 'bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs'
  return 'bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs'
}

onMounted(async () => {
  try {
    const profRes = await axios.get(
      `http://localhost:3000/api/report/Profile_Section/${studentId}`
    )
    profile.value = Array.isArray(profRes.data)
      ? profRes.data[0]
      : profRes.data.result

    const evalRes = await axios.get(
      `http://localhost:3000/api/report/Evaluation_Section/${studentId}`
    )
    evale.value = Array.isArray(evalRes.data)
      ? evalRes.data[0]
      : evalRes.data.result

    const sigRes = await axios.get(
      `http://localhost:3000/api/report/Signal_History/${studentId}`
    )
    signals.value = sigRes.data.result
  } catch (e) {
    signalError.value = e.message || 'Failed to load signals'
  } finally {
    signalLoading.value = false
  }

  try {
    const comRes = await axios.get(
      `http://localhost:3000/api/report/Comment_Section/${studentId}`
    )
    commentResults.value = comRes.data.result
  } catch (e) {
    commentsError.value = e.message || 'Failed to load comments'
  } finally {
    commentsLoading.value = false
  }
})

const goBack = () => router.back()

async function generatePdf() {
  loading.value = true
  error.value   = null

  try {
    const pdfRes = await axios.post(
      'http://localhost:3000/api/generate-pdf',
      {
        profile: profile.value,
        evale: evale.value,
        signals: signals.value,
        commentResults: commentResults.value
      },
      { responseType: 'blob' }
    )

    const blob = new Blob([pdfRes.data], { type: 'application/pdf' })
    const url  = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href     = url
    link.download = 'profile.pdf'
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
  } catch (err) {
    console.error('PDF export failed:', err)
    error.value = err.response?.data?.message || err.message || 'Failed to generate PDF.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
@keyframes slide-up-fade {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}
.animate-slide-up-fade { animation: slide-up-fade 0.5s ease-out forwards; }
details summary { outline: none; }
details summary:hover { background-color: #e5d4fd; }
</style>

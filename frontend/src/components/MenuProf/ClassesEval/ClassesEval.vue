<template>
  <ProfLayout>
    <div class="p-6 dark:bg-[#121212] min-h-screen">
      <!-- Liste des onglets de classes -->
      <div class="flex gap-4 mb-6 overflow-x-auto">
        <button
          v-for="classe in classes"
          :key="classe"
          @click="selectClass(classe)"
          :class="[
            'px-4 py-2 rounded-full transition',
            selectedClass === classe
              ? 'bg-purple-600 text-white'
              : 'bg-purple-100 text-purple-600 hover:bg-purple-200'
          ]"
        >
          {{ classe }}
          <span v-if="counts[classe] !== undefined" class="ml-1 text-xs font-medium">
            {{ counts[classe] }} students
          </span>
        </button>
      </div>

      <!-- Titre + total d’étudiants pour la classe sélectionnée -->
      <h1 class="text-xl font-bold mb-4 text-gray-900 dark:text-white">
        Class: {{ selectedClass }}
        <span
          class="bg-purple-100 text-purple-600 text-sm font-semibold px-3 py-1 rounded-full dark:bg-purple-200/10 dark:text-purple-300"
        >
          {{ displayedStudents.length }} students
        </span>
      </h1>

      <!-- Zone de contenu principal : loader ou tableau -->
      <div class="overflow-x-auto">
        <!-- Loader pendant la récupération des données -->
        <div v-if="isLoading" class="flex justify-center items-center h-40">
          <div class="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
        </div>

        <!-- Tableau des étudiants -->
        <table
          v-else
          class="w-full table-auto text-sm bg-white dark:bg-gray-900 rounded shadow"
        >
          <thead class="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200">
            <tr>
              <th class="text-center p-3">Full name</th>
              <th class="text-center p-3">CIN</th>
              <th class="text-center p-3">CNE</th>
              <th class="text-center p-3">Evaluation Status</th>
              <th class="text-center p-3">Last Evaluation</th>
              <th class="text-center p-3">Signal Action</th>
              <th class="text-center p-3">Report</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="student in displayedStudents"
              :key="student.id"
              class="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <td class="p-3 flex items-center gap-2">
                <!-- real picture if available -->
                <template v-if="student.avatar">
                  <img
                    :src="student.avatar"
                    class="w-12 h-12 rounded-full object-cover"
                    alt="avatar"
                  />
                </template>
                <!-- letter-avatar fallback -->
                <template v-else>
                  <div
                    class="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-lg"
                    :style="{ backgroundColor: student.bgColor }"
                  >
                    {{ student.initial }}
                  </div>
                </template>

                <div>
                  <div class="font-semibold text-gray-900 dark:text-white">
                    {{ student.fullName }}
                  </div>
                </div>
              </td>

              <td class="text-center p-3 text-gray-700 dark:text-gray-300">{{ student.cin }}</td>
              <td class="text-center p-3 text-gray-700 dark:text-gray-300">{{ student.cne }}</td>

              <td class="text-center p-3">
                <span
                  v-if="student.iscStatus.toLowerCase() === 'submitted'"
                  class="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 px-2 py-1 rounded-full text-xs font-semibold animate-pulse"
                >
                  Submitted
                </span>
                <span
                  v-else-if="!student.iscStatus"
                  class="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 px-2 py-1 rounded-full text-xs font-semibold"
                >
                  Not yet
                </span>
                <span
                  v-else-if="student.iscStatus.toLowerCase() === 'overdue'"
                  class="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300 px-2 py-1 rounded-full text-xs font-semibold"
                >
                  Overdue
                </span>
                <span
                  v-else
                  class="text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full text-xs font-semibold"
                >
                  {{ student.iscStatus }}
                </span>
              </td>

              <td class="text-center p-3 text-gray-700 dark:text-gray-300">
                {{ student.lastC }}
              </td>

              <td class="text-center p-3">
                <button
                  @click="goToNewEvaluation(student.id)"
                  :disabled="student.iscStatus.toLowerCase() === 'submitted'"
                  :class="['inline-flex items-center space-x-1 px-4 py-2 rounded transition', student.iscStatus.toLowerCase() === 'submitted' ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-purple-100 hover:bg-purple-200 text-purple-600 font-bold']"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 -960 960 960" fill="currentColor">
                    <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" />
                  </svg>
                  <span>New Evaluation</span>
                </button>
              </td>

              <td class="text-center p-3">
                <button
                  @click="goToViewReport(student.id)"
                  class="inline-flex items-center space-x-1 bg-purple-100 hover:bg-purple-200 text-purple-600 font-bold px-4 py-2 rounded transition"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 -960 960 960" fill="currentColor">
                    <path d="m560-240-56-58 142-142H160v-80h486L504-662l56-58 240 240-240 240Z"/>
                  </svg>
                  <span>View Report</span>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </ProfLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'
import ProfLayout from '@/components/layout/ProfLayout.vue'

// format Date into "YYYY-MM-DD"
function formatDateTime(dateString) {
  const d = new Date(dateString)
  if (isNaN(d)) return 'Invalid date'
  const yyyy = d.getFullYear()
  const MM   = String(d.getMonth() + 1).padStart(2, '0')
  const dd   = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${MM}-${dd}`
}

// generate a deterministic background color from the first letter
function generateColor(letter) {
  const palette = [
    '#F56565', // red
    '#ED8936', // orange
    '#ECC94B', // yellow
    '#48BB78', // green
    '#4299E1', // blue
    '#9F7AEA', // purple
    '#ED64A6'  // pink
  ]
  const idx = letter.charCodeAt(0) % palette.length
  return palette[idx]
}

const router = useRouter()

const classes = ref(['GINF1', 'CYS1'])
const selectedClass = ref(classes.value[0])
const counts = ref({})
const displayedStudents = ref([])
const isLoading = ref(false)

const fetchStudents = async (classe) => {
  isLoading.value = true
  try {
    const token = localStorage.getItem('token')
    const response = await api.get(
      `/api/prof_evaluation_classes/get_all_student/${classe}`,
      { headers: { Authorization: `Bearer ${token}` } }
    )

    if (response.data.number !== undefined) {
      counts.value[classe] = response.data.number
    }

    if (Array.isArray(response.data.result)) {
      displayedStudents.value = response.data.result.map((item) => {
        const name = (item.full_name?.trim() || 'N')
        const initial = name.charAt(0).toUpperCase()
        return {
          id: item.id_member,
          fullName: name,
          cin: item.cin || 'N/A',
          cne: item.cne || 'N/A',
          avatar: item.profile_picture,            // may be null
          initial,                                  // first letter
          bgColor: generateColor(initial),          // fallback circle color
          iscStatus: item.isc || '',
          lastC: item.lastc === null
            ? 'Never did'
            : formatDateTime(item.lastc)
        }
      })
    } else {
      displayedStudents.value = []
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des étudiants :', error)
    displayedStudents.value = []
    counts.value[classe] = 0
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchStudents(selectedClass.value)
})

const selectClass = (classe) => {
  if (classe === selectedClass.value) return
  selectedClass.value = classe
  fetchStudents(classe)
}

const goToNewEvaluation = (id) => {
  router.push({ path: '/courseEvaluation', query: { id } })
}

const goToViewReport = (id) => {
  router.push({ path: '/Rapport', query: { id } })
}
</script>

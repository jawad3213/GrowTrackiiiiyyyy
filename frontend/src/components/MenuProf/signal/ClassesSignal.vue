<template>
  <ProfLayout>
    <div class="p-6 dark:bg-[#121212] min-h-screen">
      <!-- Class Tabs -->
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

      <!-- Header with selected class and total -->
      <h1 class="text-xl font-bold mb-4 text-gray-900 dark:text-white">
        Class: {{ selectedClass }}
        <span
          class="bg-purple-100 text-purple-600 text-sm font-semibold px-3 py-1 rounded-full dark:bg-purple-200/10 dark:text-purple-300 ml-2"
        >
          {{ displayedStudents.length }} students
        </span>
      </h1>

      <!-- Students Table -->
      <div class="overflow-x-auto transform scale-105 origin-top-left">
        <!-- Loader -->
        <div v-if="isLoading" class="flex justify-center items-center h-40">
          <div class="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
        </div>

        <!-- Table -->
        <table
          v-else
          class="w-full table-auto text-base bg-white dark:bg-gray-900 rounded shadow"
        >
          <thead class="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200">
            <tr>
              <th class="text-left p-4">Full name</th>
              <th class="text-left p-4">CNE</th>
              <th class="text-left p-4">Last Signal</th>
              <th class="text-left p-4">Signal This Month</th>
              <th class="text-left p-4">Signal Action</th>
              <th class="text-left p-4">History</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="student in displayedStudents"
              :key="student.id"
              class="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <td class="p-4 flex items-center gap-3">
                <template v-if="student.avatar">
                  <img
                    :src="student.avatar"
                    class="w-10 h-10 rounded-full object-cover"
                    alt="avatar"
                  />
                </template>
                <template v-else>
                  <div
                    class="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-lg"
                    :style="{ backgroundColor: student.bgColor }"
                  >
                    {{ student.initial }}
                  </div>
                </template>
                <div class="font-semibold text-gray-900 dark:text-white">
                  {{ student.fullName }}
                </div>
              </td>

              <td class="p-4 text-gray-700 dark:text-gray-300">
                {{ student.cne }}
              </td>
              <td class="p-4 text-gray-700 dark:text-gray-300">
                {{ student.lastsignal }}
              </td>
              <td class="p-4">
                <span :class="badgeClass(student.signalThisMonth)">
                  {{ student.signalThisMonth }}
                </span>
              </td>
              <td class="p-4">
                <button
                  @click="goToNewSignal(student.id)"
                  class="inline-flex items-center space-x-2 bg-purple-100 hover:bg-purple-200 text-purple-600 font-bold px-5 py-2 rounded transition"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="w-6 h-6"
                    viewBox="0 -960 960 960"
                    fill="currentColor"
                  >
                    <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/>
                  </svg>
                  <span>New Signal</span>
                </button>
              </td>
              <td class="p-4">
                <button
                  @click="goToViewHistory(student.id)"
                  class="inline-flex items-center space-x-2 bg-purple-100 hover:bg-purple-200 text-purple-600 font-bold px-5 py-2 rounded transition"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="w-6 h-6"
                    viewBox="0 -960 960 960"
                    fill="currentColor"
                  >
                    <path d="m560-240-56-58 142-142H160v-80h486L504-662l56-58 240 240-240 240Z"/>
                  </svg>
                  <span>View History</span>
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

// Helpers
function generateColor(letter) {
  const palette = [
    '#F56565', '#ED8936', '#ECC94B',
    '#48BB78', '#4299E1', '#9F7AEA',
    '#ED64A6'
  ]
  return palette[letter.charCodeAt(0) % palette.length]
}

// Make the Yes/No badge larger
const badgeClass = (status) => {
  return status.toLowerCase() === 'yes'
    ? 'bg-green-100 text-green-800 px-3 py-1 rounded-full text-base font-medium'
    : 'bg-red-100 text-red-800 px-3 py-1 rounded-full text-base font-medium'
}

const classes = ref(['GINF1', 'CYS1'])
const selectedClass = ref(classes.value[0])
const counts = ref({})
const displayedStudents = ref([])
const isLoading = ref(false)
const router = useRouter()

const fetchStudents = async (classe) => {
  isLoading.value = true
  try {
    const token = localStorage.getItem('token')
    const { data } = await api.get(
      `/api/signal_classes/get_student/${classe}`,
      { headers: { Authorization: `Bearer ${token}` } }
    )

    if (data.number !== undefined) counts.value[classe] = data.number

    displayedStudents.value = Array.isArray(data.result)
      ? data.result.map(s => {
          const name    = (s.full_name?.trim() || '')
          const initial = name.charAt(0).toUpperCase() || 'N'
          return {
            id:               s.id_member,
            fullName:         name,
            cne:              s.cne || '',
            avatar:           s.profile_picture || null,
            initial,
            bgColor:          generateColor(initial),
            lastsignal:       s.last_signal_date
                                 ? new Date(s.last_signal_date).toLocaleDateString()
                                 : 'Never',
            signalThisMonth:  s.signal_this_month === 'Yes' ? 'Yes' : 'No'
          }
        })
      : []
  } catch (err) {
    console.error('Error fetching students:', err)
    displayedStudents.value = []
    counts.value[classe] = 0
  } finally {
    isLoading.value = false
  }
}

onMounted(() => fetchStudents(selectedClass.value))

const selectClass = (classe) => {
  if (classe === selectedClass.value) return
  selectedClass.value = classe
  fetchStudents(classe)
}

const goToNewSignal = (id) => {
  router.push({ path: '/newsignal', query: { id, classId: selectedClass.value } })
}
const goToViewHistory = (id) => {
  router.push({ path: '/viewhistory', query: { id, classId: selectedClass.value } })
}
</script>

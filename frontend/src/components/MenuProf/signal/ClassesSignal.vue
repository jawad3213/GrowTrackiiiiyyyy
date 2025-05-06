<template>
    <ProfLayout>
      <div class="p-6 dark:bg-[#121212] min-h-screen">
        <h1 class="text-xl font-bold mb-4 text-gray-900 dark:text-white">
          My classes
        </h1>
  
        <!-- Filtres niveaux -->
        <div class="mt-10 flex gap-0 border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden w-max text-sm font-medium">
          <button
            v-for="level in Object.keys(levels)"
            :key="level"
            @click="selectedlevel = level; selectedClass = ''; displayedStudents = []"
            :class="[
              'px-4 py-2 transition',
              selectedlevel === level
                ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700',
              'border-r border-gray-300 dark:border-gray-600 last:border-r-0'
            ]"
          >
            {{ level }}
          </button>
        </div>
  
        <!-- Filtres classes dynamiques -->
        <div class="flex flex-wrap gap-4 text-sm font-medium mt-10">
          <span
            v-for="classe in levels[selectedlevel]"
            :key="classe"
            class="cursor-pointer"
            :class="[
              selectedClass === classe
                ? 'text-gray-600 border-b-2 border-purple-600 dark:text-purple-300'
                : 'text-gray-600 dark:text-gray-300'
            ]"
            @click="selectClasse(classe)"
          >
            {{ classe }}
            <span
              class="bg-purple-100 text-purple-600 dark:bg-purple-200/10 dark:text-purple-300 px-3 rounded-full"
            >
              ({{ getTotalStudents(classe) }} students)
            </span>
          </span>
        </div>
  
        <!-- Recherche  -->
        <div class="flex items-center gap-3 mt-6">
          <div class="relative w-[400px]">
            <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 dark:text-white/30">🔍</span>
            <input
              type="text"
              v-model="search"
              placeholder="Search by Student ID, Course Status or Project Status"
              class="h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pl-10 pr-4 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-[#692CF3] focus:outline-none focus:ring-2 focus:ring-[#692CF3]/30 hover:border-[#692CF3] transition-colors duration-200 dark:border-gray-800 dark:bg-gray-900 dark:bg-white/[0.03] dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-[#692CF3]"
            />
          </div>
        </div>
  
        <!-- Tableau -->
        <div class="overflow-x-auto mt-10">
          <table class="w-full table-auto text-sm bg-white dark:bg-gray-900 rounded shadow">
            <thead class="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200">
              <tr>
                <th class="text-left p-3"><input type="checkbox" /></th>
                <th class="text-left p-3">Full name</th>
                <th class="text-left p-3">CNE</th>
                <th class="text-left p-3">Last Signal</th>
                <th class="text-left p-3">Signal This Month</th>
                <th class="text-left p-3">Signal Action</th>
                <th class="text-left p-3">History</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="student in filteredDisplayedStudents"
                :key="student.id"
                class="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <td class="p-3"><input type="checkbox" /></td>
                <td class="p-3 flex items-center gap-2">
                  <img :src="student.avatar" class="w-8 h-8 rounded-full object-cover" />
                  <div>
                    <div class="font-semibold text-gray-900 dark:text-white">{{ student.fullName }}</div>
                    <div class="text-gray-500 text-xs">{{ student.username }}</div>
                  </div>
                </td>
                <td class="p-3 text-gray-700 dark:text-gray-300">{{ student.cne }}</td>
                <td class="p-3 text-gray-700 dark:text-gray-300">{{ student.lastsignal }}</td>
                <td class="p-3">
                  <span :class="badgeClass(student.signalThisMonth)">{{ student.signalThisMonth }}</span>
                </td>
                <td class="p-3 text-purple-600 hover:underline cursor-pointer" @click="goToNewSignal(student.id)">➕ New Signal</td>
                <td class="p-3 text-purple-600 hover:underline cursor-pointer" @click="goToViewHistory(student.id)">View History →</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </ProfLayout>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue'
  import axios from 'axios'
  import { useRouter } from 'vue-router'
  import ProfLayout from '@/components/layout/ProfLayout.vue'
  
  const router = useRouter()
  const search = ref('')
  const selectedlevel = ref('AP1')
  const selectedClass = ref('')
  const displayedStudents = ref([])
  
  const levels = {
    AP1: ['TD1', 'TD2', 'TD3', 'TD4', 'TD5'],
    AP2: ['TD1', 'TD2', 'TD3', 'TD4', 'TD5'],
    CI1: ['GINF1', 'GCYS1', 'GIND1', 'GSTR1'],
    CI2: ['GINF1', 'GCYS1', 'GIND1', 'GSTR1'],
    CI3: ['GSTR1', 'GCYS1', 'GIND1', 'GSTR1']
  }
  
  function selectClasse(classe) {
    selectedClass.value = classe
    fetchStudents(classe)
  }
  
  async function fetchStudents(classe) {
  try {
    const res = await axios.get(`/api/classes/${classe}/students`)
    console.log("✅ Données reçues :", res.data)
    displayedStudents.value = Array.isArray(res.data) ? res.data : []
  } catch (err) {
    console.error("❌ Erreur API :", err.message)
  }
}

  
  const filteredDisplayedStudents = computed(() =>
    displayedStudents.value.filter((s) =>
      s.fullName.toLowerCase().includes(search.value.toLowerCase())
    )
  )
  
  const getTotalStudents = (classe) => {
    return selectedClass.value === classe ? displayedStudents.value.length : 0
  }
  
  const badgeClass = (status) => {
    return status === 'YES'
      ? 'text-green-800 bg-green-100 dark:text-green-300 dark:bg-green-900 px-2 py-1 rounded-full text-xs font-semibold'
      : 'text-orange-800 bg-orange-100 dark:text-orange-300 dark:bg-orange-900 px-2 py-1 rounded-full text-xs font-semibold'
  }
  
  const goToNewSignal = (id) => {
    router.push(`/newsignal?id=${id}`)
  }
  
  const goToViewHistory = (id) => {
    router.push(`/viewhistory?id=${id}`)
  }
  </script>
  
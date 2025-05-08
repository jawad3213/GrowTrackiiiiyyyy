<template>
    <ProfLayout>
    <div class="p-6 dark:bg-[#121212] min-h-screen">
      <h1 class="text-xl font-bold mb-4 text-gray-900 dark:text-white">
        My classes <span class="bg-purple-100 text-purple-600 text-sm font-semibold px-3 py-1 rounded-full dark:bg-purple-200/10 dark:text-purple-300">15 classes</span>
      </h1>
  
      <!-- Filtres niveaux -->
      <div class="mt-10 flex gap-0 border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden w-max text-sm font-medium">
    <button
      v-for="level in levels"
      :key="level"
      @click="selected = level"
      :class="[
        'px-4 py-2 transition',
        selected === level
          ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
          : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700',
        'border-r border-gray-300 dark:border-gray-600 last:border-r-0'
      ]"
    >
      {{ level }}
    </button>
  </div>
  
  <div class="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-gray-200 dark:border-gray-700 pb-2">

<!-- Filtres classes -->
<div class="flex flex-wrap gap-4 text-sm font-medium mt-10">
  <span class="cursor-pointer text-gray-600 border-b-2 border-purple-600 dark:text-purple-300">
    GINF1 <span class="bg-purple-100 text-purple-600 dark:bg-purple-200/10 dark:text-purple-300 px-3 rounded-full">(15 students)</span>
  </span>
  <span class="cursor-pointer text-gray-600 dark:text-gray-300">
    GCYS1 <span class="bg-purple-100 text-purple-600 dark:bg-purple-200/10 dark:text-purple-300 px-3 rounded-full">(20 students)</span>
  </span>
  <span class="cursor-pointer text-gray-600 dark:text-gray-300">
    GIND1 <span class="bg-purple-100 text-purple-600 dark:bg-purple-200/10 dark:text-purple-300 px-3 rounded-full">(40 students)</span>
  </span>
  <span class="cursor-pointer text-gray-600 dark:text-gray-300">
    GSTR1 <span class="bg-purple-100 text-purple-600 dark:bg-purple-200/10 dark:text-purple-300 px-3 rounded-full">(50 students)</span>
  </span>
</div>

<!-- Recherche  -->
<div class="flex items-center gap-3">
    <div class="relative w-[400px]">
  <!-- Icône de recherche -->
  <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 dark:text-white/30">
    🔍
  </span>

  <input
    type="text"
    v-model="search"
    placeholder="Search by Student ID, Course Status or Project Status"
    class="h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pl-10 pr-4 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400
           focus:border-[#692CF3] focus:outline-none focus:ring-2 focus:ring-[#692CF3]/30
           hover:border-[#692CF3] transition-colors duration-200
           dark:border-gray-800 dark:bg-gray-900 dark:bg-white/[0.03] dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-[#692CF3]"
  />
</div>

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
              <th class="text-left p-3">C.Eval.Status</th>
              <th class="text-left p-3">Last Evaluation</th>
              <th class="text-left p-3">P.Eval.Status</th>
              <th class="text-left p-3">Last Evaluation</th>
              <th class="text-left p-3">Signal Action</th>
              <th class="text-left p-3">Report</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="student in filteredStudents"
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
              <td class="p-3">
                <span :class="badgeClass(student.evalStatus)">{{ student.evalStatus }}</span>
              </td>
              <td class="p-3 text-gray-700 dark:text-gray-300">{{ student.lastEvalDate }}</td>
              <td class="p-3">
                <span :class="badgeClass(student.projectEvalStatus)">{{ student.projectEvalStatus }}</span>
              </td>
              <td class="p-3 text-gray-700 dark:text-gray-300">{{ student.projectEvalDate }}</td>
              <td class="p-3 text-purple-600 hover:underline cursor-pointer" @click="goToNewEvaluation(student.id)">➕ New Evaluation</td>
              <td class="p-3 text-purple-600 hover:underline cursor-pointer" @click="goToViewReport(student.id)">View Report →</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
</ProfLayout>
  </template>
  
  <script setup>
  import { ref, onMounted, computed } from 'vue'
  import axios from 'axios'
  import { useRouter } from 'vue-router'
  import ProfLayout from '@/components/layout/ProfLayout.vue'
  
  const router = useRouter()
  const search = ref('')
  const students = ref([])
  
  onMounted(async () => {
    const res = await axios.get('http://localhost:3001/ClasseStudents') 
    students.value = res.data
  })
  
  const filteredStudents = computed(() =>
    students.value.filter((s) =>
      s.fullName.toLowerCase().includes(search.value.toLowerCase())
    )
  )
  
  const badgeClass = (status) => {
    return status === 'submitted'
      ? 'text-green-800 bg-green-100 dark:text-green-300 dark:bg-green-900 px-2 py-1 rounded-full text-xs font-semibold'
      : 'text-orange-800 bg-orange-100 dark:text-orange-300 dark:bg-orange-900 px-2 py-1 rounded-full text-xs font-semibold'
  }
  
  const goToNewEvaluation = (id) => {
    router.push(`/ChooseSkills`)
  }
  
  const goToViewReport = (id) => {
    router.push(`/viewreport?id=${id}`)
  }


  const levels = ['AP1', 'AP2', 'CI1', 'CI2', 'CI3']
const selected = ref('AP1') // par défaut sélectionné
  </script>
  
  
  
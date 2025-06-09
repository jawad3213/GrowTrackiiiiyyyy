<template>
  <admin-layout>
  
  <h1 class="text-4xl font-bold text-gray-900 mb-7">
    Welcome to Your Professor Dashboard <span class="uppercase">{{storedUsername}}</span>,
    <span class="text-xl font-medium text-gray-500">
      here’s what’s happening with your Dash this month
    </span>
  </h1>

  <div class="mb-20 grid grid-cols-12 gap-4 md:gap-6">
  <!-- Left column: ecommerce-metrics + monthly-sale -->
  <div class="col-span-12 xl:col-span-7 space-y-15">
    <EcommerceMetricsProf/>
    <MonthlySaleProf/>
  </div>

  <!-- Right column: monthly-target -->
  <div class="col-span-12 xl:col-span-5 space-y-15">
    <MonthlyTargetProf/>
  </div>
  </div>
  
  <DailyStudentProf/>
  
  <div class=" mt-20 overflow-x-auto rounded-xl shadow bg-white dark:bg-gray-900">
    <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
      <thead class="bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm">
        <tr>
          
          <th class="text-left px-6 py-3">Full name</th>
          <th class="text-left px-6 py-3">Level</th>
          <th class="text-left px-6 py-3">Classe</th>
          <th class="text-left px-6 py-3">Average Score</th>
         <!-- <th class="text-left px-6 py-3">Badge</th>  -->
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
        <tr v-for="student in topStudents" :key="student.full_name" class="hover:bg-gray-50 dark:hover:bg-gray-800">
          
          <td class="px-6 py-4 flex items-center gap-3">
            <img :src="student.profile_picture_url || student.profile_picture" alt="avatar" class="w-10 h-10 rounded-full object-cover" />
            <div>
              <div class="font-medium text-gray-900 dark:text-white">{{ student.full_name }}</div>
            </div>
          </td>
          <td class="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{{ student.sector_id }}</td>
          <td class="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{{ student.id_class }}</td>
          <td class="px-6 py-4 text-sm font-semibold text-yellow-600 flex ml-10 mb-5 gap-1">
            {{ student.average }}
            <svg class="w-4 h-4 fill-yellow-500" viewBox="0 0 24 24"><path d="M12 .587l3.668 7.571L24 9.748l-6 5.849 1.416 8.26L12 18.896 4.584 23.857 6 15.597 0 9.748l8.332-1.59z"/></svg>
          </td>
         <!-- <td class="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{{ student.badge }}</td> -->
        </tr>
      </tbody>
    </table>
  </div>
  


</admin-layout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api'
import { useAuthStore } from '@/stores/auth'
import AdminLayout from '@/components/layout/ProfLayout.vue'
import EcommerceMetricsProf from './ecommerce/EcommerceMetricsProf.vue'
import MonthlyTargetProf from './ecommerce/MonthlyTargetProf.vue'
import MonthlySaleProf from './ecommerce/MonthlySaleProf.vue'
import DailyStudentProf from './ecommerce/DailyStudentProf.vue'

const authStore = useAuthStore()
const idProf = authStore.ID
// Déclarer la variable réactive
const topStudents = ref([])
const storedUsername = localStorage.getItem('username') || ''
//import username from local storage 

onMounted(() => {
 
 
})
// Charger les données depuis l'AP I
onMounted(async () => {
  try {
    const response = await api.get(`/prof/dashboard/classement/${idProf}` )
    topStudents.value = response.data.topByClass
    console.log('Top Students:', topStudents.value)
  } catch (error) {
    console.error('Erreur lors du chargement des étudiants :', error)
  }
})
</script>

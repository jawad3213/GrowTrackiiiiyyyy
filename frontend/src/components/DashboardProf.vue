<template>
  <admin-layout>

  <h1 class="text-4xl font-bold text-gray-900 mb-7">
    Welcome back Professor <span class="uppercase">{{kiko}}</span>,
    <span class="text-xl font-medium text-gray-500">
      here’s what’s happening in your classes this month
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
  
 <TwichiyaTop :id-prof="idProf" />
 

</admin-layout>

</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api'
import { useAuthStore } from '@/stores/auth.js'
import AdminLayout from '@/components/layout/ProfLayout.vue'
import EcommerceMetricsProf from './ecommerce/EcommerceMetricsProf.vue'
import MonthlyTargetProf from './ecommerce/MonthlyTargetProf.vue'
import MonthlySaleProf from './ecommerce/MonthlySaleProf.vue'
import DailyStudentProf from './ecommerce/DailyStudentProf.vue'
import GeneratePdf from '@/components/GeneratePdf.vue'
import TwichiyaTop  from '@/components/TwichiyaTop.vue'

const authStore = useAuthStore()
const idProf = authStore.ID
// Déclarer la variable réactive
const topStudents = ref([])
const storedUsername = localStorage.getItem('username') || ''
//import username from local storage 
const kiko=authStore.full_name
onMounted(() => {
  const storedUsername = authStore.user || 'jaouad'
  if (storedUsername) {
    console.log('Username ', storedUsername)
  } else {
    console.log('No username found ')
  }
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

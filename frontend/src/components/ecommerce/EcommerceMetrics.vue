<template>
  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
    <!-- Total Users -->
<div class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
  <div class="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
    <!-- icône utilisateur -->
<svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#666666"><path d="M0-240v-56.33q0-40.05 42.33-65.19 42.34-25.15 111.25-25.15 12.45 0 23.93.5 11.49.5 22.49 2.27-10 18.57-15 38.11-5 19.55-5 40.79v65H0Zm240 0v-65q0-32 17.5-58.5T307-410q32-20 76.5-30t96.5-10q53 0 97.5 10t76.5 30q32 20 49 46.5t17 58.5v65H240Zm540 0v-65q0-21.91-4.5-41.29t-14.17-37.56q11-1.82 22.28-2.32 11.29-.5 23.06-.5 69 0 111.16 24.68Q960-337.31 960-296.33V-240H780Zm-471.67-66.67H652v-4q-3.33-31.33-52.17-52Q551-383.33 480-383.33t-119.83 20.66Q311.33-342 308.33-310v3.33ZM153.04-420q-30.04 0-51.54-21.54T80-493.33q0-30.67 21.54-52 21.54-21.34 51.79-21.34 30.67 0 52 21.34 21.34 21.33 21.34 52.29 0 30.04-21.34 51.54Q184-420 153.04-420Zm653.34 0q-30.05 0-51.55-21.54-21.5-21.54-21.5-51.79 0-30.67 21.55-52 21.54-21.34 51.79-21.34 30.66 0 52 21.34Q880-524 880-493.04q0 30.04-21.33 51.54-21.34 21.5-52.29 21.5ZM480-480q-50 0-85-35t-35-85q0-51 35-85.5t85-34.5q51 0 85.5 34.5T600-600q0 50-34.5 85T480-480Zm.23-66.67q22.77 0 37.94-15.4 15.16-15.4 15.16-38.16 0-22.77-15.26-37.94-15.27-15.16-37.84-15.16-22.56 0-38.06 15.26-15.5 15.27-15.5 37.84 0 22.56 15.4 38.06 15.4 15.5 38.16 15.5Zm.1 240ZM480-600Z"/></svg>
  </div>
  <div class="flex items-end justify-between mt-5">

    <div>
      <span class="text-sm text-gray-500 dark:text-gray-400">Total users</span>
      <h4 class="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
        {{ totalUsers }}
      </h4>
      
    </div>
    <!-- pourcentage utilisateurs -->
    <span
        :class="[
          'flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium',
          trendUser === 'increased'
            ? 'bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400'
            : trendUser === 'decreased'
            ? 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400'
            : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
        ]"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            :d="trendUser === 'increased'
              ? 'M5 10l7-7m0 0l7 7m-7-7v18'
              : trendUser === 'decreased'
              ? 'M19 14l-7 7m0 0l-7-7m7 7V3'
              : ''"
          />
        </svg>
        {{ `${userGrowth}%` }}
      </span>

  </div>
</div>

<!-- Total Evaluations -->
<div class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
  <div class="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
    <!-- icône livre / évaluation -->
    <svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#666666"><path d="M186.67-120q-27.5 0-47.09-19.58Q120-159.17 120-186.67v-586.66q0-27.5 19.58-47.09Q159.17-840 186.67-840h192.66q7.67-35.33 35.84-57.67Q443.33-920 480-920t64.83 22.33Q573-875.33 580.67-840h192.66q27.5 0 47.09 19.58Q840-800.83 840-773.33v586.66q0 27.5-19.58 47.09Q800.83-120 773.33-120H186.67Zm0-66.67h586.66v-586.66H186.67v586.66ZM280-280h275.33v-66.67H280V-280Zm0-166.67h400v-66.66H280v66.66Zm0-166.66h400V-680H280v66.67Zm200-181.34q13.67 0 23.5-9.83t9.83-23.5q0-13.67-9.83-23.5t-23.5-9.83q-13.67 0-23.5 9.83t-9.83 23.5q0 13.67 9.83 23.5t23.5 9.83Zm-293.33 608v-586.66 586.66Z"/></svg>
  </div>
  <div class="flex items-end justify-between mt-5">
    <div>
      <span class="text-sm text-gray-500 dark:text-gray-400">Total evaluations</span>
      <h4 class="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
        {{ totalEvaluations }}
      </h4>
    </div>
    <!-- pourcentage évaluations -->
    <span
  :class="[
    'flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium',
    trendEval === 'increased'
      ? 'bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400'
      : trendEval === 'decreased'
      ? 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400'
      : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
  ]"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    class="w-4 h-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      :d="trendEval === 'increased'
        ? 'M5 10l7-7m0 0l7 7m-7-7v18'            // flèche vers le haut
        : trendEval === 'decreased'
        ? 'M19 14l-7 7m0 0l-7-7m7 7V3'          // flèche vers le bas
        : ''"
    />
  </svg>
  {{ `${evaluationGrowth}%` }}
</span>

  </div>
</div>

  </div>



</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api'

const totalUsers = ref(0)
const totalEvaluations = ref(0)
const userGrowth = ref(0)
const trendUser = ref('')
const trendEval = ref('')
const evaluationGrowth = ref(0)

onMounted(async () => {
  try {
    // Total users
    const resUsers = await api.get('http://localhost:3000/api/DashAdmin/Total_User')
    totalUsers.value = resUsers.data

    // Growth in users
    const resUserGrowth = await api.get('http://localhost:3000/api/DashAdmin/Stat_User')
    userGrowth.value = resUserGrowth.data.percentage
    trendUser.value = resUserGrowth.data.trend

    // Total evaluations
    const resEvals = await api.get('http://localhost:3000/api/DashAdmin/Total_Evaluation')
    totalEvaluations.value = resEvals.data

    // Growth in evaluations
    const resEvalGrowth = await api.get('http://localhost:3000/api/DashAdmin/Stat_Evaluation')
    evaluationGrowth.value = resEvalGrowth.data.percentage
    trendEval.value = resEvalGrowth.data.trend
  } catch (error) {
    console.error('❌ Erreur API dashboard :', error)
  }
})

</script>

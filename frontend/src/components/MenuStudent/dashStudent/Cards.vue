<template>
  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
    <!-- Total Users -->
    <div class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
      <div class="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
        <svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill="#666666">
          <path d="M80-160v-100q0-33.67 17-62.33Q114-351 146.67-366q65-30 126.33-45.33 61.33-15.34 127-15.34 29.33 0 60.5 3.34Q491.67-420 523.33-412l-56 56q-17-2-33.5-3T400-360q-62.33 0-112.83 12.67-50.5 12.66-112.5 41.33-14.34 7-21.17 20-6.83 13-6.83 26v33.33h296L509.33-160H80Zm544 16L484-284l46.67-46.67L624-237.33l209.33-209.34L880-400 624-144ZM400-481.33q-66 0-109.67-43.67-43.66-43.67-43.66-109.67t43.66-109.66Q334-788 400-788t109.67 43.67q43.66 43.66 43.66 109.66T509.67-525Q466-481.33 400-481.33Zm42.67 254.66ZM400-548q37 0 61.83-24.83 24.84-24.84 24.84-61.84t-24.84-61.83Q437-721.33 400-721.33t-61.83 24.83q-24.84 24.83-24.84 61.83t24.84 61.84Q363-548 400-548Zm0-86.67Z"/>
        </svg>
      </div>
      <div class="flex items-end justify-between mt-5">
        <div>
          <span class="text-sm text-gray-500 dark:text-gray-400">Projects Enrolled</span>
          <h4 class="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">{{ totalUsers }}</h4>
        </div>
        <!-- pourcentage utilisateurs -->
        <span :class="[
          'flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium',
          trendUser === 'increased'
            ? 'bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400'
            : trendUser === 'decreased'
            ? 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400'
            : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
        ]">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="trendUser === 'increased' ? 'M5 10l7-7m0 0l7 7m-7-7v18' : trendUser === 'decreased' ? 'M19 14l-7 7m0 0l-7-7m7 7V3' : ''"/>
          </svg>
        </span>
      </div>
    </div>

    <!-- Total Evaluations -->
    <div class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
      <div class="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
        <svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill="#666666">
          <path d="m40-120 440-760 440 760H40Zm115.33-66.67h649.34L480-746.67l-324.67 560ZM482.78-238q14.22 0 23.72-9.62 9.5-9.61 9.5-23.83 0-14.22-9.62-23.72-9.61-9.5-23.83-9.5-14.22 0-23.72 9.62-9.5 9.62-9.5 23.83 0 14.22 9.62 23.72 9.62 9.5 23.83 9.5Zm-33.45-114H516v-216h-66.67v216ZM480-466.67Z"/>
        </svg>
      </div>
      <div class="flex items-end justify-between mt-5">
        <div>
          <span class="text-sm text-gray-500 dark:text-gray-400">Signals Received</span>
          <h4 class="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">{{ totalEvaluations }}</h4>
        </div>
        <!-- pourcentage évaluations -->
        <span :class="[
          'flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium',
          trendEval === 'increased'
            ? 'bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400'
            : trendEval === 'decreased'
            ? 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400'
            : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
        ]">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="trendEval === 'increased' ? 'M5 10l7-7m0 0l7 7m-7-7v18' : trendEval === 'decreased' ? 'M19 14l-7 7m0 0l-7-7m7 7V3' : ''"/>
          </svg>
        </span>
      </div>
    </div>
  </div>

  <!--2-->
  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
    <!-- Score moyen -->
    <div class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
      <div class="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
        <svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill="#666666">
          <path d="M840-120v-640H120v320H40v-320q0-33 23.5-56.5T120-840h720q33 0 56.5 23.5T920-760v560q0 33-23.5 56.5T840-120ZM360-400q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47Zm0-80q33 0 56.5-23.5T440-560q0-33-23.5-56.5T360-640q-33 0-56.5 23.5T280-560q0 33 23.5 56.5T360-480ZM40-80v-112q0-34 17.5-62.5T104-298q62-31 126-46.5T360-360q66 0 130 15.5T616-298q29 15 46.5 43.5T680-192v112H40Zm80-80h480v-32q0-11-5.5-20T580-226q-54-27-109-40.5T360-280q-56 0-111 13.5T140-226q-9 5-14.5 14t-5.5 20v32Zm240-400Zm0 400Z"/>
        </svg>
      </div>
      <div class="flex items-end justify-between mt-5">
        <div>
          <span class="text-sm text-gray-500 dark:text-gray-400">Class Score</span>
          <h4 class="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">{{ userGrowth }}</h4>
        </div>
        <!-- pourcentage -->
        <span :class="[
          'flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium',
          trendUser === 'increased'
            ? 'bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400'
            : trendUser === 'decreased'
            ? 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400'
            : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
        ]">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="trendUser === 'increased' ? 'M5 10l7-7m0 0l7 7m-7-7v18' : trendUser === 'decreased' ? 'M19 14l-7 7m0 0l-7-7m7 7V3' : ''"/>
          </svg>
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const totalUsers = ref(0)
const totalEvaluations = ref(0)
const userGrowth = ref(0)
const trendUser = ref('')
const trendEval = ref('')
const evaluationGrowth = ref(0)
const jijo = ref(0)

jijo.value = auth.ID

onMounted(async () => {
  try {
    // Projects enrolled
    const resUsers = await api.get(`http://localhost:3000/student/dashboard/nombre_projets/${auth.ID}`)
    totalUsers.value = resUsers.data.data.count

    // class score
    const resUserGrowth = await api.get(`http://localhost:3000/student/dashboard/moyenne/${auth.ID}`)
    userGrowth.value = resUserGrowth.data.data.moyenne

    // Total evaluations
    const resEvals = await api.get(`http://localhost:3000/student/dashboard/signalreceived/${auth.ID}`)
    totalEvaluations.value = resEvals.data.data.total

    // Growth in evaluations
    // const resEvalGrowth = await axios.get('http://localhost:3000/api/DashAdmin/Stat_Evaluation')
    // evaluationGrowth.value = resEvalGrowth.data.percentage
    // trendEval.value = resEvalGrowth.data.trend
  } catch (error) {
    console.error('❌ Erreur API dashboard :', error)
  }
})
</script>

<template>
  <div class="rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/[0.03]">
    <div class="px-5 pt-5 bg-white shadow-default rounded-2xl pb-20 dark:bg-gray-900 sm:px-6 sm:pt-6">
      <div class="flex justify-between">
        <div>
          <h3 class="text-lg font-semibold text-gray-800 dark:text-white/90">Completion Rate</h3>
          <p class="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
            Percentage of evaluations already submitted 
          </p>
        </div>
      </div>

      <div class="relative max-h-[195px]">
        <div id="chartTwo" class="h-full">
          <div class="radial-bar-chart">
            <VueApexCharts type="radialBar" height="330" :options="chartOptions" :series="[totalInvolvement]" />
          </div>
        </div>
      </div>
    </div>

    <div class="flex items-center justify-center gap-8 sm:gap-12 px-6 py-5">

      <div class="flex flex-col items-center justify-center">
  <p class="mb-1 text-gray-500 text-theme-xs text-center dark:text-gray-400 sm:text-lg">
    Evaluation Assigned
  </p>
  <span
    :class="[
      'bg-gray-300 flex items-center justify-center gap-1 rounded-full px-2 py-1 text-lg font-medium',
      trend === 'increased'
        ? 'bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400'
        : trend === 'decreased'
        ? 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400'
        : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
    ]"
  >
    {{ `${growth}` }}
  </span>
</div>


      <div class="h-10 w-px bg-gray-300 "></div>

      <div class="flex flex-col items-center justify-center">
  <p class="mb-1 text-gray-500 text-theme-xs text-center dark:text-gray-400 sm:text-lg">
    Evaluation Submitted
  </p>
  <span
    :class="[
      'bg-gray-300 flex items-center justify-center gap-1 rounded-full px-3 py-1 text-lg font-medium',
      trend === 'increased'
        ? 'bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400'
        : trend === 'decreased'
        ? 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400'
        : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
    ]"
  >
    {{ `${trend}` }}
  </span>
</div>

    </div>
  </div>
</template>


<script setup>
import api from '@/services/api'
import VueApexCharts from 'vue3-apexcharts'
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const totalInvolvement = ref(0)
const growth = ref(0)
const trend = ref('')


onMounted(async () => {
  try {
    // API 1 : pourcentage
    // const currentRes = await api.get('http://localhost:3000/api/DashAdmin/Stat_Involvement')
    // totalInvolvement.value = currentRes.data.percentage

    // API 2 : subblitted
    const sub = await api.get(`http://localhost:3000/student/dashboard/evaluation_submitted/${auth.ID}`)
    growth.value = sub.data.data.total
    console.log(growth.value )
    // AP 3 : assigned
    const assig = await api.get(`http://localhost:3000/student/dashboard/evaluation_assigned/${auth.ID}`)
    trend.value = assig.data.data.total
  } catch (error) {
    console.error('Erreur lors des appels API :', error)
  } 
})


const chartOptions = {
  colors: ['#692CF3'],
  chart: { fontFamily: 'Outfit, sans-serif', sparkline: { enabled: true } },
  plotOptions: {
    radialBar: {
      startAngle: -90,
      endAngle: 90,
      hollow: { size: '80%' },
      track: {
        background: '#E4E7EC',
        strokeWidth: '100%',
        margin: 5,
      },
      dataLabels: {
        name: { show: false },
        value: {
          fontSize: '36px',
          fontWeight: '600',
          offsetY: 90,
          color: '#1D2939',
          formatter: val => `${val.toFixed(2)}%`,
        },
      },
    },
  },
  fill: { type: 'solid', colors: ['#692CF3'] },
  stroke: { lineCap: 'round' },
  labels: ['Progress'],
}
</script>



<style scoped>
.radial-bar-chart {
  width: 100%;
  max-width: 330px;
  margin: 0 auto;
}
</style>

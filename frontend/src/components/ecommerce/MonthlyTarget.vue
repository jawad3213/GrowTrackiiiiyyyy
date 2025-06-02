<template>
  <div class="rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/[0.03]">
    <div class="px-5 pt-5 bg-white shadow-default rounded-2xl pb-20 dark:bg-gray-900 sm:px-6 sm:pt-6">
      <div class="flex justify-between">
        <div>
          <h3 class="text-lg font-semibold text-gray-800 dark:text-white/90">User Involvement Rate</h3>
          <p class="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
            Percentage of users who actively engaged during this month
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

    <div class="flex items-center  justify-center gap-5 px-6 py-3.5 sm:gap-8 sm:py-5">
      <div>
        <p class="mb-1 text-gray-500 text-theme-xs dark:text-gray-400 sm:text-lg">Target</p>
        <span
        :class="[
          'flex items-center gap-1 rounded-full px-3 py-1 text-lg font-medium',
          trend === 'increased'
            ? 'bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400'
            : trend === 'decreased'
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
        {{ `${growth}%` }}
      </span>

      </div>
    </div>
  </div>
</template>


<script setup>
import api from '@/services/api'
import VueApexCharts from 'vue3-apexcharts'
import { ref, onMounted, computed } from 'vue'

const totalInvolvement = ref(0)
const growth = ref(0)
const trend = ref('')


onMounted(async () => {
  try {
    // API 1 : Récupération du taux d'implication actuel
    const currentRes = await api.get('http://localhost:3000/api/DashAdmin/Stat_Involvement')
    totalInvolvement.value = currentRes.data.percentage

    // API 2 : Récupération de la différence et tendance
    const diffRes = await api.get('http://localhost:3000/api/DashAdmin/Stat_Involvement_target')
    growth.value = diffRes.data.percentage
    trend.value = diffRes.data.trend
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

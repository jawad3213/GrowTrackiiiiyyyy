<template>
    <div class="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 pb-6 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div class="flex items-center justify-between mb-4">
        <div>
          <h3 class="text-lg font-semibold text-gray-800 dark:text-white">Daily Student Evaluations Activity</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Number of self-evaluations and peer evaluations submitted by your students over this month
          </p>
        </div>
  
        <div class="flex items-center gap-2 rounded-lg bg-gray-100 dark:bg-gray-800 p-1">
          <button
            v-for="(classe, index) in classes"
            :key="index"
            @click="selectClasse(index)"
            :class="[
              'px-4 py-1.5 text-sm rounded-md transition-all',
              selectedClasse === index
                ? 'bg-white shadow-sm text-gray-900 dark:bg-gray-700 dark:text-white'
                : 'text-gray-500 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white'
            ]"
          >
            {{ classe }}
          </button>
        </div>
      </div>
  
      <div class="max-w-full overflow-x-auto custom-scrollbar">
        <div id="chartBar" class="-ml-5 min-w-[800px] xl:min-w-full pl-2">
          <VueApexCharts type="bar" height="250" :options="chartOptions" :series="series" />
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
import { ref } from 'vue'
import VueApexCharts from 'vue3-apexcharts'

const classes = ['Classe1', 'Classe2', 'Classe3', 'Classe4']
const selectedClasse = ref(0)

const dataParClasse = [
  // Classe 1
  [160, 390, 200, 290, 180, 190, 280, 100, 210, 390, 270, 100, 95, 110, 215, 185, 295, 175, 105, 385, 115, 225, 285, 235, 275, 105, 115, 275, 385, 95],
  // Classe 2
  [120, 200, 150, 210, 140, 160, 200, 90, 180, 250, 230, 90, 85, 100, 190, 170, 240, 150, 95, 270, 100, 210, 240, 210, 240, 100, 100, 240, 270, 80],
  // Classe 3
  [100, 170, 130, 190, 130, 140, 180, 85, 160, 220, 210, 80, 80, 90, 170, 150, 200, 130, 90, 240, 90, 180, 200, 190, 210, 90, 95, 200, 250, 75],
  // Classe 4
  [90, 150, 120, 170, 110, 130, 160, 75, 140, 200, 190, 70, 70, 80, 150, 130, 180, 110, 85, 220, 80, 160, 180, 170, 190, 80, 85, 180, 230, 65],
]

const series = ref([
  {
    name: 'Evaluations',
    data: dataParClasse[0]
  }
])

const selectClasse = (index) => {
  selectedClasse.value = index
  series.value = [{
    name: 'Evaluations',
    data: dataParClasse[index]
  }]
}

const chartOptions = ref({
  colors: ['#692CF3'],
  chart: {
    fontFamily: 'Outfit, sans-serif',
    type: 'bar',
    toolbar: { show: false }
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '38%',
      borderRadius: 5,
      borderRadiusApplication: 'end',
    }
  },
  dataLabels: { enabled: false },
  stroke: {
    show: true,
    width: 4,
    colors: ['transparent'],
  },
  xaxis: {
    categories: Array.from({ length: 30 }, (_, i) => (i + 1).toString()),
    axisBorder: { show: false },
    axisTicks: { show: false },
  },
  yaxis: { title: false },
  grid: {
    yaxis: { lines: { show: true } }
  },
  fill: { opacity: 1 },
  tooltip: {
    x: { show: false },
    y: {
      formatter: (val) => val.toString()
    }
  }
})
</script>

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
import { ref, onMounted, watch } from 'vue'
import VueApexCharts from 'vue3-apexcharts'
import api from '@/services/api'

const classes = ['Classe1', 'Classe2', 'Classe3', 'Classe4']
const selectedClasse = ref(0)
const series = ref([
  {
    name: 'Evaluations',
    data: []
  }
])

// Simulation des IDs de classe correspondants
const classIds = [1, 2, 3, 4]

// On suppose que "month" = mois actuel 
 const currentMonth = new Date().getMonth() + 1

const fetchData = async () => {
  try {
    const classId = classIds[selectedClasse.value]
    const response = await api.get(`http://localhost:3000/prof/dashboard/dailyevaluation`, {
      params: {
        classId,
        month: currentMonth
      }
    })

    console.log('Données reçues:', response.data)

    // Extraire uniquement les totaux pour ApexCharts
    const data = response.data.map(item => item.total)

    series.value = [{
      name: 'Evaluations',
      data: data
    }]
  } catch (error) {
    console.error('Erreur lors de la récupération des données:', error)
  }
}


// Appel initial
onMounted(fetchData)



const selectClasse = (index) => {
  selectedClasse.value = index
}


// Appel à chaque changement de classe
watch(selectedClasse, fetchData)


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

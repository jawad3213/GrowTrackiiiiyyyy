<template>
  <div class="rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-semibold text-gray-800 dark:text-white/90">Flagged Evaluations</h3>

      <!-- Classe Buttons -->
      <div class="mt-4 ml-10 flex items-center gap-2 rounded-lg bg-gray-100 p-1 w-fit dark:bg-gray-800">
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

      <!-- Dropdown -->
      <div class="relative h-fit">
        <DropdownMenu :menu-items="menuItems">
          <template #icon>
            <svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd"
                d="M10.2441 6C10.2441 5.0335 11.0276 4.25 11.9941 4.25H12.0041C12.9706 4.25 13.7541 5.0335 13.7541 6C13.7541 6.9665 12.9706 7.75 12.0041 7.75H11.9941C11.0276 7.75 10.2441 6.9665 10.2441 6ZM10.2441 18C10.2441 17.0335 11.0276 16.25 11.9941 16.25H12.0041C12.9706 16.25 13.7541 17.0335 13.7541 18C13.7541 18.9665 12.9706 19.75 12.0041 19.75H11.9941C11.0276 19.75 10.2441 18.9665 10.2441 18ZM11.9941 10.25C11.0276 10.25 10.2441 11.0335 10.2441 12C10.2441 12.9665 11.0276 13.75 11.9941 13.75H12.0041C12.9706 13.75 13.7541 12.9665 13.7541 12C13.7541 11.0335 12.9706 10.25 12.0041 10.25H11.9941Z"
                fill="currentColor" />
            </svg>
          </template>
        </DropdownMenu>
      </div>
    </div>

    <!-- Graph -->
    <div class="max-w-full overflow-x-auto custom-scrollbar mt-6">
      <div id="chartOne" class="-ml-5 min-w-[650px] xl:min-w-full pl-2">
        <VueApexCharts type="bar" height="220" :options="chartOptions" :series="series" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import VueApexCharts from 'vue3-apexcharts'

const series = ref([])
const classes = ref([])
const selectedClasse = ref(0)
const allData = ref([])

const months = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
]

const chartOptions = ref({
  chart: {
    type: 'bar',
    fontFamily: 'Outfit, sans-serif',
    toolbar: { show: false }
  },
  colors: ['#692CF3'],
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '39%',
      borderRadius: 5,
      borderRadiusApplication: 'end'
    }
  },
  dataLabels: { enabled: false },
  stroke: {
    show: true,
    width: 4,
    colors: ['transparent']
  },
  xaxis: {
    categories: months,
    axisBorder: { show: false },
    axisTicks: { show: false }
  },
  legend: {
    show: true,
    position: 'top',
    horizontalAlign: 'left',
    fontFamily: 'Outfit',
    markers: { radius: 99 }
  },
  fill: { opacity: 1 },
  tooltip: {
    x: { show: false },
    y: {
      formatter: val => `${val} flagged`
    }
  },
  grid: {
    yaxis: { lines: { show: true } }
  }
})

const menuItems = [
  { label: 'View More', onClick: () => console.log('View More clicked') },
  { label: 'Delete', onClick: () => console.log('Delete clicked') }
]

const selectClasse = (index) => {
  selectedClasse.value = index
  series.value = [{
    name: 'Flagged',
    data: allData.value[index].monthly
  }]
}

onMounted(async () => {
  const { data } = await axios.get('http://localhost:3001/flaggedEvaluations')
  allData.value = data
  classes.value = data.map(c => c.classe)
  selectClasse(0) // initialiser par défaut
})
</script>

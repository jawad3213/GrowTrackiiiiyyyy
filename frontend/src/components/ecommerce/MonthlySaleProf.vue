<template>
  <div
    class="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6"
  >
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-semibold text-gray-800 dark:text-white/90">Flagged Evaluations</h3>

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
      <div id="chartOne" class="-ml-5 min-w-[650px] xl:min-w-full pl-2">
        <VueApexCharts type="bar" height="180" :options="chartOptions" :series="series" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import DropdownMenu from '../common/DropdownMenu.vue'
import VueApexCharts from 'vue3-apexcharts'
import api from '@/services/api'

const classes = ['Classe1', 'Classe2', 'Classe3', 'Classe4']
const selectedClasse = ref(0)

const series = ref([])

const classIds = [1, 2, 3, 4]


//pour les trois points existent a droit haut
const menuItems = [
  { label: 'View More', onClick: () => console.log('View More clicked') },
  { label: 'Delete', onClick: () => console.log('Delete clicked') },
]

onMounted(async () => {
  try {
    const classId = classIds[selectedClasse.value]
    const res = await api.get('http://localhost:3000/prof/dashboard/graphe', {
      params: {
        classId,
      }
    });
    console.log(res.data)

    // Remplir les données de la série avec ce que l'API renvoie
    series.value = [{
      name: 'Flagged',
      data: res.data.data.map(item => item.total)
    }]


  } catch (error) {
    console.error('Erreur API flagged_evaluation :', error)
  }
})

const selectClasse = (index) => {
  selectedClasse.value = index
}



const chartOptions = ref({
  colors: ['#692CF3'],
  chart: {
    fontFamily: 'Outfit, sans-serif',
    type: 'bar',
    toolbar: {
      show: false,
    },
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '39%',
      borderRadius: 5,
      borderRadiusApplication: 'end',
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    show: true,
    width: 4,
    colors: ['transparent'],
  },
  xaxis: {
    categories: [
      'Sep',
      'Oct',
      'Nov',
      'Dec',
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
    ],
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  legend: {
    show: true,
    position: 'top',
    horizontalAlign: 'left',
    fontFamily: 'Outfit',
    markers: {
      radius: 99,
    },
  },
  yaxis: {
    title: false,
  },
  grid: {
    yaxis: {
      lines: {
        show: true,
      },
    },
  },
  fill: {
    opacity: 1,
  },
  tooltip: {
    x: {
      show: false,
    },
    y: {
      formatter: function (val) {
        return val.toString()
      },
    },
  },
})

onMounted(() => {
  // Any additional setup can be done here if needed
})
</script>

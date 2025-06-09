<template>
  <div class="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 pb-6 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
    <div class="flex items-center justify-between mb-4">
      <div>
        <h3 class="text-lg font-semibold text-gray-800 dark:text-white">
          Daily Student Evaluations Activity
        </h3>
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

// ─── Données de démonstration ───
// Remplacez ce tableau par vos noms réels de classes (ex. ['1A', '1B', '2A', …])
const classes = ref([])

const selectedClasse = ref(0)
const series = ref([
  {
    name: 'Evaluations',
    data: []
  }
])

// Simuler les IDs que l’API attend pour chaque classe
const classIds = [1, 2, 3, 4]

// Mois courant (1 à 12)
const currentMonth = new Date().getMonth() + 1

// Options initiales d’ApexCharts (yaxis sera écrasé dynamiquement)
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
    // On affiche les jours 1, 2, …, 30
    categories: Array.from({ length: 30 }, (_, i) => (i + 1).toString()),
    axisBorder: { show: false },
    axisTicks: { show: false }
  },
  // Valeurs par défaut avant le premier fetchData()
  yaxis: {
    min: 0,
    max: 2,
    tickAmount: 1,
    labels: {
      formatter: (val) => val.toFixed(0)
    }
  },
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

/**
 * Récupère les totaux quotidiens d’évaluations depuis l’API,
 * met à jour `series.value` et recalcule l’axe Y avec un pas de 2.
 */
const fetchData = async () => {
  try {
    const classId = classIds[selectedClasse.value]
    const response = await api.get(
      'http://localhost:3000/prof/dashboard/dailyevaluation',
      {
        params: {
          classId,
          month: currentMonth
        }
      }
    )

    // On suppose que response.data est un tableau d’objets { total: <nombre> }
    const data = response.data.map(item => item.total)

    // Mise à jour des données du graphique
    series.value = [
      {
        name: 'Evaluations',
        data: data
      }
    ]

    // ── CALCUL POUR PAS DE 2 ──
    // 1. Valeur maximale réelle de la série
    const maxVal = data.length ? Math.max(...data) : 0
    // 2. On arrondit au multiple de 2 juste au-dessus (ex. si maxVal=5 → maxEven=6)
    const maxEven = Math.ceil(maxVal / 2) * 2

    // 3. Nombre d’intervalles = maxEven / 2
    //    Par exemple, si maxEven = 6, on veut les ticks [0, 2, 4, 6] → 3 intervalles
    const intervals = maxEven / 2

    // Mise à jour dynamique de l’axe Y pour un pas de 2
    chartOptions.value = {
      ...chartOptions.value,
      yaxis: {
        min: 0,
        max: maxEven,
        tickAmount: intervals,
        labels: {
          formatter: (val) => val.toFixed(0)
        }
      }
    }
    // ────────────────────────────

    // Si jamais vous souhaitez revenir à un PAS DE 1 au lieu de 2,
    // il suffirait de remplacer le bloc ci-dessus par :
    //
    // const maxVal = data.length ? Math.max(...data) : 0
    // chartOptions.value = {
    //   ...chartOptions.value,
    //   yaxis: {
    //     min: 0,
    //     max: maxVal,
    //     tickAmount: maxVal,
    //     labels: { formatter: (v) => v.toFixed(0) }
    //   }
    // }
    //
    // Mais justement, ici on reste sur le pas de 2 comme demandé.

  } catch (error) {
    console.error('Erreur lors de la récupération des données :', error)
  }
}

onMounted(fetchData)
watch(selectedClasse, fetchData)

const selectClasse = (index) => {
  selectedClasse.value = index
}
</script>

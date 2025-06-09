<template>
  <div
    class="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6"
  >
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-gray-800 dark:text-white/90">
        Flagged Evaluations
      </h3>

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
        <VueApexCharts
          type="bar"
          height="180"
          :options="chartOptions"
          :series="series"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import VueApexCharts from 'vue3-apexcharts'
import api from '@/services/api'

/**
 * Liste des noms de classes. Adaptez selon votre contexte.
 * Exemple : ['Classe A', 'Classe B', 'Classe C', 'Classe D']
 */
const classes = ref([])
const selectedClasse = ref(0)

const series = ref([
  {
    name: 'Flagged',
    data: [] // sera rempli par l’API
  }
])

// IDs correspondant à chaque classe (à ajuster selon votre API)
const classIds = [1, 2, 3, 4]

/**
 * Options initiales pour ApexCharts.
 * On définit un yaxis par défaut (min=0, max=0, tickAmount=0) qui sera
 * écrasé après réception des données pour obtenir un pas de 2.
 */
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
      'Jun'
    ],
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
  // Valeurs par défaut pour yaxis (avant le fetch),
  // seront remplacées après réception des données pour un pas de 2.
  yaxis: {
    min: 0,
    max: 0,
    tickAmount: 0,
    labels: {
      formatter: (val) => val.toFixed(0)
    }
  },
  grid: {
    yaxis: {
      lines: { show: true }
    }
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
 * Récupère les données "flagged" pour la classe sélectionnée,
 * met à jour la série de données, puis recalcule le yaxis pour un pas de 2.
 */
const fetchFlaggedData = async () => {
  try {
    const classId = classIds[selectedClasse.value]
    const res = await api.get('http://localhost:3000/prof/dashboard/graphe', {
      params: { classId }
    })

    // On suppose que l'API renvoie { data: [{ total: <nombre> }, …] }
    const totals = res.data.data.map((item) => item.total)

    // Mise à jour de la série de données
    series.value = [
      {
        name: 'Flagged',
        data: totals
      }
    ]

    // ── CALCUL POUR PAS DE 2 ──
    // 1. Valeur maximale réelle de la série
    const maxVal = totals.length ? Math.max(...totals) : 0
    // 2. On arrondit au multiple de 2 juste au-dessus (ex. si maxVal = 5 → maxEven = 6)
    const maxEven = Math.ceil(maxVal / 2) * 2
    // 3. Nombre d’intervalles = maxEven / 2
    //    Exemple : si maxEven = 6, tickAmount = 3 → graduations à 0, 2, 4, 6
    const intervals = maxEven / 2

    // Mise à jour dynamique de l’axe Y pour un pas de 2 : 0, 2, 4, …, maxEven
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

  } catch (error) {
    console.error('Erreur API flagged_evaluation :', error)
  }
}

// Appel initial au montage
onMounted(fetchFlaggedData)

// Lorsque l'utilisateur change de classe, relancer la requête
watch(selectedClasse, fetchFlaggedData)

const selectClasse = (index) => {
  selectedClasse.value = index
}
</script>

<template>
  <div class="border border-gray-300 rounded-lg shadow p-4 bg-white">
    <apexchart type="radar" height="450" :options="chartOptions" :series="series"></apexchart>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import VueApexCharts from 'vue3-apexcharts'

const series = ref([])
const chartOptions = ref({
  chart: {
    height: 450,
    type: 'radar',
    toolbar: {
      show: true,
      tools: {
        download: true,  // uniquement "More"
        selection: false,
        zoom: false,
        zoomin: false,
        zoomout: false,
        pan: false,
        reset: false
      }
    }
  },
  title: {
    text: 'Dans la classe (1 seul classe)',
    align: 'center',
    style: {
      fontSize: '18px',
      fontWeight: 'bold'
    }
  },
  labels: [
    'Communication',
    'Public Speaking',
    'conflict',
    'Leadership',
    'Illustrator',
    'AfterEffect',
  ],// ✅ labels dynamiques
  stroke: {
    width: 2
  },
  fill: {
    opacity: 0.2
  },
  colors: ['#3B82F6', '#10B981'],

  legend: {
  position: 'right',
  offsetY: 60,     // ⬅️ Décale la légende vers le bas
  markers: {
    width: 10,
    height: 10
  },
  itemMargin: {
    vertical: 10    // ⬅️ Espace entre "Yourself" et "Classe"
  }
}

})

// Récupération des données
onMounted(async () => {
  try {
    // // 1. Récupérer les labels (noms de skills)
    // const { data: skillList } = await axios.get('http://localhost:3001/ChooseSkills')
    // const skillNames = skillList.map(s => s.name)
    // chartOptions.value.labels = skillNames

    // 2. Récupérer les évaluations radar
    const { data: radarData } = await axios.get('http://localhost:3001/evaluationsRadar')
    const evalData = radarData[0]

    // 3. Injecter les séries de données
    series.value = [
      {
        name: 'Yourself',
        data: evalData.yourself
      },
      {
        name: 'Classe',
        data: evalData.classe
      }
    ]
  } catch (error) {
    console.error('❌ Erreur de chargement des données:', error)
  }
})
</script>

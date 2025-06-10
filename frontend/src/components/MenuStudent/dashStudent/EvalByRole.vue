<template>
  <div class="bg-white border rounded-xl p-4 shadow">
    <h2 class="text-lg font-semibold mb-4">Number of Evaluation by role</h2>
    <apexchart height="350" type="bar" :options="chartOptions" :series="chartSeries" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api'
import VueApexCharts from 'vue3-apexcharts'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const chartSeries = ref([])
const chartOptions = ref({
  chart: {
    type: 'bar',
    stacked: false,
    toolbar: { show: false }
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '45%',
      borderRadius: 5,
      borderRadiusApplication: 'end',
    }
  },
  dataLabels: {
    enabled: false
  },
  xaxis: {
    categories: [], // sera rempli dynamiquement
  },
  legend: {
    position: 'top',
    horizontalAlign: 'right',
    offsetY: -10
  },
  colors: ['#a855f7', '#e9d5ff', '#3b82f6'],
  fill: {
    opacity: 1
  },
  tooltip: {
    y: {
      formatter: val => `${val.toLocaleString()}`
    }
  }
})

onMounted(async () => {
  try {
    const { data } = await api.get(`http://localhost:3000/student/dashboard/graphe/${auth.ID}`)

    const graphData = data.data 

    
    const months = graphData.map(item => String(item.month))
    const professor = graphData.map(item => item.Professor)
    const supervisor = graphData.map(item => item.Supervisor)
    const peer = graphData.map(item => item.Pair) // ⚠️ pas "Peer" mais "Pair"

    console.log(months)

    chartSeries.value = [
      { name: 'Professor', data: professor },
      { name: 'Supervisor', data: supervisor },
      { name: 'Peer', data: peer }
    ]

    chartOptions.value = {
      ...chartOptions.value,
      xaxis: {
        ...chartOptions.value.xaxis,
        categories: months,
        labels: { style: { fontSize: '12px' } } // facultatif : taille texte
      }
    }

    console.log('Mois:', months) // ← vérifie ici que tu as bien des mois
  } catch (error) {
    console.error('Erreur lors de la récupération des données du graphe:', error)
  }
})
</script>

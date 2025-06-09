<template>
  <div class="border border-gray-300 dark:border-gray-700 rounded-lg shadow p-4 bg-white dark:bg-gray-900">
    <apexchart type="radar" height="450" :options="chartOptions" :series="series" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const series = ref([])
const chartOptions = ref({
  chart: {
    height: 450,
    type: 'radar',
    toolbar: {
      show: true,
      tools: {
        download: true,
        selection: false,
        zoom: false,
        zoomin: false,
        zoomout: false,
        pan: false,
        reset: false
      }
    },
    foreColor: '#1f2937' // gris foncé pour le mode clair
  },
  theme: {
    mode: 'light'
  },
  title: {
    text: 'Dans la classe (1 seul classe)',
    align: 'center',
    style: {
      fontSize: '18px',
      fontWeight: 'bold'
    }
  },
  labels: [],
  stroke: {
    width: 2
  },
  fill: {
    opacity: 0.2
  },
  colors: ['#3B82F6'],
  legend: {
    position: 'right',
    offsetY: 60,
    markers: {
      width: 10,
      height: 10
    },
    itemMargin: {
      vertical: 10
    }
  }
})

onMounted(async () => {
  const isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches

  chartOptions.value = {
    ...chartOptions.value,
    theme: {
      mode: isDark ? 'dark' : 'light'
    },
    chart: {
      ...chartOptions.value.chart,
      foreColor: isDark ? '#e5e7eb' : '#1f2937' // clair en dark mode
    }
  }

  try {
    const { data: response } = await api.get(`http://localhost:3000/student/dashboard/statisticsByclass/${auth.ID}`)
    const classStats = response.data

    const skillNames = classStats.map(item => item.skill_name)
    const skillValues = classStats.map(item => item.moyenne)

    chartOptions.value.labels = skillNames
    series.value = [{
      name: 'Classe',
      data: skillValues
    }]
  } catch (error) {
    console.error('❌ Erreur de chargement des données radar par classe :', error)
  }
})
</script>

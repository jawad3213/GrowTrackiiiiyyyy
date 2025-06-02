<template>
    <div class="rounded-xl border border-gray-200 p-6 bg-white shadow dark:border-gray-800 dark:bg-white/[0.03]">

      <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">
        Evaluation Sources Overtime</h3>
      <VueApexCharts
        type="bar"
        height="350"
        :options="chartOptions"
        :series="series"
      />
    </div>
  </template>
  
  <script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '@/services/api'
import VueApexCharts from 'vue3-apexcharts'
  
  // Données par catégorie (Auto, Co-Eval, Professors, Tutors)
  const series = ref([])

  onMounted(async () => {
  try {
    const res = await api.get('http://localhost:3000/api/DashAdmin/evaluation_source_overtime')
    const data = res.data.data

    series.value = [
      { name: 'Auto', data: data.map(row => row[0]) },
      { name: 'Co-Eval', data: data.map(row => row[1]) },
      { name: 'Tutors', data: data.map(row => row[2]) },
      { name: 'Professors', data: data.map(row => row[3]) },
    ]
  } catch (error) {
    console.error('Erreur API :', error)
  }
})
  
  // Options de configuration du graphique
  const chartOptions = {
  chart: {
    type: 'bar',
    stacked: true,
    toolbar: { show: false },
  },
  colors: ['#692CF3', '#A78BFA', '#FB923C', '#EA580C'],
  xaxis: {
    categories: ['Sep', 'Oct' ,'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    labels: { style: { fontSize: '13px' } },
  },
  yaxis: {
    labels: { style: { fontSize: '13px' } },
  },
  legend: {
    position: 'top',
    horizontalAlign: 'left',
    fontSize: '13px',
    markers: { radius: 6 },
  },
  dataLabels: { enabled: false },
  plotOptions: {
    bar: { borderRadius: 4, columnWidth: '50%' },
  },
  grid: { strokeDashArray: 4 },
  tooltip: { shared: true, intersect: false },
}
  </script>
  
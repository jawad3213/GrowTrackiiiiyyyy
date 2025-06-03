<template>
  <div class="bg-white border rounded-xl p-4 shadow">
    <h2 class="text-lg font-semibold mb-4">Number of Evaluation by role</h2>
    <apexchart height="350" type="bar" :options="chartOptions" :series="chartSeries" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import VueApexCharts from 'vue3-apexcharts'

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
    categories: [
        'Sep',
        'Oct',
        'Nov',
        'Dec',
        'Jan',
        'Feb',
        'Mar',
      ],
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
  const { data } = await axios.get('http://localhost:3001/EvaluationByRole')

  //const months = data.map(item => item.month)
  const professor = data.map(item => item.Professor)
  const supervisor = data.map(item => item.Supervisor)
  const peer = data.map(item => item.Peer)

  chartSeries.value = [
    { name: 'Professor', data: professor },
    { name: 'Supervisor', data: supervisor },
    { name: 'Peer', data: peer }
  ]

  //chartOptions.value.xaxis.categories = months
})
</script>

<template>
    <div class="rounded-xl border border-gray-200 p-6 bg-white shadow">
      <h3 class="text-lg font-semibold text-gray-800 mb-4">Evaluation Sources Overtime</h3>
      <VueApexCharts
        type="bar"
        height="350"
        :options="chartOptions"
        :series="series"
      />
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import VueApexCharts from 'vue3-apexcharts'
  
  // Données par catégorie (Auto, Co-Eval, Professors, Tutors)
  const series = ref([
    {
      name: 'Auto',
      data: [45, 55, 40, 70, 30, 42, 50, 40],
    },
    {
      name: 'Co-Eval',
      data: [20, 15, 20, 10, 25, 18, 16, 22],
    },
    {
      name: 'Tutors',
      data: [15, 25, 30, 10, 15, 24, 12, 20],
    },
    {
      name: 'Professors',
      data: [10, 10, 10, 10, 10, 10, 20, 20],
    },
  ])
  
  // Options de configuration du graphique
  const chartOptions = {
    chart: {
      type: 'bar',
      stacked: true,
      toolbar: {
        show: false,
      },
    },
    colors: ['#692CF3', '#A78BFA', '#FB923C', '#EA580C'], // Couleurs des barres
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
      labels: {
        style: {
          fontSize: '13px',
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          fontSize: '13px',
        },
      },
    },
    legend: {
      position: 'top',
      horizontalAlign: 'left',
      fontSize: '13px',
      markers: {
        radius: 6,
      },
    },
    dataLabels: {
      enabled: false,
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        columnWidth: '50%',
      },
    },
    grid: {
      strokeDashArray: 4,
    },
    tooltip: {
      shared: true,
      intersect: false,
    },
  }
  </script>
  
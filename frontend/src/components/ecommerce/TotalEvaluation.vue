<template>
    <div class="rounded-xl border border-gray-200 p-6 bg-white shadow mb-20">
      <!-- Header -->
      <div class="flex justify-between items-center mb-2">
        <h2 class="text-sm font-semibold text-gray-700">Total Evaluation</h2>
        <button
          class="bg-gray-100 text-gray-500 w-6 h-6 rounded-full flex items-center justify-center text-sm"
          aria-label="Info"
        >
          i
        </button>
      </div>
  
      <p class="text-sm text-gray-400 mb-4">Secondary text</p>
  
      <!-- Chart -->
      <apexchart
        type="bar"
        height="350"
        :options="chartOptions"
        :series="series"
      />
    </div>
  </template>
  
  <script setup>
  import ApexCharts from 'vue3-apexcharts'
  
  const series = [
    { name: 'By Peers', data: [10, 15, 30, 40, 55, 5] },
    { name: 'By professors', data: [20, 25, 50, 30, 35, 100] },
    { name: 'By supervisors', data: [25, 80, 85, 50, 20, 90] }
  ]
  
  const chartOptions = {
    chart: {
      type: 'bar',
      stacked: false,
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        columnWidth: '60%',
      },
    },
    dataLabels: { enabled: false },
    stroke: {
      width: 1,
      colors: ['#fff'],
    },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'Mai', 'Jun'],
    },
    legend: {
      position: 'bottom',
      markers: { radius: 10 },
    },
    colors: ['#1E40AF', '#9333EA', '#FB7185'], // blue, violet, pink
    grid: {
      borderColor: '#eee',
    },
  }
  </script>
  
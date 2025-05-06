<template>
    <div
      class="rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/[0.03]"
    >
      <div
        class="px-5 pt-5 bg-white shadow-default rounded-2xl pb-20 dark:bg-gray-900 sm:px-6 sm:pt-6"
      >
        <div class="flex justify-between">
          <div>
            <h3 class="text-lg font-semibold text-gray-800 dark:text-white/90">Evaluations Completed</h3>
            <p class="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
Percentage of evaluations already submitted by the professor            </p>
          </div>
          <div>
            <DropdownMenu :menu-items="menuItems">
              <template #icon>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M10.2441 6C10.2441 5.0335 11.0276 4.25 11.9941 4.25H12.0041C12.9706 4.25 13.7541 5.0335 13.7541 6C13.7541 6.9665 12.9706 7.75 12.0041 7.75H11.9941C11.0276 7.75 10.2441 6.9665 10.2441 6ZM10.2441 18C10.2441 17.0335 11.0276 16.25 11.9941 16.25H12.0041C12.9706 16.25 13.7541 17.0335 13.7541 18C13.7541 18.9665 12.9706 19.75 12.0041 19.75H11.9941C11.0276 19.75 10.2441 18.9665 10.2441 18ZM11.9941 10.25C11.0276 10.25 10.2441 11.0335 10.2441 12C10.2441 12.9665 11.0276 13.75 11.9941 13.75H12.0041C12.9706 13.75 13.7541 12.9665 13.7541 12C13.7541 11.0335 12.9706 10.25 12.0041 10.25H11.9941Z"
                    fill="currentColor"
                  />
                </svg>
              </template>
            </DropdownMenu>
          </div>
        </div>
        <div class="relative max-h-[195px]">
          <div id="chartTwo" class="h-full">
            <div class="radial-bar-chart">
              <VueApexCharts type="radialBar" height="330" :options="chartOptions" :series="series" />
            </div>
          </div>
          
        </div>
        
      </div>
      <div class="h-30 flex justify-center items-center bg-[#F7F8FA] dark:bg-[#1F2937] rounded-xl overflow-hidden text-center text-sm font-medium text-gray-700 dark:text-gray-300">
  <!-- Colonne 1 -->
  <div class="flex-1 px-6 py-5">
    <p class="text-gray-500 dark:text-gray-400 mb-1">Evaluation assigned</p>
    <p class="text-xl font-bold text-gray-900 dark:text-white">300</p>
  </div>

  <!-- Trait vertical -->
  <div class="w-px h-12 bg-gray-300 dark:bg-gray-600"></div>

  <!-- Colonne 2 -->
  <div class="flex-1 px-6 py-5">
    <p class="text-gray-500 dark:text-gray-400 mb-1">Evaluation Submitted</p>
    <p class="text-xl font-bold text-gray-900 dark:text-white">200</p>
  </div>
</div>


    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed } from 'vue'
  import DropdownMenu from '@/components/common/DropdownMenu.vue'
  const menuItems = [
    { label: 'View More', onClick: () => console.log('View More clicked') },
    { label: 'Delete', onClick: () => console.log('Delete clicked') },
  ]
  import VueApexCharts from 'vue3-apexcharts'
  
  const props = defineProps({
    value: {
      type: Number,
      default: 75.55,
    },
  })
  
  const series = computed(() => [props.value])  //responsible for showing 75.55%
  
  const chartOptions = {
    colors: ['#692CF3'],
    chart: {
      fontFamily: 'Outfit, sans-serif',
      sparkline: {
        enabled: true,
      },
    },
    plotOptions: {
      radialBar: {
        startAngle: -90,
        endAngle: 90,
        hollow: {
          size: '80%',
        },
        track: {
          background: '#E4E7EC',
          strokeWidth: '100%',
          margin: 5,
        },
        dataLabels: {
          name: {
            show: false,
          },
          value: {
            fontSize: '36px',
            fontWeight: '600',
            offsetY: 90,
            color: '#1D2939',
            formatter: function (val: number) {
              return val.toFixed(2) + '%'
            },
          },
        },
      },
    },
    fill: {
      type: 'solid',
      colors: ['#692CF3'],
    },
    stroke: {
      lineCap: 'round',
    },
    labels: ['Progress'],
  }
  </script>
  
  <style scoped>
  .radial-bar-chart {
    width: 100%;
    max-width: 330px;
    margin: 0 auto;
  }
  </style>
  
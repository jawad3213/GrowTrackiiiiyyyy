
    <template>
  <div class="w-full md:w-1/2 rounded-xl border border-gray-200 p-6 bg-white shadow">
    <!-- Header -->
    <div class="flex justify-between items-center mb-4">
      <h2 class="font-semibold text-gray-800 text-sm">User Distrubution by Role</h2>
      <button class="text-gray-400 hover:text-gray-600">
        <span>⋮</span>
      </button>
    </div>

    <!-- Donut Chart -->
    <apexchart
      width="100%"
      type="donut"
      :options="chartOptions"
      :series="series"
    ></apexchart>
  </div>
</template>

<script setup>
import VueApexCharts from 'vue3-apexcharts'

const series = [40, 35, 25] // Example: Students, Teachers, Tutor

const chartOptions = {
  chart: {
    type: 'donut',
    fontFamily: 'Outfit, sans-serif',
  },
  labels: ['Students', 'Teachers', 'Tutor'],
  colors: ['#2E36F2', '#6D8DFF', '#E4ECFF'], // custom colors
  legend: {
    position: 'bottom',
    labels: {
      colors: '#555',
      useSeriesColors: false,
    },
    markers: {
      radius: 12,
    }
  },
  stroke: {
    width: 0,
  },
  dataLabels: {
    enabled: false,
  },
  plotOptions: {
    pie: {
      donut: {
        size: '65%',
      }
    }
  },
  tooltip: {
    enabled: true,
  }
}
</script>

<style scoped>
/* Optional styling for the dots button (⋮) */
button {
  font-size: 1.2rem;
  background: transparent;
  border: none;
}
</style>

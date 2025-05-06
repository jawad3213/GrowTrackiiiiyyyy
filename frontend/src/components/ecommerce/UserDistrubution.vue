
    <template>
  <div class="w-full md:w-full rounded-xl border border-gray-200 p-6 bg-white shadow dark:border-gray-800 dark:bg-white/[0.03]">
    <!-- Header -->
    <div class="flex justify-between items-center mb-4">
      <h2 class="font-semibold text-gray-800 text-sm ">User Distrubution by Role</h2>
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
import { ref, onMounted } from 'vue'
import VueApexCharts from 'vue3-apexcharts'
import axios from 'axios'

const series = ref([])

onMounted(async () => {
  try {
    const { data } = await axios.get('http://localhost:3000/api/DashAdmin/user_distribution_by_role')
    series.value = [
      data.student || 0,
      data.Supervisor || 0,
      data.Professor || 0
    ]
  } catch (error) {
    console.error('Erreur lors de la récupération des données utilisateur par rôle :', error)
  }
})

const chartOptions = ref({
  chart: {
    type: 'donut',
    fontFamily: 'Outfit, sans-serif',
  },
  labels: ['Student', 'Supervisor', 'Professor'], // L'ordre doit correspondre à l'objet renvoyé
  colors: ['#2E36F2', '#6D8DFF', '#E4ECFF'],
  legend: {
    position: 'bottom',
    labels: {
      colors: '#555',
      useSeriesColors: false,
    },
    markers: {
      radius: 12,
    },
  },
  stroke: { width: 0 },
  dataLabels: { enabled: false },
  plotOptions: {
    pie: {
      donut: {
        size: '65%',
      },
    },
  },
  tooltip: {
    enabled: true,
  },
})
</script>

<style scoped>
/* Optional styling for the dots button (⋮) */
button {
  font-size: 1.2rem;
  background: transparent;
  border: none;
}
</style>

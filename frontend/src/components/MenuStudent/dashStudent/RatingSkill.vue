<template>
  <div class="border rounded-2xl p-6 bg-white">
    <h3 class="text-lg font-semibold mb-4">Evaluations per Skill</h3>

    <!-- Boutons dynamiques pour les compétences -->
    <div class="flex gap-2 flex-wrap mb-6">
      <button
        v-for="(skill, index) in skillNames"
        :key="index"
        @click="selectSkill(skill)"
        :class="[
          'px-4 py-1.5 rounded-md text-sm transition',
          selectedSkill === skill
            ? 'bg-white shadow text-gray-900'
            : 'bg-gray-100 text-gray-500 hover:text-gray-800'
        ]"
      >
        {{ skill }}
      </button>
    </div>

    <!-- Chart -->
    <VueApexCharts
      type="bar"
      height="250"
      :options="chartOptions"
      :series="series"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api'
import VueApexCharts from 'vue3-apexcharts'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()

const skillNames = ref([])
const selectedSkill = ref('')
const series = ref([])

const chartOptions = ref({
  chart: {
    type: 'bar',
    toolbar: { show: false }
  },
  plotOptions: {
    bar: {
      borderRadius: 4,
      horizontal: false,
      columnWidth: '40%'
    }
  },
  xaxis: {
    categories: [
      'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb',
      'Mar', 'Apr', 'May', 'Jun'
    ]
  },
  colors: ['#8b5cf6'],
  dataLabels: { enabled: false },
  legend: { show: false }
})

// Chargement initial
onMounted(async () => {
  try {
    const res = await api.get('http://localhost:3000/student/dashboard/skills')
    skillNames.value = res.data.data.map(s => s.skill_name)
    selectedSkill.value = skillNames.value[0]  // la compétence sélectionnée par défaut est la première dans le tableau.
    await updateChart()
  } catch (error) {
    console.error('Erreur chargement des skills:', error)
  }
})


const updateChart = async () => {
  try {
    const res = await api.get(`http://localhost:3000/student/dashboard/ratingskill/${auth.ID}?skill=${selectedSkill.value}`)
    const monthlyAverages = res.data.data.map(item => item.moyenne)

    series.value = [{
      name: selectedSkill.value,
      data: monthlyAverages
    }]
  } catch (error) {
    console.error('Erreur chargement des données de la skill:', error)
  }
}

//  Lors du clic sur un skill
const selectSkill = async (skill) => {
  selectedSkill.value = skill
  await updateChart()
}
</script>

<template>
  <div class="border rounded-2xl p-6 bg-white">
    <h3 class="text-lg font-semibold mb-4">Evaluations per Skill</h3>

    <!-- Skills dynamic buttons -->
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
import axios from 'axios'
import VueApexCharts from 'vue3-apexcharts'

const skillNames = ref([])
const selectedSkill = ref('')
const series = ref([])
const chartOptions = ref({
  chart: {
    type: 'bar',
    toolbar: { show: false },
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
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ]
  },
  colors: ['#8b5cf6'],
  dataLabels: { enabled: false },
  legend: { show: false }
})

// Load skill names and evaluations
onMounted(async () => {
  try {
    const res = await axios.get('http://localhost:3001/EvaluationBySkill')
    skillNames.value = res.data.map(s => s.skill)
    selectedSkill.value = skillNames.value[0]
    updateChart(res.data)
  } catch (error) {
    console.error('Erreur chargement skills:', error)
  }
})

const updateChart = async (data) => {
  const skillData = data.find(s => s.skill === selectedSkill.value)
  if (skillData) {
    series.value = [{
      name: selectedSkill.value,
      data: skillData.monthly
    }]
  }
}

const selectSkill = async (skill) => {
  selectedSkill.value = skill
  const res = await axios.get('http://localhost:3001/EvaluationBySkill')
  updateChart(res.data)
}
</script>

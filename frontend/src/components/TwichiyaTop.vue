<template>
  <div class="bg-white rounded-lg shadow p-6">
    <!-- Affiche l’ID du prof passé en prop (pour démo) -->

    <h2 class="text-xl font-semibold mb-1">Hall of Excellence</h2>
    <p class="text-gray-500 mb-4">Spotlighting Your Class’s Top Achievers</p>

    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Full name
            </th>
            <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Level
            </th>
            <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Classe
            </th>
            <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Average Score
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <!-- On boucle sur filteredStudents et on n'affiche pas ceux dont la moyenne est NaN -->
          <tr v-for="stu in filteredStudents" :key="stu.cne">
            <td class="px-4 py-2 flex items-center space-x-3">
              <img
                v-if="stu.profile_picture_url"
                :src="stu.profile_picture_url"
                alt="avatar"
                class="w-10 h-10 rounded-full object-cover"
              />
              <div
                v-else
                class="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-700"
              >
                {{ initials(stu.full_name) }}
              </div>
              <div class="flex flex-col">
                <span class="font-medium text-gray-900">{{ stu.full_name }}</span>
                <span class="text-xs text-gray-500">{{ stu.cne }}</span>
              </div>
            </td>
            <td class="px-4 py-2 text-gray-900">{{ stu.sector_id }}</td>
            <td class="px-4 py-2 text-gray-900">{{ stu.id_class }}</td>
            <td class="px-4 py-2 flex items-center">
              <span class="text-gray-900 mr-1">{{ stu.average }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '@/services/api'

const props = defineProps({
  idProf: {
    type: String,
    required: true
  }
})

const students = ref([])

// Computed qui filtre les étudiants dont la moyenne n'est pas NaN
const filteredStudents = computed(() =>
  students.value.filter(stu => !Number.isNaN(stu.average))
)

// Fonction pour extraire les initiales
function initials(name) {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
}

onMounted(async () => {
  try {
    // appel à l'API pour récupérer le classement
    const response = await api.get(
      '/prof/dashboard/classement/c3e78aec-53f6-4b16-8138-69bdf55b663a',
      { params: { id_prof: props.idProf } }
    )
    students.value = response.data.topByClass
  } catch (err) {
    console.error('Erreur chargement Hall of Excellence :', err)
  }
})
</script>

<style scoped>
/* Vos ajustements CSS ici si besoin */
</style>

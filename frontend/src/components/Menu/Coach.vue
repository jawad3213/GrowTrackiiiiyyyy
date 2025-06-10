<template>
  <admin-layout>
    <div class="flex min-h-screen bg-gray-50 dark:bg-white/[0.03] font-sans dark:border-gray-800">
      <!-- Main -->
      <main class="flex-1 flex flex-col">

        <!-- Barre de recherche + bouton Add -->
        <div
          class="flex items-center justify-between p-6 mb-4
                 bg-white dark:bg-gray-800
                 border border-gray-200 dark:border-gray-700
                 rounded-md shadow-sm"
        >
          <h1 class="text-2xl font-bold flex items-center space-x-2 text-gray-800 dark:text-gray-100">
            <span>Coachs</span>
            <span
              class="bg-purple-100 text-purple-600 text-sm font-semibold px-3 py-1 rounded-full
                     dark:bg-purple-200/10 dark:text-purple-300"
            >
              {{ coaches.length }} Coaches
            </span>
          </h1>

          <router-link to="/AddCoach">
            <button class="bg-[#F97316] hover:bg-[#FA9148] text-white font-bold py-2.5 px-10 rounded-md">
              + Add Coach
            </button>
          </router-link>
        </div>

        <!-- Loader -->
        <div v-if="isLoading" class="flex-1 flex justify-center items-center py-20">
          <div
            class="w-16 h-16 border-4 border-purple-600 border-t-transparent
                   rounded-full animate-spin"
            aria-label="Loading coaches..."
          ></div>
        </div>

        <!-- Tableau des coaches -->
        <div v-else-if="coaches.length > 0" class="p-6 overflow-x-auto">
          <table class="min-w-full bg-white dark:bg-gray-800 shadow text-gray-800 dark:text-gray-100">
            <thead class="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th class="py-3 px-4 text-left text-sm font-semibold">Full Name</th>
                <th class="py-3 px-4 text-left text-sm font-semibold">CIN</th>
                <th class="py-3 px-4 text-left text-sm font-semibold">Field</th>
                <th class="py-3 px-4 text-left text-sm font-semibold">Date Added</th>
                <th class="py-3 px-4 text-center text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="coach in coaches"
                :key="coach.cin"
                class="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <!-- Full Name with letter-avatar -->
                <td class="py-3 px-4">
                  <div class="flex items-center space-x-3">
                    <div
                      class="w-8 h-8 rounded-full flex items-center justify-center text-white border border-gray-200"
                      :style="{ backgroundColor: stringToColor(coach.full_name) }"
                    >
                      {{ coach.full_name.charAt(0).toUpperCase() }}
                    </div>
                    <span>{{ coach.full_name }}</span>
                  </div>
                </td>
                <td class="py-3 px-4">{{ coach.cin }}</td>
                <td class="py-3 px-4">{{ coach.field }}</td>
                <td class="py-3 px-4">
                  {{
                    new Date(coach.date_add).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })
                  }}
                </td>
                <!-- Actions -->
                <td class="py-3 px-4 flex justify-center space-x-4">
                  <!-- Modifier -->
                  <router-link
                    :to="`/AddCoach/${coach.id_member}`"
                    class="text-blue-500 hover:text-blue-700 transform hover:scale-110 transition-transform duration-150"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
                         viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round"
                            d="M15.232 5.232l3.536 3.536M4 17.25V21h3.75l11.064-11.064-3.75-3.75L4 17.25z"/>
                    </svg>
                  </router-link>
                  <!-- Supprimer -->
                  <router-link
                    :to="`/DeleteStudent/${coach.id_member}`"
                    class="text-red-500 hover:text-red-700 transform hover:scale-110 transition-transform duration-150"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" fill="#EA3323">
                      <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/>
                    </svg>
                  </router-link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pas de données -->
        <div
          v-else
          class="flex-1 flex flex-col items-center justify-center text-center text-gray-600 dark:text-gray-300 py-12"
        >
          <div class="text-5xl mb-4">🔍</div>
          <p class="text-lg font-semibold mb-2">No Coaches Found</p>
          <p class="mb-6">
            It looks like no coaches are registered yet.<br />
            Start by adding coaches to guide students through personalized soft skill development<br />
            and monitor their progress throughout the program.
          </p>
          <router-link to="/AddCoach">
            <button class="bg-[#F97316] hover:bg-[#FA9148] text-white font-bold py-3 px-20 rounded-md">
              + Add Coach
            </button>
          </router-link>
        </div>

      </main>
    </div>
  </admin-layout>
</template>

<script setup>
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { ref, onBeforeMount } from 'vue'
import api from '@/services/api'

const coaches = ref([])
const isLoading = ref(true)

const fetchCoaches = async () => {
  try {
    const res = await api.get('/admin/coachs')
    coaches.value = res.data.data
  } catch (error) {
    console.error('Erreur lors du chargement des coaches :', error)
    coaches.value = []
  } finally {
    isLoading.value = false
  }
}

onBeforeMount(fetchCoaches)

/**
 * Generate a reproducible HSL color from any string.
 */
const stringToColor = (str) => {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  const hue = Math.abs(hash) % 360
  return `hsl(${hue}, 50%, 60%)`
}
</script>
  
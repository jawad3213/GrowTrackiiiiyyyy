<template>
  <admin-layout>
    <div class="flex min-h-screen bg-gray-50 dark:bg-gray-900 font-sans">
      <!-- Main -->
      <main class="flex-1 flex flex-col">

        <!-- Barre de titre + bouton Add -->
        <div
          class="flex items-center justify-between p-6 mb-4
                 bg-white dark:bg-gray-800
                 border border-gray-200 dark:border-gray-700
                 rounded-md shadow-sm"
        >
          <h1 class="text-2xl font-bold flex items-center space-x-2 text-gray-800 dark:text-gray-100">
            <span>Professors</span>
            <span
              class="bg-purple-100 text-purple-600 text-sm font-semibold px-3 py-1 rounded-full
                     dark:bg-purple-200/10 dark:text-purple-300"
            >
              {{ profs.length }} professors
            </span>
          </h1>

          <router-link to="/AddProfessor">
            <button
              class="bg-[#F97316] hover:bg-[#FA9148] text-white font-bold
                     px-6 py-2 rounded-md
                     transform hover:scale-105 hover:shadow-lg
                     transition-transform duration-200"
            >
              + Add Professor
            </button>
          </router-link>
        </div>

        <!-- Loader -->
        <div v-if="isLoading" class="flex-1 flex justify-center items-center py-20">
          <div
            class="w-16 h-16 border-4 border-purple-600 border-t-transparent
                   rounded-full animate-spin"
            aria-label="Loading professors..."
          ></div>
        </div>

        <!-- Tableau des profs (une fois chargé) -->
        <div v-else-if="profs.length > 0" class="p-6 overflow-x-auto">
          <table
            class="min-w-full bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden"
          >
            <thead class="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th class="py-3 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">
                  Full Name
                </th>
                <th class="py-3 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">
                  CIN
                </th>
                <th class="py-3 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">
                  Email
                </th>
                <th class="py-3 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">
                  Field
                </th>
                <th class="py-3 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">
                  Registration Date
                </th>
                <th class="py-3 px-4 text-center text-sm font-semibold text-gray-600 dark:text-gray-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="prof in profs"
                :key="prof.cin"
                class="odd:bg-white even:bg-gray-50 dark:odd:bg-gray-800 dark:even:bg-gray-700
                       hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
              >
                <td class="py-3 px-4 text-gray-800 dark:text-gray-100">
                  {{ prof.full_name }}
                </td>
                <td class="py-3 px-4 text-gray-800 dark:text-gray-100">{{ prof.cin }}</td>
                <td class="py-3 px-4 text-gray-800 dark:text-gray-100">{{ prof.email }}</td>
                <td class="py-3 px-4 text-gray-800 dark:text-gray-100">{{ prof.id_class }}</td>
                <td class="py-3 px-4 text-gray-800 dark:text-gray-100">
                  {{
                    new Date(prof.date_add).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })
                  }}
                </td>
                <td class="py-3 px-4 flex justify-center space-x-4">
                  <router-link
                    :to="`/Deleteprof/${prof.id_member}`"
                    class="text-red-500 hover:text-red-700 transform hover:scale-110 transition-transform duration-150"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#EA3323"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
                  </router-link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pas de données (si la liste est vide et qu’on a terminé le chargement) -->
        <div
          v-else
          class="flex-1 flex flex-col items-center justify-center text-center
                 text-gray-600 dark:text-gray-300 py-12"
        >
          <div class="text-6xl mb-4">🔍</div>
          <p class="text-lg font-semibold mb-2">No professors available</p>
          <p class="mb-6">
            You haven’t added any professors to the platform yet.<br />
            Professors are essential for guiding evaluations and reviewing progress.
          </p>
          <router-link to="/AddProfessor">
            <button
              class="bg-[#F97316] hover:bg-[#FA9148] text-white font-bold py-3 px-8 rounded-md
                     transform hover:scale-105 hover:shadow-lg transition-transform duration-200"
            >
              + Add Professor
            </button>
          </router-link>
        </div>

        <!-- Facultatif : pagination, etc. -->
        
      </main>
    </div>
  </admin-layout>
</template>

<script setup>
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { ref, onMounted } from 'vue'
import api from '@/services/api'

const profs = ref([])
const isLoading = ref(true)

onMounted(async () => {
  try {
    const res = await api.get('/admin/professors')
    profs.value = res.data.data
  } catch (error) {
    console.error('Erreur lors du chargement des profs :', error)
    profs.value = [] // vide la liste en cas d’erreur
  } finally {
    isLoading.value = false
  }
})
</script>

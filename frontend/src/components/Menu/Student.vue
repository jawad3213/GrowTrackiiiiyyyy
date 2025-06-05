<template>
  <admin-layout>
    <div class="flex min-h-screen bg-gray-50 dark:bg-gray-900 font-sans">
      <main class="flex-1 flex flex-col">

        <!-- Titre + bouton Add -->
        <div
          class="flex items-center justify-between p-6 mb-4
                 bg-white dark:bg-gray-800
                 border border-gray-200 dark:border-gray-700
                 rounded-md shadow-sm"
        >
          <h1 class="text-2xl font-bold flex items-center space-x-2 text-gray-800 dark:text-gray-100">
            <span>Students</span>
            <span
              class="bg-purple-100 text-purple-600 text-sm font-semibold px-3 py-1 rounded-full
                     dark:bg-purple-200/10 dark:text-purple-300"
            >
              {{ students.length }} students
            </span>
          </h1>

          <router-link to="/AddStudent">
            <button
              class="bg-[#F97316] hover:bg-[#FA9148] text-white font-bold
                     px-6 py-2 rounded-md
                     transform hover:scale-105 hover:shadow-lg
                     transition-transform duration-200"
            >
              {{ students.length > 0 ? '+ Add Student' : '+ Crete Student' }}
            </button>
          </router-link>
        </div>

        <!-- Loader -->
        <div v-if="isLoading" class="flex-1 flex justify-center items-center py-20">
          <div
            class="w-16 h-16 border-4 border-purple-600 border-t-transparent
                   rounded-full animate-spin"
            aria-label="Loading students..."
          ></div>
        </div>

        <!-- Tableau des étudiants (une fois chargé) -->
        <div v-else-if="students.length > 0" class="p-6 overflow-x-auto">
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
                  Email Address
                </th>
                <th class="py-3 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">
                  Field
                </th>
                <th class="py-3 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">
                  Registration Date
                </th>
                <th class="py-3 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">
                  Group
                </th>
                <th class="py-3 px-4 text-center text-sm font-semibold text-gray-600 dark:text-gray-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="student in students"
                :key="student.cin"
                class="odd:bg-white even:bg-gray-50
                       dark:odd:bg-gray-800 dark:even:bg-gray-700
                       hover:bg-gray-50 dark:hover:bg-gray-700
                       transition-colors duration-150"
              >
                <td class="py-3 px-4 text-gray-800 dark:text-gray-100">
                  {{ student.full_name }}
                </td>
                <td class="py-3 px-4 text-gray-800 dark:text-gray-100">
                  {{ student.cin }}
                </td>
                <td class="py-3 px-4 text-gray-800 dark:text-gray-100">
                  {{ student.email }}
                </td>
                <td class="py-3 px-4 text-gray-800 dark:text-gray-100">
                  {{ student.id_class }}
                </td>
                <td class="py-3 px-4 text-gray-800 dark:text-gray-100">
                  {{
                    new Date(student.date_add).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })
                  }}
                </td>
                <td class="py-3 px-4 text-gray-800 dark:text-gray-100">
                  {{ student.id_sector }}
                </td>
                <td class="py-3 px-4 flex justify-center space-x-4">
                  <!-- Lien d’édition (icône) -->
                  <router-link
                    :to="`/AddStudent/${student.cin}`"
                    class="text-blue-500 hover:text-blue-700 transform hover:scale-110 transition-transform duration-150"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg"
                         height="24px" viewBox="0 -960 960 960"
                         width="24px" fill="currentColor">
                      <path
                        d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"
                      />
                    </svg>
                  </router-link>
                  <!-- Lien de suppression (icône) -->
                  <router-link
                    :to="`/DeleteStudent/${student.id_member}`"
                    class="text-red-500 hover:text-red-700 transform hover:scale-110 transition-transform duration-150"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg"
                         height="24px" viewBox="0 -960 960 960"
                         width="24px" fill="currentColor">
                      <path
                        d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"
                      />
                    </svg>
                  </router-link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Si pas d’étudiants -->
        <div
          v-else
          class="flex-1 flex flex-col items-center justify-center text-center
                 text-gray-600 dark:text-gray-300 py-12"
        >
          <div class="text-6xl mb-4">🔍</div>
          <p class="text-lg font-semibold mb-2">No student defined</p>
          <p class="mb-6">You haven’t set up any student yet.</p>
          <router-link to="/AddStudent">
            <button
              class="bg-[#F97316] hover:bg-[#FA9148] text-white font-bold
                     py-3 px-8 rounded-md
                     transform hover:scale-105 hover:shadow-lg
                     transition-transform duration-200"
            >
              + Add a student
            </button>
          </router-link>
        </div>
        
      </main>
    </div>
  </admin-layout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import api from '@/services/api'

const students = ref([])
const isLoading = ref(true)

onMounted(async () => {
  try {
    const res = await api.get('/admin/students')
    students.value = res.data.data
  } catch (err) {
    console.error('Erreur lors du chargement des étudiants :', err)
    students.value = [] // vide la liste en cas d’erreur
  } finally {
    isLoading.value = false
  }
})
</script>

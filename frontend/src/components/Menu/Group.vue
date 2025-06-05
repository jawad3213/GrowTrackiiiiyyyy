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
            <span>Fields</span>
            <span
              class="bg-purple-100 text-purple-600 text-sm font-semibold px-3 py-1 rounded-full
                     dark:bg-purple-200/10 dark:text-purple-300"
            >
              {{ groups.length }} Fields
            </span>
          </h1>
               <router-link to="/AddField">
            <button class="bg-[#F97316] hover:bg-[#FA9148] text-white font-bold py-2.5 px-9 rounded-md">
              + Add Group/Field
            </button>
          </router-link>
          
        </div>

        <!-- Loader (affiché tant que isLoading = true) -->
        <div v-if="isLoading" class="flex-1 flex justify-center items-center py-20">
          <div
            class="w-16 h-16 border-4 border-purple-600 border-t-transparent
                   rounded-full animate-spin"
            aria-label="Loading fields..."
          ></div>
        </div>

        <!-- Affichage des groups/fields lorsque la requête est terminée -->
        <div v-else-if="groups.length > 0" class="p-6 overflow-x-auto">
          <table class="min-w-full bg-white dark:bg-gray-800 shadow text-gray-800 dark:text-gray-100">
            <thead class="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th class="py-3 px-4 text-left text-sm font-semibold">Field Name</th>
                <th class="py-3 px-4 text-left text-sm font-semibold">Description</th>
                <th class="py-3 px-4 text-center text-sm font-semibold">Number of classes</th>
                <th class="py-3 px-4 text-center text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="group in groups"
                :key="group.field"
                class="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <td class="py-3 px-4">{{ group.field }}</td>
                <td class="py-3 px-4">{{ group.description }}</td>
                <td class="py-3 px-4 text-center">{{ group['number of classes'] }}</td>
                <td class="py-3 px-4 flex justify-center space-x-4">
                  <!-- Icône Modifier -->
                  <router-link
                    :to="`/AddField/${group.field}`"
                    @click="FormStore.SelectedObj = group"
                    class="text-blue-500 hover:text-blue-700 transform hover:scale-110 transition-transform duration-150"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M15.232 5.232l3.536 3.536M4 17.25V21h3.75l11.064-11.064-3.75-3.75L4 17.25z"
                      />
                    </svg>
                  </router-link>

                  <!-- Icône Supprimer -->
                  <router-link
                    :to="`/DeleteField/${group.field}`"
                    class="text-red-500 hover:text-red-700 transform hover:scale-110 transition-transform duration-150"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="24px"
                      viewBox="0 -960 960 960"
                      width="24px"
                      fill="#EA3323"
                    >
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

        <!-- Pas de données (quand isLoading = false et groups.length = 0) -->
        <div
          v-else
          class="flex-1 flex flex-col items-center justify-center text-center text-gray-600 dark:text-gray-300 py-12"
        >
          <div class="text-5xl mb-4"></div>
          <p class="text-lg font-semibold mb-2">No groups or fields configured</p>
          <p class="mb-6">
            Set up fields or academic tracks to better segment your platform.
          </p>
          <router-link to="/AddField">
            <button class="bg-[#F97316] hover:bg-[#FA9148] text-white font-bold py-3 px-20 rounded-md">
              + Add Group/Field
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
import { useFormStore } from '@/stores/form'
import api from '@/services/api'

const groups = ref([])
const isLoading = ref(true)
const FormStore = useFormStore()

const fetchGroup = async () => {
  try {
    const res = await api.get('/admin/class')
    groups.value = res.data.data
  } catch (err) {
    console.error('Something went wrong while trying to fetch the Groups!', err)
    groups.value = []
  } finally {
    isLoading.value = false
  }
}

onBeforeMount(async () => {
  await fetchGroup()
})
</script>

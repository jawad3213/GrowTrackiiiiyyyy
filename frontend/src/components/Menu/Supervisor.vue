<template>
  <admin-layout>
    <div class="flex min-h-screen mt-1 bg-gray-50 dark:bg-white/[0.03] font-sans dark:border-gray-800">
      
      <!-- Main -->
      <main class="flex-1 flex flex-col">

        <!-- Barre de recherche -->
        <div class="flex items-center justify-between p-6 border border-gray-300 dark:border-gray-700 rounded-md">
          <div class="flex items-center border border-gray-300 dark:border-gray-700 rounded-md px-4 py-2 w-full max-w-md">
            <input
              type="text"
              placeholder="Search"
              class="w-full outline-none text-gray-700 dark:text-white dark:bg-transparent"
            />
            <button class="ml-2 text-purple-500 dark:text-purple-300">🔍</button>
          </div>
          <button
            class="ml-4 flex items-center border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 text-gray-700 dark:text-white">
            Filters
          </button>
        </div>
<!-- Table -->
        <div v-if="sups.length > 0" class="p-6 overflow-x-auto">
          <table class="min-w-full bg-white dark:bg-gray-800 shadow text-gray-800 dark:text-gray-100">
            <thead class="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th class="py-3 px-4 text-left text-sm font-semibold">Full Name</th>
                <th class="py-3 px-4 text-left text-sm font-semibold">Regestration Number</th>
                <th class="py-3 px-4 text-left text-sm font-semibold">Email</th>
                <th class="py-3 px-4 text-left text-sm font-semibold">Company</th>
                <th class="py-3 px-4 text-left text-sm font-semibold">Position</th>
                <th class="py-3 px-4 text-left text-sm font-semibold">Registration Date</th>
                <th class="py-3 px-4 text-center text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="sup in Allsups"
                :key="sup.cin"
                class="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <td class="py-3 px-4">{{ sup.full_name }}</td>
                <td class="py-3 px-4">{{ sup.registration_number }}</td>
                <td class="py-3 px-4">{{ sup.email }}</td>
                <td class="py-3 px-4">{{ sup.company }} </td>
                <td class="py-3 px-4">{{ sup.position }} </td>
                <td class="py-3 px-4">{{new Date(sup.date_add).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric'  })}}</td>
          
                <td class="py-3 px-4 flex justify-center space-x-2">
                <router-link :to="`/DeleteSupervisor/${sup.id_member}`" class="text-red-500 hover:text-red-700">🗑️</router-link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- No Data -->
        <div v-else class="flex-1 flex flex-col items-center justify-center text-center text-gray-600 dark:text-gray-300 py-12">
          <div class="text-5xl mb-4">🔍</div>
          <p class="text-lg font-semibold mb-2">No supervisors found</p>
          <p class="mb-6">
            No internship or external supervisors have been added.<br />
            Add supervisors to allow them to evaluate students during real-world experiences.
          </p>
          <router-link to="/AddSupervisor">
            <button class="bg-[#F97316] hover:bg-[#FA9148] text-white font-bold py-3 px-20 rounded-md">
              + Add Supervisor
            </button>
          </router-link>
        </div>

        <!-- Pagination -->
        <div class="flex items-center justify-between p-4 text-gray-600 dark:text-gray-300">
          <span>Page 1 of 10</span>
          <div class="flex items-center space-x-2">
            <button class="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md">Previous</button>
            <button class="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md">Next</button>
          </div>
        </div>

      </main>
    </div>
  </admin-layout>
</template>

<script setup>
import {ref, computed, onMounted} from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import api from '@/services/api'
import { useRouter } from 'vue-router'

const router = useRouter()

const sups = ref([{}])


const Allsups = computed(() => {
  const all = sups.value
  return all
 })

 


function navigate(link) {
  if (link.path) {
    router.push(link.path)
  }
}

onMounted(async() => {
  try{
  const res = await api.get('/admin/supervisors')
  sups.value = res.data.data;
  }catch(error){
  console.error('Erreur lors du chargement des profs :', error)
  }
  })
</script>

<template>
  <admin-layout>
    <div class="flex min-h-screen bg-gray-50 dark:bg-white/[0.03] font-sans dark:border-gray-800">

      <!-- Main -->
      <main class="flex-1 flex flex-col">

        <!-- Search -->
        <div class="flex items-center justify-between p-6 border border-gray-300 dark:border-gray-700 rounded-md">
          
          <router-link to="/AddCoach">
            <button class="bg-[#F97316] hover:bg-[#FA9148] text-white font-bold py-2.5 px-10 rounded-md">
              + Add Coach
            </button>
          </router-link>
          
        </div>
        <!-- Table -->
        <div v-if="coaches.length > 0" class="p-6 overflow-x-auto">
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
                v-for="coache in AllCoaches"
                :key="coache.cin"
                class="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <td class="py-3 px-4">{{ coache.full_name }}</td>
                <td class="py-3 px-4">{{ coache.cin }}</td>
                <td class="py-3 px-4">{{ coache.field }} </td>
                <td class="py-3 px-4">{{ new Date(coache.date_add).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric'  })}}</td>
                <td class="py-3 px-4 flex justify-center space-x-2">
                  <router-link :to="`/AddStudent/${coache.cin}`" class="text-blue-500 hover:text-blue-700">✏️</router-link>
                  <router-link :to="`/DeleteStudent/${coache.cin}`" class="text-red-500 hover:text-red-700">🗑️</router-link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- No Data -->
        <div v-if="coaches.length == 0" class="flex-1 flex flex-col items-center justify-center text-center text-gray-600 dark:text-gray-300 py-12">
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

        <!-- Pagination -->
        
      </main>
    </div>
  </admin-layout>
</template>

<script setup>
import AdminLayout from '../layout/AdminLayout.vue'
import { ref, onMounted, computed, onBeforeMount } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'

const coaches = ref([{}])

const router = useRouter()

const AllCoaches = computed(() => {
  const all = coaches.value
  return all
 })

function navigate(link) {
  if (link.path) {
    router.push(link.path)
  }
}
onBeforeMount(async() => {
  try {
  const res = await api.get('/admin/coachs')
  coaches.value = res.data.data
  } catch (error) {
    console.error('Erreur lors du chargement des coaches :', error)
  }
})
</script>
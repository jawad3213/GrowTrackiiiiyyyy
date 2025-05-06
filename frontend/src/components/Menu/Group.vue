<template>
  <admin-layout>
    <div class="flex min-h-screen bg-gray-50 dark:bg-white/[0.03] font-sans dark:border-gray-800">
      
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

        <!-- No Data -->
        <div class="flex-1 flex flex-col items-center justify-center text-center text-gray-600 dark:text-gray-300 py-12">
          <div class="text-5xl mb-4">🔍</div>
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
import AdminLayout from '../layout/AdminLayout.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

function navigate(link) {
  if (link.path) {
    router.push(link.path)
  }
}
</script>

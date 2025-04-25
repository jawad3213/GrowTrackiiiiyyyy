<template>
    <admin-layout>

    <div class="flex min-h-screen bg-gray-50 font-sans">
      
      
  
      <!-- Main -->
      <main class="flex-1 flex flex-col">
  
      
  
        <!-- Search -->
        <div class="flex items-center justify-between p-6 border border-gray-300 rounded-md">
  <div class="flex items-center border border-gray-300 rounded-md px-4 py-2 w-96 ml-230 max-w-md">
    <input type="text" placeholder="Search" class="w-full outline-none text-gray-700" />
    <button class="ml-2 text-purple-500">🔍</button>
  </div>
  <button class="ml-4 flex items-center border border-gray-300 rounded-lg px-4 py-2 text-gray-700">
    Filters
  </button>
</div>

  
        <!-- No Data -->
        <div class="flex-1 flex flex-col items-center justify-center text-center text-gray-600">
          <div class="text-5xl mb-4">🔍</div>
          <p class="text-lg font-semibold mb-2">No skills defined</p>
          <p class="mb-6">You haven’t set up any soft skills yet.<br />Create skills and indicators to build your custom evaluation framework.</p>
          <button class="bg-[#F97316] hover:bg-[#FA9148] text-white font-bold py-3 px-20 rounded-md">
            + Add Skill
          </button>
        </div>
  
        <!-- Pagination -->
        <div class="flex items-center justify-between p-4 text-gray-600">
          <span>Page 1 of 10</span>
          <div class="flex items-center space-x-2">
            <button class="px-4 py-2 border border-gray-300 rounded-md">Previous</button>
            <button class="px-4 py-2 border border-gray-300 rounded-md">Next</button>
          </div>
        </div>
  
      </main>
    </div>
  </admin-layout>


  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  import AdminLayout from '@/components/layout/AdminLayout.vue';

  
  import { useRouter } from 'vue-router';
  
  const router = useRouter();
  
  function navigate(link) {
    if (link.path) {
      router.push(link.path);
    }
  }
  
  </script>
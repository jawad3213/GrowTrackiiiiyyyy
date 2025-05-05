<template>
  <admin-layout>
    <div class="relative min-h-screen bg-gray-50 font-sans">

      <!-- CONTENU FLOU SI LA MODALE EST OUVERTE -->
      <div :class="showForm ? 'blur-sm pointer-events-none' : ''">

        <!-- Zone de recherche -->
        <div class="flex items-center justify-between p-6 border border-gray-300 rounded-md">
          <div class="flex items-center border border-gray-300 rounded-md px-4 py-2 w-96 max-w-md">
            <input type="text" placeholder="Search" class="w-full outline-none text-gray-700" />
            <button class="ml-2 text-purple-500">🔍</button>
          </div>
          <button class="ml-4 flex items-center border border-gray-300 rounded-lg px-4 py-2 text-gray-700">
            Filters
          </button>
        </div>

        <!-- Aucune donnée -->
        <div class="flex flex-col items-center justify-center text-center text-gray-600 py-20">
          <div class="text-5xl mb-4">🔍</div>
          <p class="text-lg font-semibold mb-2">No Coaches Found</p>
          <p class="mb-6">
            It looks like no coaches are registered yet.<br />
            Start by adding coaches to guide students through personalized soft skill development and monitor <br />
            their progress throughout the program.
          </p>
          <button
            @click="showForm = true"
            class="bg-[#F97316] hover:bg-[#FA9148] text-white font-bold py-3 px-20 rounded-md"
          >
            + Add Coach
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
      </div>

      <!-- OVERLAY SOMBRE DERRIÈRE LA MODALE -->
      <div v-if="showForm" class="fixed inset-0 bg-black bg-opacity-40 z-40"></div>

      <!-- MODALE -->
      <AddCoach
        v-if="showForm"
        @fermer="showForm = false"
        class="fixed inset-0 z-50 flex items-center justify-center"
      />
    </div>
  </admin-layout>
</template>
  
  <script setup>
  import AdminLayout from '../layout/AdminLayout.vue';
  import AddCoach from '../AddCoach.vue';
  import {ref} from 'vue';
  import { useRouter } from 'vue-router';
  
  const router = useRouter();
  const showForm = ref(false)
  
  function navigate(link) {
    if (link.path) {
      router.push(link.path);
    }
  }
  
  </script>
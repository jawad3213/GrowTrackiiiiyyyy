<template>
  <admin-layout>
    <div class="relative min-h-screen mt-1 bg-gray-50 font-sans dark:border-gray-800 dark:bg-white/[0.03]">
      
      <!-- Contenu flouté si la modale est affichée -->
      <div :class="showForm ? 'blur-sm pointer-events-none' : ''">
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
        <div class="flex-1 flex flex-col items-center justify-center text-center text-gray-600 mt-20">
          <div class="text-5xl mb-4">🔍</div>
          <p class="text-lg font-semibold mb-2">No supervisors found</p>
          <p class="mb-6">
            No internship or external supervisors have been added.<br />
            Add supervisors to allow them to evaluate students during real-world experiences.
          </p>

          <button
            @click="showForm = true"
            class="bg-[#F97316] hover:bg-[#FA9148] text-white font-bold py-3 px-20 rounded-md"
          >
            + Add Supervisor
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

      <!-- Overlay sombre derrière la modale -->
      <div v-if="showForm" class="fixed inset-0 bg-black bg-opacity-40 z-40"></div>

      <!-- Modal centrée -->
      <AddSupervisorModal
        v-if="showForm"
        @fermer="showForm = false"
        class="fixed inset-0 z-50 flex items-center justify-center"
      />
    </div>
  </admin-layout>
</template>
  
  <script setup>
 
  import AdminLayout from '@/components/layout/AdminLayout.vue';
  import { useRouter } from 'vue-router';
import AddSupervisorModal from '../AddSupervisorModal.vue';
import {ref} from 'vue';
  const router = useRouter();
  const showForm = ref(false)
  function navigate(link) {
    if (link.path) {
      router.push(link.path);
    }
  }
  
  </script>
  
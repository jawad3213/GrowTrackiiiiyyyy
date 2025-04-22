<template>
    <div class="flex min-h-screen bg-gray-50 font-sans">
      
      <!-- Sidebar -->
      <aside class="w-[700px] bg-white shadow-md flex flex-col">
        <img src="@/assets/logo.png" alt="logo" class=" mt-7 mb-10 w-62 h-13" />
                  <nav class="flex-1 space-y-2 px-4">
                <div
                  v-for="link in sidebarLinks"
                  :key="link.label"
                  @click="navigate(link)"
                  :class="[
                    'flex items-center py-2 px-3  rounded-md cursor-pointer transition-all group', 
                    link.field
                      ? 'border border-gray-300 bg-white text-black hover:bg-[#8B5CF6] hover:text-white'
                      : link.filled
                        ? 'border border-gray-300 bg-white text-black hover:bg-[#AD8CF9] hover:text-white'
                        : 'border border-gray-300 bg-white text-gray-700 hover:bg-purple-50',
                    link.sub ? 'ml-10' : 'font-semibold'
                  ]"
                >
                  <span v-if="link.icon" class="mr-2 text-lg group-hover:text-white">{{ link.icon }}</span>
                  <span class="group-hover:text-white">{{ link.label }}</span>
                  <span v-if="link.hasDropdown" class="ml-auto text-xs group-hover:text-white">▼</span>
              </div>


          </nav>
      </aside>
  
      <!-- Main -->
      <main class="flex-1 flex flex-col">
  
        <!-- Navbar -->
        <header class="flex items-center justify-between p-4 bg-white shadow">
          <div></div>
          <div class="flex items-center space-x-4">
            <button class="text-gray-500 hover:text-gray-700">🌙</button>
            <button class="text-gray-500 hover:text-gray-700">🔔</button>
            <img src="@/assets/me.png" alt="Profile" class="w-10 h-10 rounded-full" />
            <span class="font-semibold">Soukaina</span>
          </div>
        </header>
  
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
          <p class="text-lg font-semibold mb-2">No departments listed</p>
          <p class="mb-6">Your institution has no departments configured.<br />Add academic departments to group users and evaluations by field.</p>
          <button class="bg-[#F97316] hover:bg-[#FA9148] text-white font-bold py-3 px-20 rounded-md">
            + Add departement
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
  </template>
  
  <script setup>
import { ref } from 'vue';

const sidebarLinks = ref([
  { label: 'Dashboard', icon: '📊', field: true , filled: false },
  { label: 'User Management', icon: '👥', filled: false },
  { label: 'Students', filled: true, sub: true , path: '/Group'  },
  { label: 'Professors', filled: true, sub: true , path: '/Professor'},
  { label: 'Supervisors', filled: true, sub: true , path: '/Supervisor' },
  { label: 'Skills', icon: '✨', filled: false , path: '/Skills' },
  { label: 'Evaluations', icon: '📄', filled: false, hasDropdown: true },
  { label: 'Global Overview', filled: true, sub: true },
  { label: 'Signals', filled: true, sub: true },
  { label: 'Institution Settings', icon: '🏛️', filled: false },
  { label: 'Fields and Groups', filled: true, sub: true , path: '/Group' },
  { label: 'Departements', filled: true, sub: true , path: '/Departement'},
]);

import { useRouter } from 'vue-router';

const router = useRouter();

function navigate(link) {
  if (link.path) {
    router.push(link.path);
  }
}

</script>


  
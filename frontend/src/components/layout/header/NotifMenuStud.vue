<template>
  <div class="relative" ref="dropdownRef">
    <!-- Cloche -->
    <button
      class="relative flex items-center justify-center text-gray-500 transition-colors bg-white border border-gray-200 rounded-full hover:text-dark-900 h-11 w-11 hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
      @click="toggleDropdown"
    >
      <!-- Badge -->
      <span
        :class="{ hidden: !hasUnread, flex: hasUnread }"
        class="absolute right-0 top-0.5 z-1 h-2 w-2 rounded-full bg-orange-400"
      >
        <span
          class="absolute inline-flex w-full h-full bg-orange-400 rounded-full opacity-75 -z-1 animate-ping"
        ></span>
      </span>
      <!-- Icône cloche -->
      <svg class="fill-current" width="20" height="20" viewBox="0 0 20 20" fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd"
          d="M10.75 2.29248C10.75 1.87827 10.4143 1.54248 10 1.54248C9.58583 1.54248 9.25004 1.87827 9.25004 2.29248V2.83613C6.08266 3.20733 3.62504 5.9004 3.62504 9.16748V14.4591H3.33337C2.91916 14.4591 2.58337 14.7949 2.58337 15.2091C2.58337 15.6234 2.91916 15.9591 3.33337 15.9591H4.37504H15.625H16.6667C17.0809 15.9591 17.4167 15.6234 17.4167 15.2091C17.4167 14.7949 17.0809 14.4591 16.6667 14.4591H16.375V9.16748C16.375 5.9004 13.9174 3.20733 10.75 2.83613V2.29248ZM14.875 14.4591V9.16748C14.875 6.47509 12.6924 4.29248 10 4.29248C7.30765 4.29248 5.12504 6.47509 5.12504 9.16748V14.4591H14.875ZM8.00004 17.7085C8.00004 18.1228 8.33583 18.4585 8.75004 18.4585H11.25C11.6643 18.4585 12 18.1228 12 17.7085C12 17.2943 11.6643 16.9585 11.25 16.9585H8.75004C8.33583 16.9585 8.00004 17.2943 8.00004 17.7085Z"
          fill="" />
      </svg>
    </button>

    <!-- Dropdown -->
    <div v-if="dropdownOpen"
      class="absolute right-0 mt-3 w-[360px] max-h-[500px] overflow-y-auto z-50 rounded-2xl border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-800 dark:bg-gray-900">
      <!-- Header -->
      <div class="flex justify-between items-center mb-3 border-b pb-2 border-gray-100 dark:border-gray-800">
        <h5 class="text-lg font-semibold text-gray-800 dark:text-white/90">Notifications</h5>
        <button @click="closeDropdown" class="text-gray-500 dark:text-gray-400 text-xl">&times;</button>
      </div>

      <!-- Liste des notifications -->
      <ul class="space-y-3">
        <li v-for="notif in notifications" :key="notif.id" @click="goToNotifPage(notif)" class="cursor-pointer">
          <div
            class="flex gap-3 items-start rounded-lg border-b border-gray-100 pb-2 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-white/5 px-2">
            
            <!-- Icône colorée -->
            <div class="w-10 h-10 flex items-center justify-center rounded-full text-white shrink-0"
              :class="{
                'bg-yellow-500': notif.type === 'signal',
                'bg-green-500': notif.type === 'approved',
                'bg-red-500': notif.type === 'rejected'
              }">
              <svg v-if="notif.type === 'signal'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
                viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M12 9v2m0 4h.01m-.01-6V7m0 8h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <svg v-else-if="notif.type === 'approved'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
                viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <svg v-else-if="notif.type === 'rejected'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
                viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>

            <!-- Texte -->
            <div class="flex-1 min-w-0">
              <p class="text-sm text-gray-800 dark:text-white font-medium">
                {{ notif.message }}
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Class: {{ notif.classe }} • {{ notif.time }}
              </p>
            </div>
          </div>
        </li>
      </ul>

      <!-- Voir tout -->
      <router-link to="/StudNotif"
        class="mt-4 block text-center rounded-lg border border-gray-300 bg-white py-2 text-sm font-medium text-gray-700 shadow hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-white/[0.03] dark:hover:text-white"
        @click="closeDropdown">
        View All Notifications
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const dropdownRef = ref(null)
const dropdownOpen = ref(false)
const notifications = ref([])
const router = useRouter()

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value
}

const closeDropdown = () => {
  dropdownOpen.value = false
}

const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    closeDropdown()
  }
}

const goToNotifPage = (notif) => {
  router.push({ name: 'ProfNotif', query: { focus: notif.id } })
  closeDropdown()
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  fetchNotifications()
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

const fetchNotifications = async () => {
  try {
    //const res = await axios.get('http://localhost:3001/profNotifications')
    //notifications.value = res.data
  } catch (err) { 
    console.error('Erreur lors du chargement des notifications :', err)
  }
}

const hasUnread = computed(() =>
  notifications.value.some((n) => n.status === 'unread')
)
</script>

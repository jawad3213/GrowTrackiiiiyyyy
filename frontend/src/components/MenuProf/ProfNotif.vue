<template>
    <ProfLayout>
  <div class="p-6 bg-gray-50 min-h-screen dark:bg-[#121212]">
    <!-- Titre -->
    <h1 class="text-2xl font-bold text-gray-800 dark:text-white mb-6">My Notifications</h1>

    <!-- Tabs -->
    <div class="flex gap-4 mb-6 text-sm font-semibold">
      <button
        @click="selectedTab = 'opened'"
        :class="selectedTab === 'opened' ? activeTabClass : inactiveTabClass"
      >
        Opened
      </button>
      <button
        @click="selectedTab = 'unread'"
        :class="selectedTab === 'unread' ? activeTabClass : inactiveTabClass"
      >
        Unread
      </button>
    </div>
 <p v-if="errorMsg" class="text-red-500 text-xs mt-1">{{ errorMsg }}</p>
 <p v-if="loading" class="text-gray-500 text-xs mt-1">Loading ...</p>
    <!-- Liste des notifications -->
    <div class="space-y-4">
      <div
  v-for="notif in filteredNotifications"
  :key="notif.id"
  class="bg-white dark:bg-gray-900 border-l-4 shadow-md px-4 py-3 flex gap-4 items-start rounded-md"
  :class="borderClass(notif.type)"
>
<!-- Conteneur notification horizontal -->
<div class="flex items-center justify-between gap-4 w-full">
  <!-- Icône -->
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
  <div class="flex-1 ml-2">
    <p class="font-medium text-gray-800 dark:text-white">
      {{ notif.message }}
    </p>
    <p class="text-sm text-gray-500 dark:text-gray-300">
      Class: {{ notif.classe }} – Reported by: {{ notif.reportedBy }}
    </p>
  </div>

  <!-- Bouton à droite -->
  <button
    @click="goToReason(notif)"
    class="text-purple-600 hover:underline text-sm font-medium whitespace-nowrap ml-4"
  >
    See More →
  </button>
</div>

</div>

      </div>
    </div>

    <!-- Modal -->
    <div v-if="selectedNotif" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-end z-50">
      <div class="w-full max-w-md bg-white dark:bg-gray-800 p-6 shadow-lg h-full overflow-y-auto">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-bold text-gray-800 dark:text-white">
            {{ modalTitle(selectedNotif.type) }}
          </h2>
          <button @click="selectedNotif = null" class="text-gray-500 text-xl">&times;</button>
        </div>
        <textarea
          class="w-full h-48 p-4 border rounded-md bg-gray-50 dark:bg-gray-700 dark:text-white resize-none"
          readonly
        >{{ selectedNotif.reason }}</textarea>
        <button
          @click="selectedNotif = null"
          class="w-full mt-6 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-md font-semibold"
        >
          Back
        </button>
      </div>
    </div>

</ProfLayout>
</template>
<script setup>
import axios from 'axios';
import {ref, onMounted, computed} from 'vue'
import { useRouter, useRoute } from 'vue-router'
import ProfLayout from '../layout/ProfLayout.vue';

const router = useRouter()

const goToReason = (notif) => {
 if(notif.type === 'approved') router.push({  
      name: 'SolutionSignal',
      query: {
      id: notif.id,
    }})
  else{
  router.push({
    name: 'Reason',
    query: {
      id: notif.id,
      type: notif.type // signal / rejected 
    }
  })}
}


const selectedTab = ref('opened') // ou 'unread'

const notifications = ref([]) // Tu les chargeras via axios depuis l’API

const selectedNotif = ref(null) // Pour afficher la modale

const filteredNotifications = computed(() =>
  notifications.value.filter((n) =>
    selectedTab.value === 'opened' ? n.status === 'opened' : n.status === 'unread'
  )
)

const openModal = (notif) => {
  selectedNotif.value = notif
}

const borderClass = (type) => {
  if (type === 'rejected') return 'border-red-500'
  if (type === 'approved') return 'border-green-500'
  return 'border-yellow-500'
}

const modalTitle = (type) => {
  if (type === 'rejected') return 'Reason of Rejection'
  if (type === 'signal') return 'Reason of Signal'
  return 'Details'
}

const activeTabClass = 'border-b-2 border-purple-600 text-purple-600'
const inactiveTabClass = 'text-gray-500 hover:text-purple-600'

const loading = ref(false)
const errorMsg = ref(null)

onMounted(async () => {
    loading.value = true
    try {
        const res = await axios.get(`http://localhost:3001/profNotifications`)
        notifications.value = res.data
        console.log('données recues', res.data)
    } catch (error) {
        errorMsg.value = error.response?.data?.message || 'An error occurred'

    } finally {
    loading.value = false
  }
})

</script>
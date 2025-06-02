<template>
  <div class="min-h-screen bg-gray-100 dark:bg-[#121212] flex items-center justify-center px-4 py-10">
    <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg w-full max-w-xl">
      
      <!-- Titre -->
      <h2 class="text-xl font-bold text-gray-800 dark:text-white mb-4">
        {{ pageTitle }}
      </h2>

      <!-- Zone de texte -->
      <textarea
        class="w-full h-48 p-4 border rounded-md bg-gray-50 dark:bg-gray-700 dark:text-white resize-none"
        readonly
      >
{{ notification.reason }}
      </textarea>

      <!-- Bouton retour -->
      <button
        @click="router.back()"
        class="mt-6 w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-md font-semibold transition"
      >
        Back
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const router = useRouter()

const notifId = route.query.id // recuperer de url 
const type = route.query.type

const notification = ref({
  reason: ''
})

const pageTitle = computed(() => {
  if (type === 'rejected') return 'Reason of Rejection'
  return 'Reason of Signal'
})

onMounted(async () => {
  try {
    const res = await axios.get(`http://localhost:3001/profNotifications/${notifId}`)
    notification.value = res.data
  } catch (err) {
    console.error(' Erreur API :', err.message)
  }
})
</script>

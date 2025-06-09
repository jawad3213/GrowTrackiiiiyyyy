<template>
    <div class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4 py-10 overflow-auto z-50">
      <div class="bg-white rounded-2xl shadow-2xl p-8 max-w-xl w-full relative">
  
        <!-- Bouton Fermer -->
        <button @click="closeModal" class="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl font-bold">
          &times;
        </button>
  
        <!-- Titre -->
        
        <h1 class="text-3xl font-black text-center mb-6">
          <span class="bg-red-500 text-white px-2 py-1 rounded">Signal</span>  Information
        </h1>
  
        <!-- Formulaire -->
        <form @submit.prevent="submitSignal" class="space-y-5">
  
          <!-- Title -->
          <div>
            <label class="font-semibold">Title *</label>
            <input v-model="signal.title" type="text" placeholder="Enter a title"
              class="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
          </div>
  
          <!-- Description -->
          <div>
            <label class="font-semibold">Description</label>
            <textarea v-model="signal.description" placeholder="Details about the signal..."
              rows="3"
              class="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"></textarea>
          </div>
  
          <!-- Anonyme -->
          <div class="flex items-center">
            <input v-model="signal.anonymous" type="checkbox" id="anonymous"
              class="mr-2 text-purple-600 focus:ring-purple-500" />
            <label for="anonymous" class="text-sm font-semibold text-purple-600">Anonymes Option</label>
          </div>
  
          <!-- Boutons -->
          <div class="flex justify-end gap-4 pt-4">
            <button type="button" @click="closeModal"
              class="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100">Cancel</button>
            <button type="submit"
              class="px-6 py-2 text-white font-semibold bg-purple-600 hover:bg-purple-700 rounded-md shadow-md">
              Confirm
            </button>
          </div>
  
        </form>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  import api from '@/services/api'
  
  const router = useRouter()
  const route = useRoute()
  const studentId = route.query.id // 👈 récupère l’ID de l’étudiant
  
  const signal = ref({
    title: '',
    description: '',
    anonymous: false
  })
  
 
const classId = route.query.classId

  function closeModal() {
    router.push({ path: '/ClassesSignal', query: { classId } })

  }
  
  async function submitSignal() {
  if (!signal.value.title) {
    alert("⚠️ Title is required.")
    return
  }

  try {
    const token = localStorage.getItem('token')
    await api.post(
      `/api/signal_classes/new_signal/${studentId}`,
      {
        option_signal: signal.value.title,
        message: signal.value.description,
        anony: signal.value.anonymous
      },
      { headers: { Authorization: `Bearer ${token}` } }
    )

    router.back()
  } catch (err) {
    console.error("❌ Erreur lors de l'envoi du signal :", err)
  }
}
  </script>

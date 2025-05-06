<template>
    <div class="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl shadow-2xl px-8 py-10 max-w-md w-full text-center relative border-2 border-purple-300">
        
        <!-- Bouton Fermer -->
        <button @click="router.back()" class="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl font-bold">
          &times;
        </button>
  
        <!-- Icône ⚠️ -->
        <div class="text-yellow-500 text-4xl mb-4">⚠️</div>
  
        <!-- Message -->
        <h2 class="text-md font-semibold text-gray-800 mb-2">Something went wrong...</h2>
        <p class="text-sm text-gray-500 mb-6">
          We had some trouble loading this page. Please refresh the page or try again.<br/>
          Get in touch if the problem sticks around!
        </p>
  
        <!-- Boutons -->
        <div class="flex justify-center gap-4">
          <button class="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded" @click="contactSupport">
            Contact support
          </button>
          <button class="px-4 py-2 text-sm bg-purple-500 hover:bg-purple-600 text-white rounded" @click="router.go(0)">
            Refresh page
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { useRouter } from 'vue-router'
  const router = useRouter()
  
  const contactSupport = () => {
    alert('Contact us at support@growtrack.com')
  }
  </script>
  
<template>
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-700 via-pink-500 to-orange-400 px-4">
      <div class="bg-white rounded-xl shadow-lg max-w-md w-full p-10 text-center">
        
        <!-- Icône check -->
        <div class="flex justify-center mb-4">
          <div class="bg-green-500 rounded-full p-4">
            <svg class="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
  
        <!-- Message -->
        <h2 class="text-2xl font-bold text-gray-800 mb-2">Check your email</h2>
        <p class="text-gray-600 mb-6 text-sm">We have sent a password recovery instruction to your email</p>
  
        <!-- Bouton OK -->
        <button
          @click="router.push('/resetpass')"
          class="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition"
        >
          Ok
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { useRouter } from 'vue-router'
  const router = useRouter()
  </script>

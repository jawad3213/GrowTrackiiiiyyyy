<template>
    <div class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 font-inter">
      <div class="bg-white w-[600px] h-[400px] p-8 rounded-xl shadow-xl text-center relative">
        
        <!-- Fermer -->
        <button @click="close" class="absolute top-4 right-4 text-gray-500 text-xl font-bold hover:text-gray-800">
          &times;
        </button>
  
        <!-- Titre -->
        <h2 class="text-lg mb-4 text-purple-600 font-semibold">Project Evaluation</h2>
        <h1 class="text-4xl font-bold mb-6">
          Thank you for your 
          <span class="bg-orange-500 text-white px-2 rounded">Feedback</span>
        </h1>
  
        <!-- Icône centrale -->
        <div class="flex justify-center mb-6">
          <div class="relative">
            <div class="bg-orange-500 text-white w-30 h-30 rounded-full flex items-center justify-center mb-6 text-4xl">
             <div class = "w-70 ">✔</div> 
            </div>
          </div>
        </div>
  
        <!-- Message final -->
        <p class="text-purple-600 font-bold text-2xl">Evaluation Submitted Successfully</p>
      </div>
    </div>
  </template>
  
  <script setup>
  import { useRouter } from 'vue-router'
  
  const router = useRouter()
  
  const close = () => {
    router.push('/ClassesEval') // ou toute autre page après soumission
  }
  </script>
  
  <style scoped>
  .font-inter {
    font-family: 'Inter', sans-serif;
  }
  </style>
  
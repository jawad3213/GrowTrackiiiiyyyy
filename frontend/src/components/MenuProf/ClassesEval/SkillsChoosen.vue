<template>
    <div v-if="isOpen" div class="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
        <div class="bg-white rounded-xl shadow-2xl p-8 max-w-3xl w-full relative">        
        <!-- Close Button -->
        <button @click="closeModal" class="text-gray-500 ml-170 hover:text-gray-800 text-3xl font-bold">&times;</button>

  
        <!-- Title -->
        <h2 class="text-5xl mt-10 font-bold mb-2 text-center">
          Choose your <span class="bg-orange-500 text-white px-2 rounded">Evaluation</span> type
        </h2>
  
        <!-- Subtitle -->
        <p class="mt-14 ml-5 text-2xl">
          YOU WILL EVALUATE <span class="text-purple-600 font-bold uppercase">{{ evaluatedName }}</span> BASED ON SOME QUESTION ABOUT THE FOLLOWING SKILLS:
        </p>

        <!-- Skills List -->
        <ul class="list-disc mt-10 ml-20 text-2xl text-gray-800 mb-6">
          <li v-for="(skill, index) in selectedSkills" :key="index">{{ skill }}</li>
        </ul>
  
        <!-- Action Buttons -->
        <div class="flex justify-between mt-18 gap-4">
          <button @click="startProjectEvaluation"
            class="bg-orange-500 hover:bg-orange-600 text-xl text-white font-bold py-2 px-4 rounded w-full">
            Project Evaluation
          </button>
          <button @click="startCourseEvaluation"
            class="bg-purple-600 hover:bg-purple-700 text-xl text-white font-bold py-2 px-4 rounded w-full">
            Course Evaluation
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>

import { ref, onMounted } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  
  
  const router = useRouter()
  const route = useRoute()
  const isOpen = ref(true)
  
  const selectedSkills = ref([])
  const evaluatedName = ref('this student')
  const studentId = ref('')

  // récupération des données depuis localStorage ou route
  onMounted(() => {
    const skillsFromStorage = localStorage.getItem('selectedSkills')
    if (skillsFromStorage) {
      selectedSkills.value = JSON.parse(skillsFromStorage)
    }
    // Récupère l'id de l'étudiant depuis la query
    if (route.query.id) {
      studentId.value = route.query.id
    }
    console.log('studentId:', studentId.value)
   /* const storedName = localStorage.getItem('evaluatedName')
    if (storedName) {
      evaluatedName.value = storedName
    }*/
  })
  
  function closeModal() {
    isOpen.value = false
    router.push('/ClassesEval') 
  }
  
  function startProjectEvaluation() {
    router.push({ path: '/courseEvaluation', query: { type: 'project', id: studentId.value  } })
  }
  
  function startCourseEvaluation() {
    router.push({ path: '/courseEvaluation', query: { type: 'course', id: studentId.value  } })
  }
  </script>

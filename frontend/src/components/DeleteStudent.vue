<template>
    <div class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center">
      <div class="bg-white rounded-lg p-8 shadow-md text-center">
        <h2 class="text-2xl font-bold mb-4 text-red-600">Delete Student</h2>
        <p class="mb-6 text-gray-600">Are you sure you want to delete this student?<br>This action is permanent.</p>
        <div class="flex justify-center space-x-4">
          <button @click="cancel" class="px-6 py-2 border border-gray-300 rounded-md">Cancel</button>
          <button @click="deleteStudent" class="px-6 py-2 bg-red-600 text-white rounded-md">Delete</button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { useRoute, useRouter } from 'vue-router'
  import { useStudentStore } from '@/stores/student'
  
  const route = useRoute()
  const router = useRouter()
  const studentStore = useStudentStore()
  
  async function deleteStudent() {
    const id = route.params.id
    await studentStore.deleteStudent(id)
    router.push('/Student') // après suppression retourner vers liste
  }
  
  function cancel() {
    router.push('/Student') // annuler = retourner sans supprimer
  }
  </script>
  
<template>
  <!-- Overlay classique (fond noir semi-transparent) -->
  <div class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
    <!-- Carte plus large (max-w-lg) et padding accru (p-10) -->
    <div class="bg-white rounded-lg p-10 shadow-lg max-w-lg w-full mx-4">
      <h2 class="text-3xl font-bold mb-6 text-red-600">Delete Student</h2>
      <p class="mb-8 text-gray-600 text-lg">
        Are you sure you want to delete this student?<br />
        This action is <span class="font-semibold">permanent</span>.
      </p>
      <div class="flex justify-center space-x-6">
        <!-- Bouton “Cancel” avec hover -->
        <button
          @click="cancel"
          class="px-7 py-3 border border-gray-300 text-gray-700 rounded-md
                 hover:bg-gray-100 hover:border-gray-400 hover:text-gray-900
                 transition-colors duration-200 ease-in-out"
        >
          Cancel
        </button>

        <!-- Bouton “Delete” avec hover -->
        <button
          @click="deleteStudent"
          class="px-7 py-3 bg-red-600 text-white rounded-md
                 hover:bg-red-700 hover:shadow-md
                 transition-colors duration-200 ease-in-out"
        >
          Delete
        </button>
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
  const id_member = route.params.id_member
  await studentStore.deleteStudent(id_member)
  router.push('/Student')
}

function cancel() {
  router.push('/Student')
}
</script>

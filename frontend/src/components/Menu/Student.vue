<template>
  <admin-layout>
    <div class="flex min-h-screen bg-gray-50 font-sans dark:border-gray-800 dark:bg-white/[0.03]">
      <main class="flex-1 flex flex-col">
        
        <!-- Titre + bouton Add -->
        <div class="flex items-center justify-between p-6">
          <h1 class="text-2xl font-bold flex items-center space-x-2">
  <span>Students</span>
  <span class="bg-purple-100 text-purple-600 text-sm font-semibold px-3 py-1 rounded-full">
    {{ studentStore.students.length }} students
  </span>
</h1>

      <button @click="showForm=true"
            class="bg-[#F97316] hover:bg-[#FA9148] text-white font-bold px-6 py-2 rounded-lg inline-block">
            {{ studentStore.students.length > 0 ? '+ Create' : '+ Add a student' }}
      </button>
      <AddStudentModal v-if="showForm" @fermer="showForm=false"/>
        </div>

        <!-- Table -->
        <div v-if="studentStore.students.length > 0" class="p-6 overflow-x-auto">
          <table class="min-w-full bg-white rounded-lg shadow">
            <thead class="bg-gray-100">
              <tr>
                <th class="py-3 px-4 text-left text-sm font-semibold">Full Name</th>
                <th class="py-3 px-4 text-left text-sm font-semibold">CIN</th>
                <th class="py-3 px-4 text-left text-sm font-semibold">Email</th>
                <th class="py-3 px-4 text-left text-sm font-semibold">Field</th>
                <th class="py-3 px-4 text-left text-sm font-semibold">Year</th>
                <th class="py-3 px-4 text-left text-sm font-semibold">Notes</th>
                <th class="py-3 px-4 text-center text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="student in studentStore.students" :key="student.id" class="border-b hover:bg-gray-50">
                <td class="py-3 px-4">{{ student.fullName }}</td>
                <td class="py-3 px-4">{{ student.cin }}</td>
                <td class="py-3 px-4">{{ student.email }}</td>
                <td class="py-3 px-4">{{ student.field }}</td>
                <td class="py-3 px-4">{{ student.year }}</td>
                <td class="py-3 px-4">{{ student.notes }}</td>
                <td class="py-3 px-4 flex justify-center space-x-2">
                  <!-- Edit -->
                  <router-link :to="`/AddStudent/${student.id}`" class="text-blue-500 hover:text-blue-700">
                    ✏️
                  </router-link>

                  <!-- Delete -->
                  <router-link :to="`/DeleteStudent/${student.id}`" class="text-red-500 hover:text-red-700">
                    🗑️
                  </router-link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Si pas d'étudiants -->
        <div v-else class="flex-1 flex flex-col items-center justify-center text-center text-gray-600 py-10">
          <div class="text-5xl mb-4">🔍</div>
          <p class="text-lg font-semibold mb-2">No student defined</p>
          <p class="mb-6">You haven’t set up any student yet.</p>
        </div>

      </main>
    </div>
  </admin-layout>
</template>

<script setup>
import { onMounted,ref } from 'vue'
import AdminLayout from '../layout/AdminLayout.vue'
import { useStudentStore } from '@/stores/student'
import AddStudentModal from '../AddStudentModal.vue'

const studentStore = useStudentStore()
const showForm = ref(false)

onMounted(() => {
  studentStore.fetchStudents()
})
</script>

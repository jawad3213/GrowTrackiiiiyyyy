<template>
  <admin-layout>
    <div class="flex min-h-screen bg-gray-50 dark:bg-gray-900 font-sans">
      <main class="flex-1 flex flex-col">

        <!-- Titre + bouton Add -->
        <div class="flex items-center justify-between p-6">
          <h1 class="text-2xl font-bold flex items-center space-x-2 text-gray-800 dark:text-white">
            <span>Students</span>
            <span class="bg-purple-100 text-purple-600 text-sm font-semibold px-3 py-1 rounded-full dark:bg-purple-200/10 dark:text-purple-300">
              {{ students.length }} students
            </span>
          </h1>

          <router-link
            to="/AddStudent"
            class="bg-[#F97316] hover:bg-[#FA9148] text-white font-bold px-6 py-2 rounded-lg inline-block"
          >
            {{ students.length > 0 ? '+ Create' : '+ Add a student' }}
          </router-link>
        </div>

        <!-- Table -->
        <div v-if="students.length > 0" class="p-6 overflow-x-auto">
          <table class="min-w-full bg-white dark:bg-gray-800 shadow text-gray-800 dark:text-gray-100">
            <thead class="bg-gray-100 dark:bg-gray-700">
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
              <tr
                v-for="student in students"
                :key="student.id"
                class="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <td class="py-3 px-4">{{ student.fullName }}</td>
                <td class="py-3 px-4">{{ student.cin }}</td>
                <td class="py-3 px-4">{{ student.email }}</td>
                <td class="py-3 px-4">{{ student.field }}</td>
                <td class="py-3 px-4">{{ student.year }}</td>
                <td class="py-3 px-4">{{ student.notes }}</td>
                <td class="py-3 px-4 flex justify-center space-x-2">
                  <router-link :to="`/AddStudent/${student.id}`" class="text-blue-500 hover:text-blue-700">✏️</router-link>
                  <router-link :to="`/DeleteStudent/${student.id}`" class="text-red-500 hover:text-red-700">🗑️</router-link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Si pas d'étudiants -->
        <div v-else class="flex-1 flex flex-col items-center justify-center text-center text-gray-600 dark:text-gray-300 py-10">
          <div class="text-5xl mb-4">🔍</div>
          <p class="text-lg font-semibold mb-2">No student defined</p>
          <p class="mb-6">You haven’t set up any student yet.</p>
        </div>

      </main>
    </div>
  </admin-layout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AdminLayout from '../layout/AdminLayout.vue'
import axios from 'axios'

const students = ref([])

const fetchStudents = async () => {
  const res = await axios.get('http://localhost:3001/students')
  students.value = res.data
}

onMounted(() => {
  fetchStudents()
})
</script>

<template>
  <div class="p-8 font-inter">
    <h1 class="text-3xl font-bold mb-6">Students</h1>

    <div class="overflow-x-auto rounded-lg shadow">
      <table class="min-w-full bg-white">
        <thead class="bg-gray-100">
          <tr>
            <th class="py-3 px-4 text-left text-sm font-semibold">Full Name</th>
            <th class="py-3 px-4 text-left text-sm font-semibold">CIN</th>
            <th class="py-3 px-4 text-left text-sm font-semibold">Email</th>
            <th class="py-3 px-4 text-left text-sm font-semibold">Year</th>
            <th class="py-3 px-4 text-left text-sm font-semibold">Field</th>
            <th class="py-3 px-4 text-left text-sm font-semibold">Admin Notes</th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="student in studentStore.students" 
            :key="student.id" 
            class="border-b hover:bg-gray-50 transition-colors"
          >
            <td class="py-3 px-4">{{ student.fullName }}</td>
            <td class="py-3 px-4">{{ student.cin }}</td>
            <td class="py-3 px-4">{{ student.email }}</td>
            <td class="py-3 px-4">{{ student.year }}</td>
            <td class="py-3 px-4">{{ student.field }}</td>
            <td class="py-3 px-4">{{ student.notes }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script setup>
import { onMounted } from 'vue'
import { useStudentStore } from '@/stores/student'

const studentStore = useStudentStore()

onMounted(() => {
  if (studentStore.students.length === 0) {
    studentStore.fetchStudents() // Charger s'il n'y a rien encore
  }
})
</script>


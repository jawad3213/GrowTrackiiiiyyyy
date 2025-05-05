<template>
  <!-- Fond flou et gris clair -->
  <div class="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-gray-200/60 px-4 py-8 overflow-auto">
    
    <!-- Conteneur du formulaire -->
    <div class="bg-white border-2 border-purple-500 rounded-2xl shadow-xl w-full max-w-2xl p-8 relative">

      <!-- Header -->
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-2xl font-bold text-gray-900">Add Student</h2>
        <button @click="closeModal" class="text-gray-500 hover:text-gray-800 text-2xl font-bold">&times;</button>
      </div>

      <!-- Formulaire -->
      <form @submit.prevent="submitForm" class="space-y-4">

        <!-- Nom + CIN -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="font-semibold">Full Name*</label>
            <input v-model="student.fullName" type="text" placeholder="Full name"
              class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
            <p v-if="errors.fullName" class="text-red-500 text-xs mt-1">{{ errors.fullName }}</p>
          </div>
          <div>
            <label class="font-semibold">CIN*</label>
            <input v-model="student.cin" type="text" placeholder="CIN"
              class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
            <p v-if="errors.cin" class="text-red-500 text-xs mt-1">{{ errors.cin }}</p>
          </div>
        </div>

        <!-- Email -->
        <div>
          <label class="font-semibold">Email*</label>
          <input v-model="student.email" type="email" placeholder="you@company.com"
            class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
          <p v-if="errors.email" class="text-red-500 text-xs mt-1">{{ errors.email }}</p>
        </div>

        <!-- Password -->
        <div>
          <label class="font-semibold">Password*</label>
          <input v-model="student.password" type="password" placeholder="Enter a secure password"
            class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
          <p v-if="errors.password" class="text-red-500 text-xs mt-1">{{ errors.password }}</p>
        </div>

        <!-- Année + Filière -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="font-semibold">Year of Studies*</label>
            <select v-model="student.year"
              class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
              <option disabled value="">-- Sélectionner --</option>
              <option>AP1</option>
              <option>AP2</option>
              <option>CI1</option>
              <option>CI2</option>
              <option>CI3</option>
            </select>
          </div>
          <div>
            <label class="font-semibold">Field*</label>
            <select v-model="student.field" :disabled="availableFields.length === 0"
              class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
              <option disabled value="">-- Choisir un champ --</option>
              <option v-for="field in availableFields" :key="field">{{ field }}</option>
            </select>
          </div>
        </div>

        <!-- Notes -->
        <div>
          <label class="font-semibold">Admin Notes</label>
          <textarea v-model="student.notes" rows="4" placeholder="e.g. I joined the school..."
            class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"></textarea>
        </div>

        <!-- Alertes -->
        <p v-if="formStore.error" class="text-red-500 text-sm mt-2 animate-pulse">{{ formStore.error }}</p>
        <p v-if="formStore.success" class="text-green-500 text-sm mt-2 animate-pulse">{{ formStore.success }}</p>

        <!-- Boutons -->
        <div class="grid grid-cols-2 gap-4 pt-4">
          <button type="button" @click="closeModal"
            class="py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100">
            Cancel
          </button>
          <button
            type="submit"
            :disabled="formStore.loading"
            class="py-2 font-semibold text-white rounded-md bg-gradient-to-r from-purple-600 to-orange-400 hover:from-purple-700 hover:to-orange-500 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed">
            <span v-if="formStore.loading">Loading...</span>
            <span v-else>Confirm</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useFormStore } from '@/stores/form'
import { useStudentStore } from '@/stores/student'

const router = useRouter()
const formStore = useFormStore()
const studentStore = useStudentStore()
const emit = defineEmits(['fermer'])

const student = ref({
  fullName: '',
  cin: '',
  email: '',
  password: '',
  year: 'AP1',
  field: 'GINF',
  notes: ''
})

const fieldsByYear = {
  AP: ['TD1', 'TD2', 'TD3'],
  CI: ['GINF', 'GSEA', 'CYS', 'GSR', 'GINL']
}

const availableFields = computed(() => {
  if (student.value.year.startsWith('AP')) {
    return fieldsByYear.AP
  } else if (student.value.year.startsWith('CI')) {
    return fieldsByYear.CI
  }
  return []
})

const errors = ref({})

async function submitForm() {
  const { valid, errors: formErrors } = formStore.validateForm(student.value, [
    'fullName', 'cin', 'email', 'password', 'year', 'field', 'notes'
  ])
  errors.value = formErrors
  if (!valid) return
  try {
    await studentStore.addStudent(student.value)
  } catch (error) {
    console.error('Failed to add student:', error)
  }
}

function closeModal() {
  emit('fermer')
}
formStore.clearStatus()
</script>

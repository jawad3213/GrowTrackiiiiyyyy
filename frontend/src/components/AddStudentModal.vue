<template>
    <div v-if="isOpen" class="fixed inset-0 bg-gray-900 bg-opacity-60 flex items-center justify-center z-50">
      <div class="bg-white rounded-2xl shadow-xl w-full mt-30 mb-30 max-w-lg p-6 sm:p-8 border-t-4 border-purple-500">
        
        <!-- Header -->
        <div class="flex items-center justify-between mb-1">
          <div class="flex items-center gap-2">
            <div class="bg-gray-200 rounded-full  mb-12 p-3 mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m2 0a2 2 0 012 2v6H5v-6a2 2 0 012-2h10z" />
              </svg>
            </div>
            <div>
              <h2 class="text-2xl font-bold mb-12 text-gray-900 font-inter">Add Student</h2>
            </div>
          </div>
          <button @click="closeModal" class="text-gray-500 hover:text-gray-800 text-3xl mb-6   font-bold">&times;</button>
        </div>
  
        <!-- Form -->
        <form @submit.prevent="submitForm" class="space-y-4">
          <!-- Full Name + CIN -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="relative">
            <label class="font-semibold">Full Name</label>
            <input
              v-model="student.fullName"
              type="text"
              placeholder="Full name *"
              class="w-full px-4 py-2 border border-gray-300 rounded-md text-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <transition name="fade">
              <p v-if="errors.fullName" class="text-red-500 text-xs mt-1">{{ errors.fullName }}</p>
            </transition>
          </div>
          <div class="relative">
            <label class="font-semibold font-inter">CIN</label>
            <input
              v-model="student.cin"
              type="password"
              placeholder="CIN *"
              class="w-full px-4 py-2 border border-gray-300 rounded-md text-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <transition name="fade">
              <p v-if="errors.cin" class="text-red-500 text-xs mt-1">{{ errors.cin }}</p>
            </transition>
          </div>
        </div>

        <!-- Email -->
        <div class="relative">
            <label class="font-semibold">Email</label>
          <input
            v-model="student.email"
            type="email"
            placeholder="Email *"
            class="w-full px-4 py-2 border border-gray-300 rounded-md text-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <transition name="fade">
            <p v-if="errors.email" class="text-red-500 text-xs mt-1">{{ errors.email }}</p>
          </transition>
        </div>

        <!-- Password -->
        <div class="relative">
            <label class="font-semibold">Password</label>
          <input
            v-model="student.password"
            type="password"
            placeholder="Password *"
            class="w-full px-4 py-2 border border-gray-300 rounded-md text-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <transition name="fade">
            <p v-if="errors.password" class="text-red-500 text-xs mt-1">{{ errors.password }}</p>
          </transition>
        </div>

        <!-- Filière + Groupe -->
        
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
                <label class="font-semibold">Filiere</label>
                <select
                  v-model="student.filiere"
                  class="w-full px-4 py-2 border border-gray-300 rounded-md text-md focus:outline-none focus:ring-2 focus:ring-purple-500">
                  <option>Ginf</option>
                  <option>Gind</option>
                  <option>Gsr</option>
                  <option>GSEA</option>
                </select>
            </div>
      
            <div>
                <label class="font-semibold">Group</label>
          <select
            v-model="student.group"
            class="w-full px-4 py-2 border border-gray-300 rounded-md text-md focus:outline-none focus:ring-2 focus:ring-purple-500">
            <option>Full time</option>
            <option>Part time</option>
          </select>
        </div>
        </div>

        <!-- Notes -->
        <div class="relative">
            <label class="font-semibold">Admin notes</label>
          <textarea
            v-model="student.notes"
            rows="4"
            placeholder="e.g. I joined Stripe’s Customer Success team..."
            class="w-full px-4 py-2 border border-gray-300 rounded-md text-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          ></textarea>
          <transition name="fade">
            <p v-if="errors.notes" class="text-red-500 text-xs mt-1">{{ errors.notes }}</p>
          </transition>
        </div>
          <p v-if="errormsg" class="text-red-500 text-sm mb-2 animate-pulse">
            {{ errormsg }}
          </p>

          <!-- Buttons -->
          <div class="flex flex-cols-2 justify-between  pt-4">
            <button type="button" @click="closeModal" class="px-20 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100">
              Cancel
            </button>
            <button
              type="submit"
              :disabled="loading"
              class="px-20 py-2 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
              <span v-if="!loading">Confirm</span>
              <span v-else>Loading...</span>
            </button>

          </div>
  
        </form>
      </div>
    </div>
  </template>
  
  <script setup>
import api from '@/services/api';
import { ref } from 'vue'
  
  const isOpen = ref(true)
  
  const student = ref({
    fullName: '',
    cin: '',
    email: '',
    password: '',
    filiere: 'Full time',
    group: 'Full time',
    notes: ''
  })
  
  const errors = ref({
    fullName: '',
    cin: '',
    email: '',
    password: '',
    notes: ''
  })
  
  function closeModal() {
    isOpen.value = false
  }
  
  function validateForm() {
    let valid = true
  
    errors.value = {
      fullName: '',
      cin: '',
      email: '',
      password: '',
      notes: ''
    }
  
    if (!student.value.fullName) {
      errors.value.fullName = 'Full Name is required'
      valid = false
    }
    if (!student.value.cin) {
      errors.value.cin = 'CIN is required'
      valid = false
    }
    if (!student.value.email) {
      errors.value.email = 'Email is required'
      valid = false
    }
    if (!student.value.password) {
      errors.value.password = 'Password is required'
      valid = false
    }
    if (!student.value.notes) {
      errors.value.notes = 'Notes are required'
      valid = false
    }
  
    return valid
  }

const loading = ref(false)
const errormsg = ref(null)

async function submitForm() {
  errormsg.value = null 

  if (validateForm()) {
    loading.value = true
    try {
      await api.patch('/add', student.value)
      console.log('Form submitted successfully')
      closeModal()
    } catch (err) {
      errormsg.value = err.response?.data?.message || 'An error occurred while submitting'
      console.error('Erreur API:', errormsg.value)
    } finally {
      loading.value = false
    }
  } else {
    console.log('Form has validation errors')
  }
}

  // Fonction pour ajouter des classes dynamiquement
  function inputClass(value, error) {
    return [
      'input',
      value && !error ? 'border-green-400' : '',
      error ? 'border-red-400' : ''
    ].join(' ')
  }
  </script>
  
  <style scoped>
  /* Animation fade pour apparition/disparition */
  .fade-enter-active, .fade-leave-active {
    transition: opacity 0.3s ease;
  }
  .fade-enter-from, .fade-leave-to {
    opacity: 0;
}
</style>

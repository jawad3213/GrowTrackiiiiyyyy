<template>
    <div v-if="isOpen" class="fixed inset-0 bg-gray-900 bg-opacity-60 flex items-center justify-center z-50 font-inter">
      <div class="bg-white border-2 border-purple-500 rounded-2xl shadow-xl w-full max-w-md p-6 sm:p-8">
  
        <!-- Header -->
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-bold text-gray-900">Add Supervisor</h2>
          <button @click="closeModal" class="text-gray-500 hover:text-gray-800 text-2xl font-bold">&times;</button>
        </div>
  
        <!-- Form -->
        <form @submit.prevent="submitForm" class="space-y-4">
  
          <!-- Name + CIN -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="font-semibold">Full name*</label>
              <input v-model="supervisor.fullName" type="text" placeholder="Full name"
                class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                <p v-if="errors.fullName" class="text-red-500 text-xs mt-1">{{ errors.fullName }}</p>
            </div>
            <div>
              <label class="font-semibold">CIN*</label>
              <input v-model="supervisor.cin" type="password" placeholder="************"
                class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                <p v-if="errors.cin" class="text-red-500 text-xs mt-1">{{ errors.cin }}</p>
            </div>
          </div>
  
          <!-- Email + Password -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="font-semibold">Email*</label>
              <input v-model="supervisor.email" type="email" placeholder="you@company.com"
                class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                <p v-if="errors.email" class="text-red-500 text-xs mt-1">{{ errors.email }}</p>
            </div>
            <div>
              <label class="font-semibold">Password*</label>
              <input v-model="supervisor.password" type="password" placeholder="Enter a secure password"
                class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                <p v-if="errors.password" class="text-red-500 text-xs mt-1">{{ errors.password }}</p>
            </div>
          </div>
  
          <!-- Company + Registration Number -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="font-semibold">Company</label>
              <input v-model="supervisor.company" type="text" placeholder="Company name"
                class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
            </div>
            <div>
              <label class="font-semibold">Registration number</label>
              <input v-model="supervisor.registrationNumber" type="text" placeholder="Registration code"
                class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
            </div>
          </div>
  
          <!-- Internship Information -->
          <label class="font-semibold">Internship information</label>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="text-sm text-gray-700 font-medium">Date of beginning*</label>
              <input v-model="supervisor.dateStart" type="date"
                class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                <p v-if="errors.dateStart" class="text-red-500 text-xs mt-1">{{ errors.dateStart }}</p>
            </div>
            <div>
              <label class="text-sm text-gray-700 font-medium">Date of end*</label>
              <input v-model="supervisor.dateEnd" type="date"
                class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                <p v-if="errors.dateEnd" class="text-red-500 text-xs mt-1">{{ errors.dateEnd }}</p>
            </div>
          </div>
  
          <!-- Internship Subject -->
          <div>
            <label class="font-semibold">Internship Subject</label>
            <textarea v-model="supervisor.subject" rows="3" placeholder="e.g. I joined Stripe’s Customer Success team..."
              class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"></textarea>
          </div>
  

        <!-- Alertes -->
        <p v-if="formStore.error" class="text-red-500 text-sm mb-2 animate-pulse">{{ formStore.error }}</p>
        <p v-if="formStore.success" class="text-green-500 text-sm mb-2 animate-pulse">{{ formStore.success }}</p>

          <!-- Buttons -->
          <div class="flex justify-between pt-4">
            <button type="button" @click="closeModal"
              class="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100">Cancel</button>
            <button type="submit"
              class="px-8 py-2 font-semibold text-white rounded-md bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 transition-all duration-300 transform hover:scale-105">
              Confirm
            </button>
          </div>
  
        </form>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { useFormStore } from '@/stores/form'

  const formStore = useFormStore()
  
  const isOpen = ref(true)
  
  const supervisor = ref({
    fullName: '',
    cin: '',
    email: '',
    password: '',
    company: '',
    registrationNumber: '',
    dateStart: '',
    dateEnd: '',
    subject: ''
  })
const errors = ref({})

// Ferme la modale
function closeModal() {
  isOpen.value = false
}

// Soumet le formulaire
async function submitForm() {
  const { valid, errors: formErrors } = formStore.validateForm(supervisor.value, [ 
    'fullName', 'cin', 'email', 'password', 'company', 'registrationNumber', 'dateStart','dateEnd'
  ])

  errors.value = formErrors

  if (!valid) return

  await formStore.submitForm('/addsup', supervisor.value, () => {
    closeModal()
  })
}
formStore.clearStatus()
</script>


  
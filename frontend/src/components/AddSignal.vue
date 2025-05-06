<template>
    <div v-if="isOpen" class="fixed inset-0 bg-gray-900 bg-opacity-60 flex items-center justify-center z-50 font-inter">
      <div class="bg-white border-2 border-purple-500 rounded-2xl shadow-xl w-full max-w-xl p-6 sm:p-8">
  
        <!-- Header -->
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-gray-900">Signal Evaluation Details</h2>
          <button @click="closeModal" class="text-gray-500 hover:text-gray-800 text-2xl font-bold">&times;</button>
        </div>
  
        <!-- Formulaire -->
        <form @submit.prevent="submitForm" class="space-y-4">
          <!-- Ligne 1 -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="text-sm text-gray-700 font-medium">Reported By</label>
              <input v-model="signal.reportedBy" class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
              <p v-if="errors.reportedBy" class="text-red-500 text-xs mt-1">{{ errors.reportedBy }}</p>
            </div>
            <div>
              <label class="text-sm text-gray-700 font-medium">Reporter Role</label>
              <input v-model="signal.reporterRole" class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
              <p v-if="errors.reporterRole" class="text-red-500 text-xs mt-1">{{ errors.reporterRole }}</p>
            </div>
          </div>
  
          <!-- Ligne 2 -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="text-sm text-gray-700 font-medium">Reported User</label>
              <input v-model="signal.reportedUser" class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
              <p v-if="errors.reportedUser" class="text-red-500 text-xs mt-1">{{ errors.reportedUser }}</p>
            </div>
            <div>
              <label class="text-sm text-gray-700 font-medium">Reported User Role</label>
              <input v-model="signal.reportedUserRole" class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
              <p v-if="errors.reportedUserRole" class="text-red-500 text-xs mt-1">{{ errors.reportedUserRole }}</p>
            </div>
          </div>
  
          <!-- Ligne 3 -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="text-sm text-gray-700 font-medium">Submitted Date</label>
              <input v-model="signal.submittedDate" class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
              <p v-if="errors.submittedDate" class="text-red-500 text-xs mt-1">{{ errors.submittedDate }}</p>
            </div>
            <div>
              <label class="text-sm text-gray-700 font-medium">Type</label>
              <input v-model="signal.type" class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
              <p v-if="errors.type" class="text-red-500 text-xs mt-1">{{ errors.type }}</p>
            </div>
          </div>
  
          <!-- Reason -->
          <div>
            <label class="text-sm text-gray-700 font-medium">Reason *</label>
            <input v-model="signal.reason" class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
            <p v-if="errors.reason" class="text-red-500 text-xs mt-1">{{ errors.reason }}</p>
          </div>
  
          <!-- Commentaire -->
          <div>
            <label class="text-sm text-gray-700 font-medium">Reporter comment and prove</label>
            <textarea v-model="signal.comment" rows="3" class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"></textarea>
          </div>
  
          <!-- Alertes -->
          <p v-if="formStore.error" class="text-red-500 text-sm animate-pulse">{{ formStore.error }}</p>
          <p v-if="formStore.success" class="text-green-500 text-sm animate-pulse">{{ formStore.success }}</p>
  
          <!-- Boutons -->
          <div class="pt-4 flex justify-between">
            <button type="button" @click="submitForm('rejected')" class="w-1/3 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md transition">Rejected</button>
            <button type="button" @click="submitForm('approved')" class="w-1/3 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md transition">Approved</button>
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
  
  const signal = ref({
    reportedBy: 'focc',
    reporterRole: '',
    reportedUser: 'focc',
    reportedUserRole: '',
    submittedDate: '2024-04-25',
    type: 'Soft Skill',
    reason: '',
    comment: ''
  })
  
  function closeModal() {
    isOpen.value = false
  }
  const errors = ref({})
  async function submitForm(decision) {
    const { valid, errors:formErrors } = formStore.validateForm(signal.value, ['reportedBy','reporterRole','submittedDate', 'reportedUser', 'reason'])
    if (!valid) return
  
    errors.value = formErrors
    signal.value.status = decision
    await formStore.submitForm('/signal-evaluation', signal.value, () => closeModal())
  }
  formStore.clearStatus()
  </script>
  
  

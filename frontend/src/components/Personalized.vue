<template>
    <div v-if="isOpen" class="fixed inset-0 bg-gray-900 bg-opacity-60 flex items-center justify-center z-50 font-inter">
      <div class="bg-white border-2 border-purple-500 rounded-2xl shadow-xl w-full max-w-xl p-6 sm:p-8">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold text-gray-800">Personalized Monitoring</h2>
          <button @click="closeModal" class="text-gray-500 hover:text-gray-800 text-2xl font-bold">&times;</button>
        </div>
        <form @submit.prevent="submitForm" class="space-y-4">
          <div>
            <label class="font-semibold">Proposed Corrective Solutions*</label>
            <input v-model="monitoring.solutions" type="text" placeholder="Tutoring, Workshop, etc"
              class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
            <p v-if="errors.solutions" class="text-red-500 text-xs mt-1">{{ errors.solutions }}</p>
          </div>
          <div>
            <label class="font-semibold">Details*</label>
            <textarea v-model="monitoring.details" rows="3"
              class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"></textarea>
            <p v-if="errors.details" class="text-red-500 text-xs mt-1">{{ errors.details }}</p>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="font-semibold">Reporter full name*</label>
              <input v-model="monitoring.reporter" type="text"
                class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
              <p v-if="errors.reporter" class="text-red-500 text-xs mt-1">{{ errors.reporter }}</p>
            </div>
            <div>
              <label class="font-semibold">Reported User*</label>
              <input v-model="monitoring.reportedUser" type="text"
                class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
              <p v-if="errors.reportedUser" class="text-red-500 text-xs mt-1">{{ errors.reportedUser }}</p>
            </div>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="font-semibold">CIN Reporter*</label>
              <input v-model="monitoring.cinReporter" type="text"
                class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
              <p v-if="errors.cinReporter" class="text-red-500 text-xs mt-1">{{ errors.cinReporter }}</p>
            </div>
            <div>
              <label class="font-semibold">CIN Reported User*</label>
              <input v-model="monitoring.cinReportedUser" type="text"
                class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
              <p v-if="errors.cinReportedUser" class="text-red-500 text-xs mt-1">{{ errors.cinReportedUser }}</p>
            </div>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="font-semibold">Date of Beginning*</label>
              <input v-model="monitoring.startDate" type="date"
                class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
              <p v-if="errors.startDate" class="text-red-500 text-xs mt-1">{{ errors.startDate }}</p>
            </div>
            <div>
              <label class="font-semibold">Date of ending*</label>
              <input v-model="monitoring.endDate" type="date"
                class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
              <p v-if="errors.endDate" class="text-red-500 text-xs mt-1">{{ errors.endDate }}</p>
            </div>
          </div>
          <!-- Alertes -->
            <p v-if="errorApi" class="text-red-500 text-sm mb-2 animate-pulse">{{ errorApi }}</p>
            
          <div class="flex justify-between pt-4">
            <button @click="closeModal" type="button"
              class="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100">Go Back</button>
            <button type="submit"
              class="px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition font-semibold">Send Notifications</button>
          </div>
        </form>
      </div>
    </div>
  </template>

<script setup>
import {ref} from 'vue'
import api from '@/services/api'
import { useFormStore } from '@/stores/form'

const isOpen = ref(true)
const monitoring = ref({
    solutions:'',
    details:'',
    reporter:'',
    reportedUser:'',
    cinReporter:'',
    cinReportedUser:'',
    startDate:'',
    endDate:'',
})

function closeModal(){
isOpen.value = false
}
const errors = ref({})

async function submitForm(){
    const loading = ref(false)
    const errorApi = ref(null)
const {valid,errors:formErrors}=useFormStore().validateForm(monitoring,[
'solutions','details:','reporter:','reportedUser','cinReporter','cinReportedUser','startDate','endDate'
])
errors.value = formErrors;
if (valid){
    loading.value = true
    try {
        await api.post('/monitoring', monitoring.value)
        loading.value = true
        alert('notification sent with success')
    } catch (error) {
        errorApi.value = error.response?.data?.message || 'An error occured while sending, please try again'
    }finally{
        loading.value = false
    }
}
}
loading.value = false
errorApi.value = null
</script>
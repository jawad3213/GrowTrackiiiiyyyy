<template>
    <div v-if="isOpen" class="fixed inset-0 bg-gray-900 bg-opacity-60 flex items-center justify-center z-50 font-inter">
      <div class="bg-white border-2 border-purple-500 rounded-2xl shadow-xl w-full max-w-md p-6 sm:p-8">
  
        <!-- Header -->
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-bold text-gray-900">Add Skill</h2>
          <button @click="closeModal" class="text-gray-500 hover:text-gray-800 text-2xl font-bold">&times;</button>
        </div>
  
        <!-- Form -->
        <form @submit.prevent="submitForm" class="space-y-4">
  
          <!-- Skill Name -->
          <div>
            <label class="font-semibold">Skill Name*</label>
            <input v-model="name" type="text" placeholder="Skill name"
              class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
              <p v-if="errors.name" class="text-red-500 text-xs mt-1">{{ errors.name }}</p>
          </div>
  
          <!-- Indicator 1 -->
          <div>
            <label class="font-semibold">Indicator 1*</label>
            <input v-model="indicator1" type="text" placeholder="First indicator"
              class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
              <p v-if="errors.indicator1" class="text-red-500 text-xs mt-1">{{ errors.indicator1 }}</p>
          </div>
  
          <!-- Indicator 2 -->
          <div>
            <label class="font-semibold">Indicator 2*</label>
            <input v-model="indicator2" type="text" placeholder="Second indicator"
              class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
              <p v-if="errors.indicator2" class="text-red-500 text-xs mt-1">{{ errors.indicator2 }}</p>
          </div>
  
          <!-- Indicator 3 -->
          <div>
            <label class="font-semibold">Indicator 3*</label>
            <input v-model="indicator3" type="text" placeholder="Third indicator"
              class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
              <p v-if="errors.indicator3" class="text-red-500 text-xs mt-1">{{ errors.indicator3 }}</p>
          </div>
  
          <!-- Skill Description -->
          <div>
            <label class="font-semibold">Skill description*</label>
            <textarea v-model="description" rows="3" placeholder="e.g. Description of the skill..."
              class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"></textarea>
              <p v-if="errors.description" class="text-red-500 text-xs mt-1">{{ errors.description }}</p>
          </div>
  
        <!-- Alertes -->
        <p v-if="formStore.error" class="text-red-500 text-sm mb-2 animate-pulse">{{ formStore.error }}</p>
        <p v-if="formStore.success" class="text-green-500 text-sm mb-2 animate-pulse">{{ formStore.success }}</p>
          
            <!-- Buttons -->
          <div class="flex justify-between pt-4">
            <button type="button"
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

const skill = ref({
  name:'',
  indicator1:'',
  indicator2:'',
  indicator3:'',
  description:''
});

function closeModal() {
  isOpen.value = false
};

const errors = ref({})

// Soumet le formulaire
async function submitForm() {
  const { valid, errors: formErrors } = formStore.validateForm(skill.value, [ 
    'name', 'indicator1', 'indicator2', 'indicator3', 'description'
  ])

  errors.value = formErrors

  if (!valid) return

  await formStore.submitForm('/addskill', skill.value, () => {
    closeModal()
  })
}
formStore.clearStatus()

</script>
  
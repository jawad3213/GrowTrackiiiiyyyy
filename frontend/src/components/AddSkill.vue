<template>
  <!-- Fond flou et gris clair -->
  <div v-if="isOpen" class="fixed inset-0 bg-gray-800/70 backdrop-blur-sm flex items-center justify-center z-50 font-inter">
    
    <!-- Conteneur du formulaire -->
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-8 relative">
      
      <!-- Bouton de fermeture -->
      <button @click="closeModal" class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl font-bold">
        &times;
      </button>

      <!-- Titre -->
      <h2 class="text-2xl font-bold mb-1 text-center">Add New Skill</h2>
      <p class="text-sm text-gray-600 mb-6 text-center">Fill in the skill and its indicators below</p>

      <!-- Formulaire -->
      <form @submit.prevent="submitForm" class="grid grid-cols-1 md:grid-cols-2 gap-4">

        <div class="md:col-span-2">
          <label class="font-semibold">Skill Name*</label>
          <input v-model="skill.name" type="text" placeholder="Skill name"
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500" />
          <p v-if="errors.name" class="text-red-500 text-xs mt-1">{{ errors.name }}</p>
        </div>

        <div>
          <label class="font-semibold">Indicator 1*</label>
          <input v-model="skill.indicator1" type="text" placeholder="First indicator"
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500" />
          <p v-if="errors.indicator1" class="text-red-500 text-xs mt-1">{{ errors.indicator1 }}</p>
        </div>

        <div>
          <label class="font-semibold">Indicator 2*</label>
          <input v-model="skill.indicator2" type="text" placeholder="Second indicator"
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500" />
          <p v-if="errors.indicator2" class="text-red-500 text-xs mt-1">{{ errors.indicator2 }}</p>
        </div>

        <div class="md:col-span-2">
          <label class="font-semibold">Indicator 3*</label>
          <input v-model="skill.indicator3" type="text" placeholder="Third indicator"
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500" />
          <p v-if="errors.indicator3" class="text-red-500 text-xs mt-1">{{ errors.indicator3 }}</p>
        </div>

        <div class="md:col-span-2">
          <label class="font-semibold">Skill Description*</label>
          <textarea v-model="skill.description" rows="3" placeholder="Description of the skill..."
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"></textarea>
          <p v-if="errors.description" class="text-red-500 text-xs mt-1">{{ errors.description }}</p>
        </div>

        <div class="md:col-span-2 flex justify-end items-center gap-4 mt-4">
          <button type="button" @click="closeModal"
            class="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100">Cancel</button>
          <button type="submit"
            class="px-6 py-2 text-white font-semibold bg-purple-600 hover:bg-purple-700 rounded-md shadow-md">
            Save
          </button>
        </div>

        <div class="md:col-span-2">
          <p v-if="formStore.error" class="text-red-500 text-sm mt-2 animate-pulse">{{ formStore.error }}</p>
          <p v-if="formStore.success" class="text-green-500 text-sm mt-2 animate-pulse">{{ formStore.success }}</p>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useFormStore } from '@/stores/form'
import { useRouter } from 'vue-router'

const formStore = useFormStore()
const router = useRouter()

const isOpen = ref(true)

const skill = ref({
  name: '',
  indicator1: '',
  indicator2: '',
  indicator3: '',
  description: ''
})

const errors = ref({})

function closeModal() {
  isOpen.value = false
  router.push('/Skills')
}

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

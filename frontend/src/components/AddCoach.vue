<template>
     <!-- FOND FLOU -->
  <div v-if="isOpen" class="fixed inset-0 bg-gray-800/70 backdrop-blur-sm flex items-center justify-center z-50 font-inter">

<!-- BOÎTE DU FORMULAIRE -->
<div class="bg-white border-2 border-purple-500 rounded-2xl shadow-2xl w-full max-w-2xl p-8 relative">

  <!-- Header -->
  <div class="flex items-center justify-between mb-4">
    <h2 class="text-2xl font-bold text-gray-900">Add Coach</h2>
    <button @click="closeModal" class="text-gray-500 hover:text-gray-800 text-2xl font-bold">&times;</button>
  </div>

  <!-- Form -->
  <form @submit.prevent="submitForm" class="space-y-5">

    <!-- Full Name + CIN -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label class="text-sm font-medium text-gray-700">Full name *</label>
        <input v-model="coach.name" type="text" placeholder="Full name"
          class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
          <span class="text-red-500 text-sm">{{ formStore.errors.name }}</span>
      </div>
      <div>
        <label class="text-sm font-medium text-gray-700">CIN *</label>
        <input v-model="coach.cin" type="password" placeholder="************"
          class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
          <span class="text-red-500 text-sm">{{ formStore.errors.cin }}</span>
        </div>
    </div>

<!-- Email -->
    <div>
      <label class="text-sm font-medium text-gray-700">Email</label>
      <input v-model="coach.email" type="email" placeholder="exemple@gmail.com"
        class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
        <span class="text-red-500 text-sm">{{ formStore.errors.email }}</span>
      </div>
      <!-- Password -->
        <div>

          <label class="font-semibold">Password*</label>
          <input v-model="coach.pass" type="password" placeholder="Enter a secure password"
            class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
            <span class="text-red-500 text-sm">{{ formStore.errors.pass }}</span>
        </div>
        <div class=" w-full"> <!-- Left padding 4, right padding 1 -->
              <button 
                type="button" 
                @click="generatePassword" 
                class="w-full py-2 font-semibold text-white rounded-md bg-gradient-to-r from-purple-600 to-orange-400 hover:from-purple-700 hover:to-orange-500 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed">
                Generate Password
              </button>
            </div>
    <!-- Field -->
    <div>
      <label class="text-sm font-medium text-gray-700">Field</label>
      <input v-model="coach.field" type="text" placeholder="Field"
        class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
        <span class="text-red-500 text-sm">{{ formStore.errors.field }}</span>
      </div>

    <!-- Admin Notes -->
    <div>
      <label class="text-sm font-medium text-gray-700">Admin notes</label>
      <textarea v-model="coach.note" rows="3" placeholder="e.g. I joined..."
        class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"></textarea>
        <span class="text-red-500 text-sm">{{ formStore.errors.notes }}</span>
      </div>

    <!-- Alertes -->
    <p v-if="formStore.error" class="text-red-500 text-sm animate-pulse">{{ formStore.error }}</p>
    <p v-if="formStore.success" class="text-green-500 text-sm animate-pulse">{{ formStore.success }}</p>

    <!-- Boutons -->
    <div class="flex justify-end gap-4 pt-6">
      <button type="button" @click="closeModal"
        class="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100">Cancel</button>
      <button
        type="submit"
        class="px-6 py-2 font-semibold text-white rounded-md bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 transition-all duration-300 transform hover:scale-105">
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
  import { useRouter } from 'vue-router'
  import coachSchema from '@/schemas/Coach.schema'
  import axios from 'axios'
  
  const formStore = useFormStore()
  const isOpen = ref(true)
  const router = useRouter()

  const coach = ref({
    name: '',
    cin: '',
    field: '',
    email: '',
    pass:'',
    note: ''
  })
  
  async function generatePassword(){
  try {
  const res = await axios.get('https://api.genratr.com/?length=16&uppercase&lowercase&numbers');
  const pass = res.data.password;
  coach.value.pass = pass;
  } catch (error) {
    console.log('Error occured while tryng to generate a password', error)
  }
}


  function closeModal() {
    isOpen.value = false
    router.push('/Coach')
  }
  
  async function submitForm() {
    try {
      const sanitizedData = formStore.sanitizeInputs(coach.value)
      console.log(sanitizedData)
      const valid = await formStore.validateWithSchema(sanitizedData,coachSchema)
      if (!valid) return
      await formStore.submitForm('/admin/coachs/create', sanitizedData, () => {
      closeModal()
    })
    router.push('/Coach')
    } catch (error) {
      console.error('Erreur lors de la connexion :', error)
    }
    
  }
  formStore.clearStatus()
  </script>
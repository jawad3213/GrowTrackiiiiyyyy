<template>
  <!-- Fond flou -->
  <div v-if="isOpen" class="fixed inset-0 bg-gray-800/70 backdrop-blur-sm flex items-center justify-center z-50 font-inter">

    <!-- Formulaire centré -->
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-8 relative border-2 border-purple-500">

      <!-- Header -->
      <div class="flex justify-between mb-6">
        <h2 class="text-xl font-bold text-gray-900">Add Field</h2>
        <button @click="closeModal" class="text-gray-500 hover:text-gray-800 text-2xl font-bold">&times;</button>
      </div>

      <!-- Form -->
      <form @submit.prevent="submitForm" class="space-y-5">

        <!-- Field name -->
        <div>
          <label class="block text-sm font-medium text-gray-700">Field name *</label>
          <input v-model="Field.field" type="text" placeholder="AP1, AP2, CI1..."
            class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
          <p v-if="errors.name" class="text-red-500 text-xs mt-1">{{ errors.name }}</p>
        </div>

        <!-- Field description -->
        <div>
          <label class="block text-sm font-medium text-gray-700">Field description</label>
          <textarea v-model="Field.description" rows="3" placeholder="e.g. Description of the Field"
            class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"></textarea>
        </div>

        <!-- Dynamic classe -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Add Class *</label>
          <div class="space-y-2">
            <div v-for="(cls, index) in Field.classe" :key="index" class="flex gap-2 items-center">
              <input v-model="Field.classe[index]" type="text" placeholder="e.g. GINF1"
                class="flex-1 px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
              <button v-if="index > 0" @click.prevent="removeClass(index)" type="button"
                class="text-red-500 hover:text-red-700 text-sm">✖</button>
            </div>
          </div>
          <button @click.prevent="addClass"
            class="mt-3 bg-orange-500 text-white text-sm px-4 py-1 rounded-md hover:bg-orange-600 transition">+ Add</button>
        </div>

        <!-- Alertes -->
        <p v-if="formStore.error" class="text-red-500 text-sm animate-pulse">{{ formStore.error }}</p>
        <p v-if="formStore.success" class="text-green-500 text-sm animate-pulse">{{ formStore.success }}</p>

        <!-- Boutons -->
        <div class="flex justify-end gap-4 pt-6">
          <button type="button" @click="closeModal"
            class="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100">Cancel</button>
          <button type="submit"
            class="px-6 py-2 font-semibold text-white bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 rounded-md shadow-md transition-all duration-300 transform hover:scale-105">
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
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'



const formStore = useFormStore()
const authStore = useAuthStore()
const router = useRouter()

const isOpen = ref(true)

const Field = ref({
  field: '',
  description: '',
  classe: [''],
  id_admin: authStore.ID
})

const errors = ref({})

function closeModal() {
  isOpen.value = false
  router.push('/Group')
}

function addClass() {
  Field.value.classe.push('')
}

function removeClass(index) {
  Field.value.classe.splice(index, 1)
}

  async function submitForm() {
    try {
      const sanitizedData = formStore.sanitizeInputs(Field.value)
      await formStore.submitForm('/admin/class/create', sanitizedData, () => {
      closeModal()
    })
    if(!formStore.errors){
    router.push('/Group')
  }
    } catch (error) {
      console.error('Erreur lors de la connexion :', error)
    }
    
  }
formStore.clearStatus()
</script>
<template>
  <!-- Fond flou -->
  <div class="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-gray-200/60 px-4 py-8 overflow-auto">

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
          <input v-model="field.name" type="text" placeholder="AP1, AP2, CI1..."
            class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
          <p v-if="errors.name" class="text-red-500 text-xs mt-1">{{ errors.name }}</p>
        </div>

        <!-- Field description -->
        <div>
          <label class="block text-sm font-medium text-gray-700">Field description</label>
          <textarea v-model="field.description" rows="3" placeholder="e.g. Description of the field"
            class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"></textarea>
        </div>

        <!-- Dynamic Classes -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Add Class *</label>
          <div class="space-y-2">
            <div v-for="(cls, index) in field.classes" :key="index" class="flex gap-2 items-center">
              <input v-model="field.classes[index]" type="text" placeholder="e.g. GINF1"
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

const formStore = useFormStore()
const emit = defineEmits(['fermer'])

const field = ref({
  name: '',
  description: '',
  classes: ['']
})

const errors = ref({})

function closeModal() {
  emit('fermer')
}

function addClass() {
  field.value.classes.push('')
}

function removeClass(index) {
  field.value.classes.splice(index, 1)
}

async function submitForm() {
  const { valid, errors: formErrors } = formStore.validateForm(field.value, ['name'])
  errors.value = formErrors
  if (!valid) return

  await formStore.submitForm('/addfield', field.value, () => {
    closeModal()
  })
}

formStore.clearStatus()
</script>

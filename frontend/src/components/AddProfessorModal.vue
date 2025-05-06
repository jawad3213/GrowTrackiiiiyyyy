<template>
  <!-- FOND FLOU -->
  <div class="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-gray-200/60 px-4 py-8 overflow-auto">
    
    <!-- FORMULAIRE CENTRÉ -->
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-3xl p-8 relative">
      
      <!-- Bouton Fermer -->
      <button @click="closeModal" class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl font-bold">
        &times;
      </button>

      <!-- Titre -->
      <h2 class="text-2xl font-bold mb-1 text-center">Add Professor</h2>
      <p class="text-sm text-gray-600 mb-6 text-center">Please fill in the professor's information</p>

      <!-- FORM -->
      <form @submit.prevent="submitForm" class="space-y-4">

        <!-- Nom + CIN -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="font-semibold">Full name*</label>
            <input v-model="prof.fullName" type="text" placeholder="Full name"
              class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
            <p v-if="errors.fullName" class="text-red-500 text-xs mt-1">{{ errors.fullName }}</p>
          </div>
          <div>
            <label class="font-semibold">CIN*</label>
            <input v-model="prof.cin" type="text" placeholder="CIN"
              class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
            <p v-if="errors.cin" class="text-red-500 text-xs mt-1">{{ errors.cin }}</p>
          </div>
        </div>

        <!-- Email + Password -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="font-semibold">Email*</label>
            <input v-model="prof.email" type="email" placeholder="you@company.com"
              class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
            <p v-if="errors.email" class="text-red-500 text-xs mt-1">{{ errors.email }}</p>
          </div>
          <div>
            <label class="font-semibold">Password*</label>
            <input v-model="prof.password" type="password" placeholder="Secure password"
              class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
            <p v-if="errors.password" class="text-red-500 text-xs mt-1">{{ errors.password }}</p>
          </div>
        </div>

        <!-- Department + Code -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="font-semibold">Department*</label>
            <select v-model="prof.department"
              class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
              <option>MATHS</option>
              <option>INFO</option>
              <option>BIO</option>
              <option>LOGE</option>
            </select>
            <p v-if="errors.department" class="text-red-500 text-xs mt-1">{{ errors.department }}</p>
          </div>
          <div>
            <label class="font-semibold">Educator Code*</label>
            <input v-model="prof.educatorCode" type="text" placeholder="ex: 323232"
              class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
            <p v-if="errors.educatorCode" class="text-red-500 text-xs mt-1">{{ errors.educatorCode }}</p>
          </div>
        </div>

        <!-- GROUPS -->
        <div>
          <label class="font-semibold">Assigned Groups*</label>
          <div v-for="(group, index) in prof.groups" :key="index" class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
            <div>
              <label class="text-sm font-medium">Level*</label>
              <select v-model="group.level"
                class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                <option>AP1</option><option>AP2</option><option>CI1</option><option>CI2</option><option>CI3</option>
              </select>
            </div>
            <div>
              <label class="text-sm font-medium">Field*</label>
              <select v-model="group.field"
                class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                <option disabled value="">-- Select field --</option>
                <option v-for="field in getFieldsForLevel(group.level)" :key="field" :value="field">{{ field }}</option>
              </select>
            </div>
            <div>
              <label class="text-sm font-medium">Module*</label>
              <input v-model="group.module" type="text" placeholder="Module name"
                class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
              <p v-if="errors.module" class="text-red-500 text-xs mt-1">{{ errors.module }}</p>
            </div>
          </div>
          <button @click="addgrp" type="button"
            class="mt-3 px-4 py-2 bg-orange-500 text-white rounded-md text-sm font-semibold">
            + Add
          </button>
        </div>

        <!-- Notes -->
        <div>
          <label class="font-semibold">Admin Notes</label>
          <textarea v-model="prof.notes" rows="3" placeholder="Notes..."
            class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"></textarea>
        </div>

        <!-- Alertes -->
        <p v-if="formStore.error" class="text-red-500 text-sm mt-2 animate-pulse">{{ formStore.error }}</p>
        <p v-if="formStore.success" class="text-green-500 text-sm mt-2 animate-pulse">{{ formStore.success }}</p>

        <!-- Boutons -->
        <div class="flex justify-end gap-4 pt-4">
          <button type="button" @click="closeModal"
            class="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100">Cancel</button>
          <button type="submit"
            class="px-6 py-2 text-white font-semibold bg-purple-600 hover:bg-purple-700 rounded-md shadow-md">
            Save
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

const fieldsByLevel = {
  AP: ['TD1', 'TD2', 'TD3'],
  CI: ['GINF', 'GSEA', 'CYS', 'GSR', 'GINL']
}

function getFieldsForLevel(level) {
  return level.startsWith('AP') ? fieldsByLevel.AP : fieldsByLevel.CI
}

const prof = ref({
  fullName: '',
  cin: '',
  email: '',
  password: '',
  department: 'INFO',
  educatorCode: '',
  groups: [{ level: 'AP1', field: 'GINF', module: '' }],
  notes: ''
})

function addgrp() {
  prof.value.groups.push({ level: 'AP1', field: 'GINF', module: '' })
}

function closeModal() {
  emit('fermer')
}

const errors = ref({})

async function submitForm() {
  const { valid, errors: formErrors } = formStore.validateForm(prof.value, [
    'fullName', 'cin', 'email', 'password', 'department', 'educatorCode'
  ])

  errors.value = formErrors
  if (!valid) return

  await formStore.submitForm('/addprof', prof.value, () => {
    closeModal()
  })
}

formStore.clearStatus()
</script>

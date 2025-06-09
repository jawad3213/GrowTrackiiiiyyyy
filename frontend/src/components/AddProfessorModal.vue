<template>
  <!-- Fond flou et sombre comme Add Student -->
  <div v-if="isOpen" class="fixed inset-0 bg-gray-800/70 backdrop-blur-sm flex items-center justify-center z-50 font-inter">
    
    <!-- Carte formulaire -->
    <div class="bg-white border-2 rounded-2xl shadow-xl w-full max-w-3xl p-6 sm:p-8 border-t-2 border-purple-500 relative">

      <!-- Header avec bouton fermer -->
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-2xl font-bold text-gray-900">Add Professor</h2>
        <button @click="closeModal" class="text-gray-500 hover:text-gray-800 text-2xl font-bold">&times;</button>
      </div>

      <p class="text-sm text-gray-600 mb-6 text-center">Please fill in the professor's information</p>

      <!-- FORM -->
      <form @submit.prevent="submitForm" class="space-y-4">

        <!-- Nom + CIN -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="font-semibold">Full name*</label>
            <input v-model="prof.name" type="text" placeholder="Full name"
              class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
            <p v-if="errors.name" class="text-red-500 text-xs mt-1">{{ errors.name }}</p>
          </div>
          <div>
            <label class="font-semibold">CIN*</label>
            <input v-model="prof.cin" type="text" placeholder="CIN"
              class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
            <p v-if="errors.cin" class="text-red-500 text-xs mt-1">{{ errors.cin }}</p>
          </div>
        </div>

        <!-- Email + pass -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="font-semibold">Email*</label>
            <input v-model="prof.email" type="email" placeholder="you@company.com"
              class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
            <p v-if="errors.email" class="text-red-500 text-xs mt-1">{{ errors.email }}</p>
          </div>
          <div>
            <label class="font-semibold">Password*</label>
            <input v-model="prof.pass" type="password" placeholder="Secure password"
              class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
            <p v-if="errors.pass" class="text-red-500 text-xs mt-1">{{ errors.pass}}</p>
          </div>
        </div>

        <!-- Département + code -->
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
            <input v-model="prof.code" type="text" placeholder="ex: 323232"
              class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
            <p v-if="errors.code" class="text-red-500 text-xs mt-1">{{ errors.code }}</p>
          </div>
        </div>

        <!-- Groupes -->
        <div>
          <label class="font-semibold">Assigned Classe*</label>
          <div v-for="(group, index) in prof.Classe" :key="index" class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
            <div>
              <label class="text-sm font-medium">Sector*</label>
              <select v-model="group.level" 
                class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                <option>AP1</option><option>AP2</option><option>CI1</option><option>CI2</option><option>CI3</option>
              </select>
            </div>
            <div>
              <label class="text-sm font-medium">Classe*</label>
              <select v-model="group.field"
                class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                <option disabled value="">-- Select field --</option>
                <option v-for="field in getFieldsForLevel(group.level)" :key="field" :value="field">{{ field }}</option>
              </select>
            </div>
            <div >
              <label class="text-sm font-medium">Course*</label>
              <input v-model="prof.course[index]" type="text" placeholder="course name"
                class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
              <p v-if="errors.course" class="text-red-500 text-xs mt-1">{{ errors.course }}</p>
            </div>
          </div>
          
          <button @click="addgrp" type="button"
            class="mt-3 px-4 py-2 bg-orange-500 text-white rounded-md text-sm font-semibold">
            + Add
          </button>
        </div>

        <!-- note -->
        <div>
          <label class="font-semibold">Admin Notes</label>
          <textarea v-model="prof.note" rows="3" placeholder="Notes..."
            class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"></textarea>
        </div>

        <!-- Alertes -->
        <p v-if="formStore.error" class="text-red-500 text-sm mt-2 animate-pulse">{{ formStore.error }}</p>
        <p v-if="formStore.success" class="text-green-500 text-sm mt-2 animate-pulse">{{ formStore.success }}</p>

        <!-- Boutons -->
        <div class="flex gap-4 p-5">
  <button
    type="button"
    @click="closeModal"
    class="flex-1 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
  >
    Cancel
  </button>

  <button
    type="submit"
    class="flex-1 py-2 font-semibold text-white rounded-md bg-gradient-to-r from-purple-600 to-orange-400 hover:from-purple-700 hover:to-orange-500 transition-all duration-300 transform hover:scale-105"
  >
    Confirm
  </button>
</div>

      </form>
    </div>
  </div>
</template>


<script setup>
import { ref , watch} from 'vue'
import { useFormStore } from '@/stores/form'
import { useRouter } from 'vue-router'

const formStore = useFormStore()
const router = useRouter()

const isOpen = ref(true)

const fieldsByLevel = {
  AP1: ['TD1', 'TD2', 'TD3'],
  AP2: ['TD4', 'TD5','TD6'],
  CI1: ['GINF1', 'GSEA1', 'CYS1', 'GSR1', 'GINL1'],
  CI2: ['GINF2', 'GSEA2', 'CYS2', 'GSR2', 'GINL2'],
  CI3: ['GINF3', 'GSEA3', 'CYS3', 'GSR3', 'GINL3']
}


function getFieldsForLevel(level) {
  switch (level) {
    case 'AP1': return fieldsByLevel.AP1;
      break;
    case 'AP2': return fieldsByLevel.AP2;
      break;
    case 'CI1': return fieldsByLevel.CI1;
      break;
    case 'CI2': return fieldsByLevel.CI2;
      break;
    case 'CI3': return fieldsByLevel.CI3;
      break;
    default:
      break;
  }
}

const prof = ref({
  name: '',
  cin: '',
  email: '',
  pass: '',
  department: 'INFO',
  code: '',
  course: [''],
  classe:[''],
  Classe: [{ level: 'AP1', field: 'GINF1' }],
  note: ''
})

// Watch for changes in Classe array and sync with classe
watch(() => prof.value.Classe, (newClasse) => {
  prof.value.classe = newClasse.map(item => item.field)
}, { deep: true })


function removeClass(index) {
  if (prof.value.Classe.length > 1) {
    prof.value.Classe.splice(index, 1)
    // Remove corresponding course entry
    prof.value.course.splice(index, 1)
  }
}

function addgrp() {
  prof.value.Classe.push({ level: 'AP1', field: 'GINF1' });
  prof.value.course.push()
}


function closeModal() {
  isOpen.value = false
  router.push('/Professor')
}

const errors = ref({})

async function submitForm() {
  const sanitizedData = formStore.sanitizeInputs(prof.value)

  console.log(prof.value)
  await formStore.submitForm('/admin/professors/create', sanitizedData, () => {
    closeModal()
  })
}

formStore.clearStatus()
</script>
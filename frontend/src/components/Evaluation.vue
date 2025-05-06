<template>
    <div class="fixed inset-0 bg-gray-900 bg-opacity-60 flex items-center justify-center z-50 font-inter">
      <div class="bg-white border-2 border-purple-500 rounded-2xl shadow-xl w-full max-w-2xl p-6 sm:p-8">
  
        <!-- Header -->
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-bold text-gray-900">Evaluation Details</h2>
          <button @click="closeModal" class="text-gray-500 hover:text-gray-800 text-2xl font-bold">&times;</button>
        </div>
  
        <!-- Form -->
        <form @submit.prevent="submitEvaluation" class="space-y-4">
  
          <!-- Noms + Rôles -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="font-semibold">Evaluator Name</label>
              <input v-model="form.evaluatorName" type="text" placeholder="Evaluator Name" class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-purple-500" />
            </div>
            <div>
              <label class="font-semibold">Evaluator Role</label>
              <input v-model="form.evaluatorRole" type="text" placeholder="Evaluator Role" class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-purple-500" />
            </div>
          </div>
  
          <!-- Évalué + Rôle -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="font-semibold">Evaluated Name</label>
              <input v-model="form.evaluatedName" type="text" placeholder="Evaluated Name" class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-purple-500" />
            </div>
            <div>
              <label class="font-semibold">Evaluated Role</label>
              <input v-model="form.evaluatedRole" type="text" placeholder="Evaluated Role" class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-purple-500" />
            </div>
          </div>
  
          <!-- Date + Type -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="font-semibold">Submitted Date</label>
              <input v-model="form.submittedDate" type="text" placeholder="Submitted Date" class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-purple-500" />
            </div>
            <div>
              <label class="font-semibold">Type</label>
              <input v-model="form.type" type="text" placeholder="Type" class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-purple-500" />
            </div>
          </div>
  
          <!-- Compétences et Scores -->
          <div v-for="(skill, index) in form.skills" :key="index" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="font-semibold">Skill</label>
              <input v-model="skill.name" type="text" placeholder="Skill Name" class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-purple-500" />
            </div>
            <div>
              <label class="font-semibold">Score</label>
              <input v-model="skill.score" type="text" placeholder="Score" class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-purple-500" />
            </div>
          </div>
  
          <!-- Commentaire -->
          <div>
            <label class="font-semibold">Evaluator Comment</label>
            <textarea v-model="form.comment" rows="3" placeholder="e.g. I joined..." class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-purple-500"></textarea>
          </div>
  
          <!-- Bouton Retour -->
          <div class="pt-4">
            <button type="button" @click="submitForm" class="w-full py-2 font-semibold text-white rounded-md bg-purple-600 hover:bg-purple-700 transition-all duration-300">
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
  
  const isOpen = ref(true)
  const form = ref({
    evaluatorName: '',
    evaluatorRole: '',
    evaluatedName: '',
    evaluatedRole: '',
    submittedDate: '',
    type: '',
    comment: '',
    skills: [
      { name: 'COMMUNICATION', score: '5' },
      { name: 'Public Speaking', score: '4' },
      { name: 'Team Work', score: '3.5' }
    ]
  })
  
  function closeModal() {
    isOpen.value = false
  }
  const errors = ref({})

async function submitForm() {
  const { valid, errors: formErrors } = useFormStore.validateForm(form.value, [
    'evaluatorName', 'evaluatorRole', 'evaluatedName', 'evaluatedRole', 'submittedDate', 'type','skills'
  ])

  errors.value = formErrors
  if (!valid) return

  await useFormStore.submitForm('/evaluation', form.value, () => {
    closeModal()
  })
}
useFormStore().clearStatus()
  </script>
  
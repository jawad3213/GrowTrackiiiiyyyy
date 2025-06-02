<template>
  <!-- Fond flou -->
  <div class="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-gray-200/60 px-4 py-8 overflow-auto font-inter">

    <!-- Carte centrale -->
    <div class="bg-white border-2 border-purple-500 rounded-2xl shadow-2xl w-full max-w-3xl p-8 relative">

      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-xl font-bold text-gray-900">Evaluation Details</h2>
        <button @click="closeModal" class="text-gray-500 hover:text-gray-800 text-2xl font-bold">&times;</button>
      </div>

      <!-- Formulaire de détails -->
      <form @submit.prevent class="space-y-6">

        <!-- Évaluateur -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="font-semibold">Evaluator Name</label>
            <p class="border rounded-md px-4 py-2 bg-gray-50">{{ data.evaluator_full_name }}</p>
          </div>
          <div>
            <label class="font-semibold">Evaluator Role</label>
            <p class="border rounded-md px-4 py-2 bg-gray-50">{{ data.evaluatorRole }}</p>
          </div>
        </div>

        <!-- Évalué -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="font-semibold">Evaluated Name</label>
            <p class="border rounded-md px-4 py-2 bg-gray-50">{{ data.evaluatedName }}</p>
          </div>
          <div>
            <label class="font-semibold">Evaluated Role</label>
            <p class="border rounded-md px-4 py-2 bg-gray-50">{{ data.evaluatedRole }}</p>
          </div>
        </div>

        <!-- Date & Type -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="font-semibold">Submitted Date</label>
            <p class="border rounded-md px-4 py-2 bg-gray-50">{{ data.submittedDate }}</p>
          </div>
          <div>
            <label class="font-semibold">Type</label>
            <p class="border rounded-md px-4 py-2 bg-gray-50">{{ data.type }}</p>
          </div>
        </div>

        <!-- Compétences -->
        <div v-for="(skill, index) in form.skills" :key="index" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="font-semibold">Skill</label>
            <p class="border rounded-md px-4 py-2 bg-gray-50">{{ skill.name }}</p>
          </div>
          <div>
            <label class="font-semibold">Score</label>
            <p class="border rounded-md px-4 py-2 bg-gray-50">{{ skill.score }}</p>
          </div>
        </div>

        <!-- Commentaire -->
        <div>
          <label class="font-semibold">Evaluator Comment</label>
          <p class="border rounded-md px-4 py-2 bg-gray-50 whitespace-pre-line">{{ data.comment }}</p>
        </div>

        <!-- Bouton retour -->
        <div class="pt-6">
          <button type="button" @click="closeModal"
            class="w-full py-2 font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-md transition-all duration-300">
            Return
          </button>
        </div>

      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import api from '@/services/api'

const props = defineProps({ id: Number })
const emit = defineEmits(['fermer'])

const data = ref({})
const form = ref({ skills: [] })
const loading = ref(false)
const error = ref(null)

function closeModal() {
  emit('fermer')
}

watch(() => props.id, fetchData, { immediate: true })

async function fetchData() {
  if (!props.id) return
  loading.value = true
  try {
    const res = await api.get(`/api/GlobalOverView/search_by_id_evaluation/${props.id}`)
    console.log(res.data.result)
    data.value = res.data.result
    form.value.skills = res.data.result || []
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to fetch evaluation.'
  } finally {
    loading.value = false
  }
}
</script>



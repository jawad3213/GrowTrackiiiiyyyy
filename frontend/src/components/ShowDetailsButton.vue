<template>
  <div>
    <button
      @click="open"
      class="text-purple-600 hover:text-purple-900 font-semibold"
    >
      See Details
    </button>

    <teleport to="body">
      <div
        v-if="show"
        ref="modalContent"
        class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 font-inter p-6"
      >
        <div class="relative bg-white w-full max-w-xl max-h-[90vh] p-10 rounded-3xl border-4 border-purple-500 shadow-2xl overflow-y-auto space-y-8 animate-slide-up-fade">
          <!-- Close Icon -->
          <button
            @click="close"
            aria-label="Close"
            class="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:hover:text-gray-300 text-2xl font-bold"
          >
            &times;
          </button>

          <!-- Title Block -->
          <div class="text-center space-y-2">
            <h2 class="text-purple-600 text-lg font-semibold">Evaluation Details</h2>
            <h1 class="flex items-center justify-center text-4xl font-extrabold space-x-4">
              <span>Evaluation</span>
              <span class="bg-gradient-to-r from-purple-600 to-orange-500 text-white px-4 py-1 rounded-lg">
                #{{ data.evaluation.id_evaluation }}
              </span>
            </h1>
          </div>

          <div class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Evaluator</label>
                <input
                  type="text"
                  v-model="data.evaluation.evaluator_full_name"
                  disabled
                  class="w-full border-2 border-gray-200 focus:border-purple-500 rounded-lg p-2 bg-gray-50 transition-colors duration-200"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Student</label>
                <input
                  type="text"
                  v-model="data.evaluation.student_full_name"
                  disabled
                  class="w-full border-2 border-gray-200 focus:border-purple-500 rounded-lg p-2 bg-gray-50 transition-colors duration-200"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="text"
                :value="new Date(data.evaluation.date_add).toLocaleString()"
                disabled
                class="w-full border-2 border-gray-200 focus:border-purple-500 rounded-lg p-2 bg-gray-50 transition-colors duration-200"
              />
            </div>

            <fieldset class="border-t border-gray-200 pt-4">
              <legend class="text-lg font-semibold mb-2">Skills</legend>
              <div
                v-for="skill in data.evaluation.skills"
                :key="skill.skill_name"
                class="flex items-center justify-between mb-3 animate-slide-up-fade"
                :style="{ 'animation-delay': `${skill.skill_name.length * 50}ms` }"
              >
                <span class="font-medium text-gray-800">{{ skill.skill_name }}</span>
                <input
                  type="number"
                  step="0.01"
                  v-model.number="skill.note_skill"
                  class="w-20 border-2 border-gray-200 rounded-lg p-1 text-center"
                  disabled
                />
              </div>
            </fieldset>
          </div>

          <div>
            <button
              @click="close"
              type="button"
              class="w-full py-3 text-white text-lg font-semibold rounded-full shadow-lg transition-transform duration-200 hover:shadow-xl hover:scale-105 bg-gradient-to-r from-purple-600 to-orange-500"
            >
              Back
            </button>
          </div>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import api from '@/services/api'

const props = defineProps({
  id: { type: Number, required: true }
})

const show = ref(false)
const data = ref({
  number: null,
  evaluation: {
    id_evaluation: null,
    evaluator_full_name: '',
    student_full_name: '',
    date_add: '',
    skills: []
  }
})

async function open() {
  try {
    const res = await api.get(`/api/GlobalOverView/search_by_id_evaluation/${props.id}`)
    data.value = res.data
    show.value = true
    const newUrl = `${location.pathname}?evaluationId=${props.id}`
    window.history.replaceState(null, '', newUrl)
  } catch (err) {
    console.error(err)
    alert('Could not load evaluation details.')
  }
}

function close() {
  show.value = false
  window.history.replaceState(null, '', location.pathname)
}
</script>

<style scoped>
@keyframes slide-up-fade {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}
.animate-slide-up-fade { animation: slide-up-fade 0.4s ease-out forwards; }

details summary { outline: none; }
details summary:hover { background-color: #e5d4fd; }
</style>

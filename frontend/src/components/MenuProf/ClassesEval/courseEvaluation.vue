<template>
  <div class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 font-inter p-6">
    <div
      class="
        relative
        bg-white w-full max-w-xl
        max-h-[90vh]
        p-10
        rounded-3xl
        border-4 border-purple-500
        shadow-2xl
        overflow-y-auto
        space-y-8
      "
    >
      <!-- Close Icon -->
      <button
        @click="cancelEvaluation"
        class="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:hover:text-gray-300 text-2xl font-bold"
        aria-label="Close evaluation"
      >
        &times;
      </button>

      <!-- Title Block -->
      <div class="text-center space-y-2">
        <h2 class="text-purple-600 text-lg font-semibold">
          {{ evaluationType === 'project' ? 'Project Evaluation' : 'Course Evaluation' }}
        </h2>
        <h1 class="flex items-center justify-center text-4xl font-extrabold space-x-4">
          <span>Give your</span>
          <span class="bg-gradient-to-r from-purple-600 to-orange-500 text-white px-4 py-1 rounded-lg">
            Feedback
          </span>
        </h1>
      </div>

      <!-- Step Indicator -->
      <div v-if="skills.length" class="text-center">
        <p class="text-sm uppercase text-gray-500 mb-2">
          Step {{ currentSkillIndex + 1 }} of {{ skills.length }}
        </p>
        <h3 class="text-2xl font-bold tracking-wide">
          {{ currentSkill.name }}
        </h3>
      </div>

      <!-- Questions -->
      <div v-if="currentSkill.questions.length" class="space-y-6">
        <div
          v-for="(q, index) in currentSkill.questions"
          :key="index"
          class="space-y-2 animate-slide-up-fade"
          :style="{ 'animation-delay': `${index * 100}ms` }"
        >
          <p class="text-gray-700 font-medium">{{ q }}</p>
          <input
            type="range"
            min="0"
            max="5"
            step="0.1"
            v-model.number="ratings[index]"
            class="w-full h-2 bg-gray-200 rounded-lg accent-purple-500"
          />
          <p class="text-right text-sm font-semibold text-purple-600">
            {{ ratings[index] }}
          </p>
        </div>
      </div>

      <!-- Comment -->
      <div v-if="currentSkillIndex === skills.length - 1" class="space-y-2">
        <label class="block text-gray-700 font-semibold">Additional Comments (optional)</label>
        <textarea
          v-model="comment"
          rows="4"
          class="w-full border-2 border-gray-200 focus:border-purple-500 rounded-lg p-4 text-gray-800 placeholder-gray-400 transition-colors duration-200"
          placeholder="Anything else you’d like to share?"
        ></textarea>
      </div>

      <!-- Navigation Buttons -->
      <div class="flex justify-between space-x-4 mt-6">
        <button
          v-if="currentSkillIndex > 0"
          @click="prevSkill"
          class="flex-1 py-3 text-white text-lg font-semibold rounded-full shadow-lg transition-transform duration-200 hover:shadow-xl hover:scale-105 bg-gradient-to-r from-purple-600 to-orange-500"
        >
          Previous
        </button>
        <button
          @click="nextSkill"
          class="flex-1 py-3 text-white text-lg font-semibold rounded-full shadow-lg transition-transform duration-200 hover:shadow-xl hover:scale-105 bg-gradient-to-r from-purple-600 to-orange-500"
        >
          {{ currentSkillIndex === skills.length - 1 ? 'Submit Evaluation' : 'Next Skill' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useFormStore } from '@/stores/form'

const route = useRoute()
const router = useRouter()
const formStore = useFormStore()

// Determine evaluation type and student ID
const evaluationType = computed(() => route.query.type || 'course')
const studentId = route.query.id

// Ordered skills list
const hardCodedSkills = [
  { name: 'Teamwork', questions: [
      'Does this person collaborate effectively with teammates?',
      'Are they open to others ideas and feedback?',
      'Do they support the team in achieving common goals?'
    ]
  },
  { name: 'Problem-Solving', questions: [
      'Does this person approach problems calmly and analytically?',
      'Do they contribute useful solutions when challenges arise?',
      'Are they willing to seek help or input when needed?'
    ]
  },
  { name: 'Time Management', questions: [
      'Does this person prioritize tasks effectively to meet deadlines?',
      'Does this person allocate time appropriately across multiple responsibilities?',
      'Does this person avoid unnecessary delays or procrastination?'
    ]
  },
  { name: 'Critical Thinking', questions: [
      'Does this person analyze information carefully before forming conclusions?',
      'Does this person question assumptions or challenge ideas constructively?',
      'Does this person evaluate the strengths and weaknesses of arguments or solutions?'
    ]
  },
  { name: 'Creativity', questions: [
      'Does this person generate original or innovative ideas?',
      'Does this person approach tasks with imagination or out-of-the-box thinking?',
      'Does this person explore multiple possibilities before settling on a solution?'
    ]
  },
  { name: 'Communication', questions: [
      'Does this person express their ideas clearly and understandably?',
      'Do they listen actively and let others finish speaking?',
      'Do they adapt their communication style depending on the audience?'
    ]
  }
]

// Reactive state
const skills = ref(hardCodedSkills)
const currentSkillIndex = ref(0)
const currentSkill = computed(() => skills.value[currentSkillIndex.value] || { name: '', questions: [] })

// Initialize ratings storage
const ratings = ref(Array(currentSkill.value.questions.length).fill(0))
const allRatings = ref(skills.value.map(s => Array(s.questions.length).fill(0)))
const comment = ref('')

// Navigate previous
function prevSkill() {
  allRatings.value[currentSkillIndex.value] = [...ratings.value]
  if (currentSkillIndex.value > 0) {
    currentSkillIndex.value--
    ratings.value = [...allRatings.value[currentSkillIndex.value]]
  }
}

// Cancel / close evaluation
function cancelEvaluation() {
  router.back()
}

// Advance or submit using formStore
async function nextSkill() {
  allRatings.value[currentSkillIndex.value] = [...ratings.value]

  if (currentSkillIndex.value < skills.value.length - 1) {
    currentSkillIndex.value++
    ratings.value = Array(skills.value[currentSkillIndex.value].questions.length).fill(0)
  } else {
    // Build payload exactly as before
    const payload = {}
    skills.value.forEach((s, i) => {
      payload[`skill${i+1}`] = s.name
      s.questions.forEach((_, j) => {
        payload[`rate${j+1}_skill${i+1}`] = allRatings.value[i][j]
      })
    })
    payload.comment = comment.value

    // Submit Evaluation: link directly to POST
    await formStore.submitForm(
      `/api/prof_evaluation_classes/new_evaluation/${studentId}`,
      payload
    )
    if (!formStore.errors) {
      router.push('/ClassesEval')
    }
  }
}
</script>

<style scoped>
@keyframes slide-up-fade {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}
.animate-slide-up-fade {
  animation: slide-up-fade 0.4s ease-out forwards;
}
</style>

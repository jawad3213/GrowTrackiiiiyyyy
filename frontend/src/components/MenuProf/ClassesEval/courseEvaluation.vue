<template>
    <div class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 font-inter">
      <div class="bg-white w-[500px] h-[600px] p-8 rounded-xl shadow-xl relative overflow-y-auto">
        <div class="text-center mb-6">
          <h2 class="text-purple-600 text-lg font-semibold mb-7">
            {{ evaluationType === 'project' ? 'Project Evaluation' : 'Course Evaluation' }}
          </h2>
          <h1 class="text-4xl font-bold">
            Give your <span class="bg-orange-500 text-white px-2 rounded">Feedback</span>
          </h1>
        </div>
        <div v-if="skills.length > 0" class="mb-4">
          <p class="text-sm text-purple-600 font-semibold mb-4">
            Step {{ currentSkillIndex + 1 }}/{{ skills.length }}
          </p>
          <h3 class="text-lg font-bold uppercase">{{ currentSkill.name }}</h3>
        </div>
        <div v-if="currentSkill.questions.length > 0">
          <div v-for="(q, index) in currentSkill.questions" :key="index" class="mb-4">
            <p>{{ q }}</p>
            <input type="range" min="0" max="5" step="0.1" v-model="ratings[index]" class="w-full" />
            <p class="text-center text-sm mt-1">{{ ratings[index] }}</p>
          </div>
        </div>
        <div v-if="currentSkillIndex === skills.length - 1" class="mb-4">
          <label class="block font-semibold mb-1">Comment (optional)</label>
          <textarea v-model="comment" class="w-full border rounded p-2" rows="2" />
        </div>
        <button @click="nextSkill" class="w-full py-2 mt-4 bg-purple-600 text-white font-semibold rounded">
          {{ currentSkillIndex === skills.length - 1 ? 'Submit Evaluation' : 'Next Skill' }}
        </button>
      </div>
    </div>
  </template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const router = useRouter()
const evaluationType = computed(() => route.query.type || 'course')
const studentId = route.query.id 

const hardCodedSkills = [
  {
    name: 'Communication',
    questions: [
      'Does this person express their ideas clearly and understandably?',
      'Do they listen actively and let others finish speaking?',
      'Do they adapt their communication style depending on the audience?'
    ]
  },
  {
    name: 'Teamwork',
    questions: [
      'Does this person collaborate effectively with teammates?',
      'Are they open to others ideas and feedback?',
      'Do they support the team in achieving common goals?'
    ]
  },
  {
    name: 'Problem-solving',
    questions: [
      'Does this person approach problems calmly and analytically?',
      'Do they contribute useful solutions when challenges arise?',
      'Are they willing to seek help or input when needed?'
    ]
  },
  {
    name: 'Time Management',
    questions: [
      'Does this person prioritize tasks effectively to meet deadlines?',
      'Does this person allocate time appropriately across multiple responsibilities?',
      'Does this person avoid unnecessary delays or procrastination?'
    ]
  },
  {
    name: 'Critical Thinking',
    questions: [
      'Does this person analyze information carefully before forming conclusions?',
      'Does this person question assumptions or challenge ideas constructively?',
      'Does this person evaluate the strengths and weaknesses of arguments or solutions?'
    ]
  },
  {
    name: 'Creativity',
    questions: [
      'Does this person generate original or innovative ideas?',
      'Does this person approach tasks with imagination or out-of-the-box thinking?',
      'Does this person explore multiple possibilities before settling on a solution?'
    ]
  }
]
const skills = ref(hardCodedSkills)
const currentSkillIndex = ref(0)
const currentSkill = computed(() => skills.value[currentSkillIndex.value])
const ratings = ref([0, 0, 0])
const allRatings = ref([[], [], [], [], [], []])
const comment = ref('')

const nextSkill = async () => {
  // Stocke les notes pour ce skill
  allRatings.value[currentSkillIndex.value] = [...ratings.value]
  if (currentSkillIndex.value < skills.value.length - 1) {
    currentSkillIndex.value++
    ratings.value = [0, 0, 0]
  } else {
    // Prépare le payload pour le backend
    const payload = {
      skill1: skills.value[0].name,
      rate1_skill1: allRatings.value[0][0],
      rate2_skill1: allRatings.value[0][1],
      rate3_skill1: allRatings.value[0][2],
      skill2: skills.value[1].name,
      rate1_skill2: allRatings.value[1][0],
      rate2_skill2: allRatings.value[1][1],
      rate3_skill2: allRatings.value[1][2],
      skill3: skills.value[2].name,
      rate1_skill3: allRatings.value[2][0],
      rate2_skill3: allRatings.value[2][1],
      rate3_skill3: allRatings.value[2][2],
      skill4: skills.value[3].name,
      rate1_skill4: allRatings.value[3][0],
      rate2_skill4: allRatings.value[3][1],
      rate3_skill4: allRatings.value[3][2],
      skill5: skills.value[4].name,
      rate1_skill5: allRatings.value[4][0],
      rate2_skill5: allRatings.value[4][1],
      rate3_skill5: allRatings.value[4][2],
      skill6: skills.value[5].name,
      rate1_skill6: allRatings.value[5][0],
      rate2_skill6: allRatings.value[5][1],
      rate3_skill6: allRatings.value[5][2],
      comment: comment.value
    }
    try {
      const token = localStorage.getItem('token')
      await axios.post(
        `/api/prof_evaluation_classes/new_evaluation/${studentId}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      router.push('/EndEval')
    } catch (err) {
      alert('Erreur lors de la soumission de l\'évaluation.')
      console.error(err)
    }
  }
}
</script>

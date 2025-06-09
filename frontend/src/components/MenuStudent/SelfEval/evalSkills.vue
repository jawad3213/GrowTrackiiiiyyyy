<template>
  <div class="fixed inset-0 bg-gray-500 dark:bg-gray-900 flex items-center justify-center z-50 font-inter">
    <div class="bg-white w-[550px] h-[600px] p-8 rounded-xl shadow-xl relative overflow-y-auto">

      <!-- Header -->
      <div class="text-center mb-6">
        <h2 class="text-purple-600 text-lg font-semibold mb-7">Course Evaluation</h2>
        <h1 class=" text-4xl font-bold">Give your <span class="bg-orange-500 text-white px-2 rounded">Feedback</span></h1>
      </div>

      <!-- Skill and Step -->
      <div v-if="skills.length > 0" class="mb-4">
        <p class="text-sm text-purple-600 font-semibold mb-4">Step {{ currentSkillIndex + 1 }}/{{ skills.length }}</p>
        <h3 class="text-lg font-bold uppercase">{{ currentSkill }}</h3>
      </div>

      <!-- Questions -->
      <div v-if="questions.length > 0">
        <div v-for="(q, index) in questions" :key="index" class="mb-4">
          <p>{{ q.text }}</p>
          <input type="range" min="0" max="5" step="0.1" v-model="ratings[index]" class="w-full" />
          <p class="text-center text-sm mt-1">{{ ratings[index] }}</p>
        </div>
      </div>

      <!-- Comment box for the last skill -->
      <div v-if="currentSkillIndex === skills.length - 1" class="mb-4">
        <label class="block mb-2 font-semibold">Comment (optional):</label>
        <textarea v-model="comment" class="w-full border rounded p-2" rows="3"></textarea>
      </div>

      <!-- Next button -->
      <button @click="nextSkill" class="w-full py-2 mt-4 bg-purple-600 text-white font-semibold rounded">
        {{ currentSkillIndex === skills.length - 1 ? 'Submit Evaluation' : 'Next Skill' }}
      </button>
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted, computed } from 'vue'
import api from '@/services/api'
import { useRouter } from 'vue-router'


const router = useRouter()

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

const skills = ref(hardCodedSkills.map(s => s.name))
const currentSkillIndex = ref(0)
const currentSkill = computed(() => skills.value[currentSkillIndex.value])
const questions = computed(() => hardCodedSkills[currentSkillIndex.value].questions)
const ratings = ref([0, 0, 0])
const allRatings = ref([]) // Pour stocker les notes de chaque compétence
const comment = ref('')

onMounted(async () => {
  // Chargement initial, aucune requête API nécessaire avec les compétences codées en dur
})

// Passer à la compétence suivante
const nextSkill = () => {
  // Stocker les notes pour la compétence courante
  allRatings.value[currentSkillIndex.value] = [...ratings.value]
  // Réinitialiser les sliders
  ratings.value = [0, 0, 0]
  if (currentSkillIndex.value < skills.value.length - 1) {
    currentSkillIndex.value++
  } else {
    submitEvaluation()
  }
}

const submitEvaluation = async () => {
  // Vérification : toutes les notes doivent être renseignées
  for (let i = 0; i < allRatings.value.length; i++) {
    if (
      !Array.isArray(allRatings.value[i]) ||
      allRatings.value[i].length !== 3 ||
      allRatings.value[i].some(r => r === 0 || r === null || r === undefined)
    ) {
      alert(`Please rate all questions for the skill "${skills.value[i]}" before submitting.`);
      return;
    }
  }

  const token = localStorage.getItem('token')
  const body = {
    skill1: skills.value[0],
    rate1_skill1: allRatings.value[0][0],
    rate2_skill1: allRatings.value[0][1],
    rate3_skill1: allRatings.value[0][2],
    skill2: skills.value[1],
    rate1_skill2: allRatings.value[1][0],
    rate2_skill2: allRatings.value[1][1],
    rate3_skill2: allRatings.value[1][2],
    skill3: skills.value[2],
    rate1_skill3: allRatings.value[2][0],
    rate2_skill3: allRatings.value[2][1],
    rate3_skill3: allRatings.value[2][2],
    skill4: skills.value[3],
    rate1_skill4: allRatings.value[3][0],
    rate2_skill4: allRatings.value[3][1],
    rate3_skill4: allRatings.value[3][2],
    skill5: skills.value[4],
    rate1_skill5: allRatings.value[4][0],
    rate2_skill5: allRatings.value[4][1],
    rate3_skill5: allRatings.value[4][2],
    skill6: skills.value[5],
    rate1_skill6: allRatings.value[5][0],
    rate2_skill6: allRatings.value[5][1],
    rate3_skill6: allRatings.value[5][2],
    comment: comment.value
  }
  try {
    await api.post('/api/student_evaluation_byself/new_evaluation', body, {
      headers: { Authorization: `Bearer ${token}` }
    })
    console.log('Evaluation submitted successfully:', body)
    router.push('/end')
  } catch (err) {
    console.log('Error submitting evaluation: ' + (err.response?.data?.message || err.message))
  }
}
</script>

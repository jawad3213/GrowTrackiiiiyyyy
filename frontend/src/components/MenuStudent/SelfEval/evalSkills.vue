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

      <!-- Next button -->
      <button @click="nextSkill" class="w-full py-2 mt-4 bg-purple-600 text-white font-semibold rounded">
        Next Skill
      </button>
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()

const skillId = ref(null) // pas utilisé ici mais tu peux le garder si besoin
const skills = ref([])         // Liste des compétences uniques
const questions = ref([])      // Questions actuelles pour la compétence en cours
const ratings = ref([0, 0, 0]) // Valeurs pour les 3 sliders
const currentSkillIndex = ref(0)
const currentSkill = ref('')

onMounted(async () => {
  try {
    const res = await axios.get('http://localhost:3001/questions')

    // Extraire les noms uniques des compétences
    const skillMap = new Map()
    res.data.forEach(q => {
      if (!skillMap.has(q.skill)) {
        skillMap.set(q.skill, [])
      }
      skillMap.get(q.skill).push({ ...q, rating: 0 })
    })

    // Mettre à jour les compétences (noms)
    skills.value = Array.from(skillMap.keys())
    currentSkill.value = skills.value[currentSkillIndex.value]

    // Charger les questions de la première compétence
    questions.value = skillMap.get(currentSkill.value)
  } catch (err) {
    console.error('Erreur lors du chargement des questions', err)
  }
})

// Passer à la compétence suivante
const nextSkill = async () => {
  const answers = questions.value.map((q, i) => ({
    skill: currentSkill.value,
    question: q.text,
    rating: ratings.value[i] ?? 0
  }))

  await axios.post('http://localhost:3001/answers', {
    skill: currentSkill.value,
    answers
  })

  // Passer à la compétence suivante
  if (currentSkillIndex.value < skills.value.length - 1) {
    currentSkillIndex.value++
    currentSkill.value = skills.value[currentSkillIndex.value]

    const res = await axios.get(`http://localhost:3001/questions?skill=${currentSkill.value}`)
    questions.value = res.data
    ratings.value = Array(questions.value.length).fill(0)
  } else {
    router.push('/skillsEnd')
  }
}
</script>

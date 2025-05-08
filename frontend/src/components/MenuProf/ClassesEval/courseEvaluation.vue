<template>
    <div class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 font-inter">
      <div class="bg-white w-[500px] h-[600px] p-8 rounded-xl shadow-xl relative overflow-y-auto">
  
        <!-- Header -->
        <div class="text-center mb-6">
          <h2 class="text-purple-600 text-lg font-semibold mb-7">Course Evaluation</h2>
          <h1 class=" text-4xl font-bold">Gives your <span class="bg-orange-500 text-white px-2 rounded">Feedback</span></h1>
        </div>
  
        <!-- Step & Skill -->
        <div v-if="skills.length > 0" class="mb-4">
          <p class="text-sm text-purple-600 font-semibold mb-4">Step {{ currentSkillIndex + 1 }}/{{ skills.length }}</p>
          <h3 class="text-lg font-bold uppercase">{{ currentSkill }}</h3>
        </div>
          
        <!-- Questions -->
        <div v-if="questions.length > 0">
  <div v-for="(q, index) in questions" :key="index" class="mb-4">
    <p>Question {{ index + 1 }}</p>
    <input type="range" min="0" max="5" step="0.1" v-model="ratings[index]" class="w-full" />
    <p class="text-center text-sm mt-1">{{ ratings[index] }}</p>
  </div>
</div>

  
        <!-- Bouton -->
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

const skills = ref([])
const currentSkillIndex = ref(0)
const currentSkill = ref('')
const questions = ref([])
const ratings = ref([0, 0, 0])
const skillId = ref('') // si besoin pour POST

// Charger les compétences
onMounted(async () => {
  try {
    const { data } = await axios.get('http://localhost:3001/SkillsChoosen')
    
    const latest = data.reverse().find(item => item.skills && item.skills.length > 0) //prends toujours le dernier enregistrement valide.
    if (latest) {
      skills.value = latest.skills
      skillId.value = latest.id
      await loadSkill()
      console.log('hoooooooola')
    } else {
      console.warn("❌ Aucune compétence trouvée dans /SkillsChoosen")
    }
  } catch (error) {
    console.error("Erreur chargement SkillsChoosen:", error)
  }
})


// Charger les questions d'une compétence
const loadSkill = async () => {
  const skillName = skills.value[currentSkillIndex.value]  // Récupère le nom du skill
  const res = await axios.get(`http://localhost:3001/questions?skill=${skillName}`)
  console.log('helooooooooooooo')
  questions.value = res.data                               // Charge les questions
  currentSkill.value = skillName                           // Met à jour le nom du skill à la fin
  ratings.value = [0, 0, 0]                                // Réinitialise les notes
}


// Sauvegarder et passer à la compétence suivante

const nextSkill = async () => {
  const answers = questions.value.map((q, i) => ({
    skill: currentSkill.value,
    question: q.text || `Question ${i + 1}`,
    rating: ratings.value[i],
  }))

  await axios.post('http://localhost:3001/answers', {
    skillId: skillId.value,
    skill: currentSkill.value,
    answers
  })

  if (currentSkillIndex.value < skills.value.length - 1) {
    currentSkillIndex.value++
    await loadSkill()
  } else {
    // ✅ Redirection vers la page de récapitulation
    router.push('/EndEval')
  }
}


</script>

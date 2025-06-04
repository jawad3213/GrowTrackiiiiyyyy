<template>
    <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl shadow-2xl p-8 max-w-3xl w-full relative">
        
        <!-- Bouton Fermer -->
        <button @click="closeModal" class="text-gray-500 ml-170 hover:text-gray-800 text-2xl font-bold">&times;</button>

  
        <!-- Titre -->
        <h2 class="text-5xl mt-10 font-bold mb-2 text-center">
          Choose your evaluation <span class="bg-orange-500 text-white px-2 py-1 rounded">Skills</span>
        </h2>
  
        <!-- Liste des compétences -->
        <div class="mt-14 ml-20 text-xl">
          <p class="font-semibold mb-4">Choose your Evaluation Skills:</p>
          <div v-for="skill in skills" :key="skill.id" class="flex items-center mb-2">
            <input type="checkbox" :id="skill.id" :value="skill.name" v-model="selectedSkills" class="mr-2" />
            <label :for="skill.id" class="text-gray-700">{{ skill.name }}</label>
          </div>
        </div>
  
        <!-- Bouton -->
        <button
          class="mt-10 w-full bg-purple-600 hover:bg-purple-700 text-white text-2xl font-semibold py-2 rounded"
          @click="saveSkills"
        >
          Let's Start
        </button>
      </div>
    </div>
  </template>
  
  <script setup>

  //hada mab9axiiii

  
  import { ref, onMounted } from 'vue'
  import api from '@/services/api'
  import { useRouter } from 'vue-router'
  
  const router = useRouter()
  const skills = ref([])
  const selectedSkills = ref([])
  
  function closeModal() {
  isOpen.value = false
  router.push('/ClassesEval')
}



const isOpen = ref(true)
  
  const fetchSkills = async () => {
    try {
      const response = await api.get('http://localhost:3001/ChooseSkills')
      skills.value = response.data
    } catch (error) {
      console.error('Erreur lors de la récupération des compétences :', error)
    }
  }


async function saveSkills() {
  try {
    // 1. Enregistrement local (facultatif mais utile)
    localStorage.setItem('selectedSkills', JSON.stringify(selectedSkills.value))

    // 2. Envoi au backend
    await axios.post('http://localhost:3001/SkillsChoosen', {
      skills: selectedSkills.value             // Liste des skills sélectionnés
    })

    router.push('/SkillsChoosen')

  } catch (error) {
    console.error('❌ Erreur lors de l\'envoi des compétences :', error)
  }
}

  
  onMounted(fetchSkills)
  </script>
  
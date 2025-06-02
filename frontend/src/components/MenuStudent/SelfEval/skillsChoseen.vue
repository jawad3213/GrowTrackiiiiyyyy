<template>
  <div class="fixed inset-0 bg-gray-500 dark:bg-gray-900 flex items-center justify-center z-50 font-inter">
    <div class="bg-white w-[700px] h-[550px] p-6 rounded-xl shadow-xl text-center">
      <button class="absolute top-4 right-4 text-black text-xl" @click="closeModal">×</button>

      <h1 class="text-5xl mt-8 font-bold mb-10">
        Your <span class="bg-orange-500 text-white px-2 rounded">Evaluation</span> SKILLS
      </h1>

      <p class="font-bold text-2xl mb-4">
        YOU WILL EVALUATE <span class="uppercase">{{ studentName }}</span> BASED ON THE FOLLOWING SKILLS:
      </p>

      <ul class="text-left text-2xl list-disc ml-20 mb-10">
        <li v-for="skill in skills" :key="skill.id">
          {{ skill.name }}
        </li>
      </ul>

      <button @click="startEvaluation" class="bg-orange-500 text-lg text-white px-20 py-3 rounded">
        Let's Start
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const skills = ref([])
const studentName = 'USER'
const router = useRouter()

const fetchSkills = async () => {
  try {
    const res = await axios.get('http://localhost:3001/ChooseSkills') // adapte l'URL
    skills.value = res.data
  } catch (err) {
    console.error('Erreur récupération compétences :', err)
  }
}

onMounted(fetchSkills)

function closeModal() {
  //isOpen.value = false
  router.push('/dashstudent')
}


function startEvaluation() {
  router.push('/evalSkills')
}
</script>

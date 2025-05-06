<template>
    <div v-if="true" class="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <div class="bg-white border-2 border-purple-500 rounded-xl shadow-xl p-6 w-full max-w-md">
        
        <!-- Header -->
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-semibold">Add members</h2>
          <button @click="goBack" class="text-gray-500 hover:text-gray-800 text-xl font-bold">&times;</button>
        </div>
  
        <!-- Inputs -->
        <div class="space-y-2 mb-6">
          <input
            v-for="(member, index) in members"
            :key="index"
            v-model="members[index]"
            :placeholder="`Member${index + 1}`"
            class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
  
        <!-- Buttons -->
        <div class="flex justify-between">
          <button @click="goBack" class="border border-gray-400 px-4 py-2 rounded text-gray-700">
            Go Back
          </button>
          <button @click="saveMembers" class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded font-semibold">
            Save Members
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref , onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import axios from 'axios'
  import { useRoute } from 'vue-router'
  
  const isOpen = ref(true)
  
  const router = useRouter()
  const route = useRoute()
  
  // Liste de membres (initialement vide ou avec 4 cases)
  const members = ref(['', '', '', ''])
  
  // Annuler et revenir en arrière
  const goBack = () => {
    isOpen.value = false
    router.push('/AddProject') // redirection
  }
  
  // Envoi au backend
  const saveMembers = async () => {
    try {
      const payload = {
        members: members.value.filter(m => m.trim() !== '') // filtrer les vides
      }
  
      if (payload.members.length === 0) {
        alert('Please enter at least one member')
        return
      }
    
      if (groupname.value) {
      // Mode modification (UPDATE)
      await axios.put(`http://localhost:3001/projects/${groupname.value}`, payload)
    } else {
        // Mode création (CREATE)
    const response = await axios.post('http://localhost:3001/projects', payload)
    }
    router.push('/AddProject')

    } catch (error) {
      console.error('Error saving members:', error)
    }
  }

  const groupname = ref(null)

  onMounted(async () => {
  groupname.value = route.query.name

  if (groupname.value) {
    try {
      const { data } = await axios.get(`http://localhost:3001/projects/${groupname.value}`)
      members.value = data
    } catch (error) {
      console.error('Erreur de chargement du projet à éditer :', error)
    }
  }
})
  </script>
  
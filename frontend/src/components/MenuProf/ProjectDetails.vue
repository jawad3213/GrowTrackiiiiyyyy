<template>
    <ProfLayout>
    <div class="p-6 bg-white dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100">
      <!-- Header -->                <!-- Flèche de retour + nom du projet -->
         <div class="flex items-center mb-6">
                <!-- Gauche : flèche + nom projet -->
                <div class="flex items-center space-x-2">
                    <button @click="goBack" class="text-2xl text-black hover:text-gray-700">
                    ←
                    </button>
                    <h2 class="text-lg font-semibold text-gray-900">
                      {{ project?.name }}
                    </h2>
                </div>

                <!-- Droite : badge -->
                <div class="bg-purple-100 text-purple-600 text-sm font-semibold px-3 py-1 rounded-full">
                  {{ project?.subgroups }} groupes
                </div>
         </div>

            

  
      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="min-w-full text-sm border divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-100 dark:bg-gray-800">
            <tr>
              <th class="p-3 text-left">Name of Group</th>
              <th class="p-3 text-left">Number of members</th>
              <th class="p-3 text-left">Actions</th>
  
            </tr>
          </thead>
          <tbody>
              <tr
                v-for="(group, index) in project?.groups || []"
                :key="index"
                class="hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition duration-150 ease-in-out"
              >
                <td class="p-3">
                  <div class="font-medium">{{ group.name }}</div>
                </td>
                <td class="p-3">{{ group.members }}</td>

              <!-- <td class="p-3">
                <div v-for="g in project.groups" :key="g.name">
                  {{ g.name }}
                </div>
              </td> -->

              <td class="p-3 flex space-x-2">
                <button @click="confirmDelete(project.id)" class="text-[#F97316] pr-15 text-lg font-bold">Delete</button>
              <button @click="viewMembers(group.id)" class="text-indigo-600 hover:underline">
                View Members
              </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

     <!-- Tableaux des membres -->
<div v-if="members.length" class="mt-8">
  <h2 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Group Members</h2>
  <table class="min-w-full text-sm border divide-y divide-gray-200 dark:divide-gray-700">
    <thead class="bg-gray-100 dark:bg-gray-800">
      <tr>
        <th class="p-3 text-left">Full Name</th>
        <th class="p-3 text-left">CNE</th>
        <th class="p-3 text-left">Last Evaluation</th>
        <th class="p-3 text-left">Status</th>
        <th class="p-3 text-left">Action</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(m, index) in members" :key="index" class="hover:bg-gray-50 dark:hover:bg-gray-800">
        <td class="p-3">{{ m.name }}</td>
        <td class="p-3">{{ m.cne }}</td>
        <td class="p-3">{{ m.lastEvaluation }}</td>
        <td class="p-3">
          <span :class="m.status === 'submitted' ? 'text-green-600' : 'text-red-500'">
            {{ m.status }}
          </span>
        </td>
        <td class="p-3">
          <button class="text-purple-600 hover:underline">New Evaluation</button>
        </td>
      </tr>
    </tbody>
  </table>
</div>


    </div>
    </ProfLayout>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
  import ProfLayout from '../layout/ProfLayout.vue'
import axios from 'axios'

const route = useRoute()
const router = useRouter()
// const projectId = route.query.id

const project = ref(null)

const fetchProject = async () => {
  try {
    const response = await axios.get(`http://localhost:3001/projects/${route.query.id}`)
    project.value = response.data
  } catch (error) {
    console.error('Erreur de récupération:', error)
  }
}

const goBack = () => router.back()
  
  // Supprimer un projet
  const confirmDelete = async (id) => {
    if (confirm('Voulez-vous vraiment supprimer ce projet ?')) {
      try {
        await axios.delete(`http://localhost:3001/projects/${id}`)
        projects.value = projects.value.filter(p => p.id !== id)
      } catch (error) {
        console.error('Erreur de suppression:', error)
      }
    }
  }
  
  // Éditer un projet (exemple de placeholder)
  const editProject = (project) => {
  router.push({ path: '/AddProject', query: { id: project.id } })
}

//selectionner le group
// const goToProject = (id) => {
//   router.push({ name: 'ProjectDetails', query: { id: project.id } })
// }

//view members
const members = ref([])
const showMembersModal = ref(false)


const viewMembers = async (groupId) => {
  try {
    const response = await axios.get(`http://localhost:3001/Members`, {
      params: { id: groupId }
    })
    members.value = response.data // on suppose que la réponse est un tableau d'objets membres
  } catch (error) {
    console.error('Erreur lors de la récupération des membres :', error)
  }
}


  
  // Appel au montage
  onMounted(fetchProject)
  </script>
  
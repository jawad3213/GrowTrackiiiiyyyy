<template>
    <ProfLayout>
    <div class="p-6 bg-white dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100">
      <!-- Header -->
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-semibold">
          My Projects <span class="bg-purple-100 text-purple-600 text-sm font-semibold px-3 py-1 rounded-full dark:bg-purple-200/10 dark:text-purple-300">{{ projects.length }} Projects</span>
        </h2>
        
        <RouterLink
            to="/AddProject"
            class="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-5 py-2 rounded border border-purple-500"
            >
            + Create
        </RouterLink>

      </div>
  
      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="min-w-full text-sm border divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-100 dark:bg-gray-800">
            <tr>
              <th class="p-3 text-left"><input type="checkbox" /></th>
              <th class="p-3 text-left">Name</th>
              <th class="p-3 text-left">Level</th>
              <th class="p-3 text-left">Field</th>
              <th class="p-3 text-left">Start Date</th>
              <th class="p-3 text-left">End Date</th>
              <th class="p-3 text-left">Group</th>
              <th class="p-3 text-left">Notes</th>
              <th class="p-3 text-left">Actions</th>
  
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="project in projects"
              :key="project.id"
              class="hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <td class="p-3"><input type="checkbox" /></td>
              <td class="p-3">
                <div class="font-medium">{{ project.name }}</div>
                <div class="text-xs text-gray-500 dark:text-gray-400">{{ project.id }}</div>
              </td>
              <td class="p-3">{{ project.level }}</td>
              <td class="p-3">{{ project.field }}</td>
              <td class="p-3">{{ project.start_date }}</td>
              <td class="p-3">{{ project.end_date }}</td>
              <td class="p-3">
                <div v-for="g in project.groups" :key="g.name">
                  {{ g.name }}
                </div>
              </td>
              <td class="p-3">{{ project.description }}</td>
              <td class="p-3 flex space-x-2">
                <button @click="editProject(project)" class="text-blue-500 hover:text-blue-700">✏️</button>
                <button @click="confirmDelete(project.id)" class="text-red-500 hover:text-red-700">🗑️</button>
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
  import axios from 'axios'
  import ProfLayout from '../layout/ProfLayout.vue'
  import { useRouter } from 'vue-router'

  const router = useRouter()
  
  const projects = ref([])
  
  // Récupérer tous les projets
  const fetchProjects = async () => {
    try {
      const response = await axios.get('http://localhost:3001/projects')
      projects.value = response.data
    } catch (error) {
      console.error('Erreur de récupération des projets:', error)
    }
  }
  
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

  
  // Appel au montage
  onMounted(fetchProjects)
  </script>
  
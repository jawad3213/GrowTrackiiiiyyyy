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
              <th class="p-3 text-left">Name</th>
              <th class="p-3 text-left">Field</th>
              <th class="p-3 text-left">Start Date</th>
              <th class="p-3 text-left">End Date</th>
              <th class="p-3 text-left">Group</th>
              <th class="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="project in projects"
              :key="project.id"
              @click="goToProject(project.id)"
              class="hover:bg-gray-100 dark:hover:bg-gray-800 active:bg-gray-200 dark:active:bg-gray-700 cursor-pointer transition transform duration-150 ease-in-out active:scale-[0.98]"
            >
              <td class="p-3">
                <div class="font-medium">{{ project.name_project }}</div>
                <div class="text-xs text-gray-500 dark:text-gray-400">{{ project.id }}</div>
              </td>
              <td class="p-3">{{ project.level }}</td>
              <td class="p-3">{{ project.date_project }}</td>
              <td class="p-3">{{ project.end_date }}</td>
              <td class="p-3">{{ project.subgroups }}</td>
              <td class="p-3 flex space-x-2">
                <button @click.stop="editProject(project)" class="text-blue-500 hover:text-blue-700">✏️</button>
                <button @click.stop="confirmDelete(project.id)" class="text-red-500 hover:text-red-700">🗑️</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </ProfLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '@/services/api';
import ProfLayout from '../layout/ProfLayout.vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const projects = ref([]);
 const errorMessage = ref('')

const fetchProjects = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await api.get('/api/prof_project_management/all_project', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = response.data.result || [];
    projects.value = data.map((p) => ({
      id: p.id_project,
      name_project: p.name_project,
      date_project: p.date_project,
      end_date: p.end_date,
      level: p.id_sector,
      classe: p.id_class,
      subgroups: p.team_count,
     
    }));
  } catch (error) {
    console.error('Erreur de récupération des projets:', error);
    if (error.response?.status === 404) {
      errorMessage.value = 'Projects endpoint not found. Please check if the backend server is running or contact the administrator.';
    } else if (error.response?.status === 401) {
      errorMessage.value = 'Unauthorized access. Please log in again.';
    } else {
      errorMessage.value = 'Failed to load projects. Please try again later.';
    }
  }
};

const confirmDelete = async (id) => {
  if (confirm('Voulez-vous vraiment supprimer ce projet ?')) {
    try {
      const token = localStorage.getItem('token');
      await api.delete(`/api/prof_project_management/delete_project/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      projects.value = projects.value.filter((p) => p.id !== id);
    } catch (error) {
      console.error('Erreur de suppression:', error);
      
    }
  }
};

const editProject = (project) => {
  router.push({ path: '/AddProject', query: { id: project.id } });
};

const goToProject = (id) => {
  router.push({ name: 'ProjectDetails', query: { id } });
};

onMounted(fetchProjects);
</script>
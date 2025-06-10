<template>
  <StudentLayout>
    <!-- Section d’introduction stylée -->
    <section class="bg-white dark:bg-gray-900">
      <div class="w-full flex items-center justify-between px-20 py-10 bg-white dark:bg-gray-900">
        <h2 class="text-4xl font-bold text-gray-900 dark:text-gray-100">
          My Projects 
        </h2>

        <!-- Bouton en haut-droite -->
        </div>

      

      <!-- Loader avant le chargement des projets -->
      <div v-if="loading" class="flex justify-center items-center py-16">
        <div class="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>

      <!-- Grille de cartes de projets (affichée seulement quand loading est false) -->
      <div v-else class="mt-8 max-w-6xl mx-auto px-4">
        <div v-if="projects.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div
            v-for="project in projects"
            :key="project.id_project"
            class="relative group"
          >
            <div
              class="absolute inset-0 bg-gradient-to-r from-indigo-500 via-pink-500 to-yellow-400
                     rounded-lg opacity-0 filter blur-lg transition-all duration-1000
                     group-hover:opacity-60 group-hover:duration-200"
            ></div>

            <!-- Contenu de la carte -->
            <div
              @click="goToProject(project.id_project)"
              class="relative bg-gray-50 dark:bg-gray-800 rounded-lg p-6 cursor-pointer
                     hover:shadow-lg transition-shadow duration-200"
            >
              <h3 class="text-xl font-semibold text-gray-900 dark:text-gray-100">
                 {{ project.name_project }}
              </h3>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Project ID: {{ project.id_project }}
              </p>

              <div class="mt-4 space-y-2 text-sm">
                <p>
                  <span class="font-semibold">Professor:</span>
                  <span class="text-gray-700 dark:text-gray-300">{{ project.professor_name }}</span>
                </p>
                <p>
                  <span class="font-semibold">Module:</span>
                  <span class="text-gray-700 dark:text-gray-300">{{ project.module }}</span>
                </p>
                <p>
                  <span class="font-semibold">Team:</span>
                  <span class="text-gray-700 dark:text-gray-300">{{ project.team_name }}</span>
                </p>
                <p>
                  <span class="font-semibold">Deadline:</span>
                  <span class="text-gray-700 dark:text-gray-300">{{ formatDate(project.deadline) }}</span>
                </p>
              </div>

              <div class="mt-4 flex justify-end space-x-4">
                <button
                  @click.stop="editProject(project)"
                  class="text-blue-500 hover:text-blue-700"
                  title="Edit"
                >✏️</button>
                <button
                  @click.stop="confirmDelete(project.id_project)"
                  class="text-red-500 hover:text-red-700"
                  title="Delete"
                >🗑️</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Aucun projet trouvé -->
        <div v-else class="text-center text-gray-500 dark:text-gray-400 py-16">
          Aucun projet trouvé.
        </div>

        <!-- Message d’erreur -->
        <div v-if="errorMessage" class="mt-6 text-red-500 text-sm text-center">
          {{ errorMessage }}
        </div>
      </div>
    </section>
  </StudentLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import api from '@/services/api';

import { useRouter } from 'vue-router';
import StudentLayout from '@/components/layout/StudentLayout.vue'

const router = useRouter();
const projects = ref([]);
const errorMessage = ref('');
const loading = ref(true);
const authStore = useAuthStore();

// Fonction utilitaire pour formater les dates
const formatDate = (dateString) => {
  if (!dateString) return '';
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

// Récupération des projets depuis l’API
const fetchProjects = async () => {
  loading.value = true;
  errorMessage.value = '';
  try {
    const token = localStorage.getItem('token');
    const studentId = authStore.ID;  // Utilisation de l'ID de l'étudiant
    const response = await api.get(`/student/projects/all_projects/${studentId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // Vérifiez la structure des données de la réponse
    console.log('API Response:', response.data); // Debugging

    // Accessing the 'data' property from the API response
    const data = response.data && response.data.data ? response.data.data : [];

    // Ensure data is an array before processing
    if (Array.isArray(data)) {
      projects.value = data.map((p) => ({
        id_project: p.id_project,
        name_project: p.name_project,
        professor_name: p.professor_name,
        module: p.module,
        team_name: p.team_name,
        deadline: p.deadline,
      }));
    } else {
      errorMessage.value = 'The data returned from the API is not an array.';
    }
  } catch (error) {
    console.error('Erreur de récupération des projets:', error);
    errorMessage.value = 'Failed to load projects. Please try again later.';
  } finally {
    loading.value = false;
  }
};

// Supprimer un projet
const confirmDelete = async (id) => {
  if (confirm('Voulez-vous vraiment supprimer ce projet ?')) {
    try {
      await api.delete(`/student/projects/delete_project/${id}`);
      projects.value = projects.value.filter((p) => p.id_project !== id);
    } catch (error) {
      console.error('Erreur de suppression :', error);
    }
  }
};

// Rediriger vers la page de détails
const goToProject = (id) => {
  router.push({ name: 'ProjectDetails', query: { id } });
};

// Rediriger vers la page d'édition
const editProject = (project) => {
  router.push({ path: '/AddProject', query: { id: project.id_project } });
};

onMounted(fetchProjects);
</script>

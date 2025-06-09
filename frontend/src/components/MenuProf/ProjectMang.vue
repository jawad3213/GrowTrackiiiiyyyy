<template>
  <ProfLayout>
    <!-- Section d’introduction stylée -->
    <section class="bg-white dark:bg-gray-900">
      <!-- En-tête en pleine largeur, margin 1px (p-px) pour coller au bord -->
      <div class="w-full flex items-center justify-between p-px bg-white dark:bg-gray-900">
        <!-- Titre en haut-gauche -->
        <h2 class="text-4xl font-bold text-gray-900 dark:text-gray-100">
          My Projects
        </h2>

        <!-- Bouton en haut-droite -->
        <div class="relative inline-flex items-center justify-center group">
          <div
            class="absolute inset-0 duration-1000 opacity-60 transition-all
                   bg-gradient-to-r from-indigo-500 via-pink-500 to-yellow-400
                   rounded-xl blur-lg filter
                   group-hover:opacity-100 group-hover:duration-200"
          ></div>
          <RouterLink
            to="/AddProject"
            class="relative inline-flex items-center justify-center text-base rounded-xl
                   bg-gray-900 dark:bg-gray-800 px-8 py-3 font-semibold text-white
                   transition-all duration-200 hover:bg-gray-800 hover:shadow-lg
                   hover:-translate-y-0.5 hover:shadow-gray-600/30"
          >
            + Create New Project
            <svg
              aria-hidden="true"
              viewBox="0 0 10 10"
              height="10"
              width="10"
              fill="none"
              class="mt-0.5 ml-2 -mr-1 stroke-white stroke-2"
            >
              <path
                d="M0 5h7"
                class="transition-opacity duration-200 opacity-0 group-hover:opacity-100"
              ></path>
              <path
                d="M1 1l4 4-4 4"
                class="transition-transform duration-200 group-hover:translate-x-[3px]"
              ></path>
            </svg>
          </RouterLink>
        </div>
      </div>

      <!-- Texte descriptif centré, avec margins verticales -->
      <div class="w-full mt-8 mb-8 px-4">
        <p class="text-center text-lg leading-relaxed text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
          Manage and overview all your active projects at a glance. Click any card for details or create a new one.
        </p>
      </div>

      <!-- Loader avant le chargement des projets -->
      <div v-if="loading" class="flex justify-center items-center py-16">
        <div class="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>

      <!-- Grille de cartes de projets (affichée seulement quand loading est false) -->
      <div v-else class="mt-8 max-w-6xl mx-auto px-4">
        <!-- Si au moins un projet trouvé -->
        <div v-if="projects.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div
            v-for="project in projects"
            :key="project.id"
            class="relative group"
          >
            <!-- Dégradé flou derrière chaque carte -->
            <div
              class="absolute inset-0 bg-gradient-to-r from-indigo-500 via-pink-500 to-yellow-400
                     rounded-lg opacity-0 filter blur-lg transition-all duration-1000
                     group-hover:opacity-60 group-hover:duration-200"
            ></div>

            <!-- Contenu de la carte -->
            <div
              @click="goToProject(project.id)"
              class="relative bg-gray-50 dark:bg-gray-800 rounded-lg p-6 cursor-pointer
                     hover:shadow-lg transition-shadow duration-200"
            >
              <!-- Titre & ID -->
              <h3 class="text-xl font-semibold text-gray-900 dark:text-gray-100">
                {{ project.name_project }}
              </h3>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Project ID: {{ project.id }}
              </p>

              <!-- Détails du projet -->
              <div class="mt-4 space-y-2 text-sm">
                <p>
                  <span class="font-semibold">Class:</span>
                  <span class="text-gray-700 dark:text-gray-300">{{ project.classe }}</span>
                </p>
                <p>
                  <span class="font-semibold">Field:</span>
                  <span class="text-gray-700 dark:text-gray-300">{{ project.level }}</span>
                </p>
                <p>
                  <span class="font-semibold">Start:</span>
                  <span class="text-gray-700 dark:text-gray-300">{{ formatDate(project.date_project) }}</span>
                </p>
                <p>
                  <span class="font-semibold">End:</span>
                  <span class="text-gray-700 dark:text-gray-300">{{ formatDate(project.end_date) }}</span>
                </p>
                <p>
                  <span class="font-semibold">Team Count:</span>
                  <span class="text-gray-700 dark:text-gray-300">{{ project.subgroups }}</span>
                </p>
              </div>

              <!-- Boutons d’action “éditer / supprimer” -->
              <div class="mt-4 flex justify-end space-x-4">
                <button
                  @click.stop="editProject(project)"
                  class="text-blue-500 hover:text-blue-700"
                  title="Edit"
                >✏️</button>
                <button
                  @click.stop="confirmDelete(project.id)"
                  class="text-red-500 hover:text-red-700"
                  title="Delete"
                >🗑️</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Si aucun projet n’est trouvé après chargement -->
        <div v-else class="text-center text-gray-500 dark:text-gray-400 py-16">
          Aucun projet trouvé.
        </div>

        <!-- Message d’erreur si échec du chargement -->
        <div v-if="errorMessage" class="mt-6 text-red-500 text-sm text-center">
          {{ errorMessage }}
        </div>
      </div>
    </section>
  </ProfLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '@/services/api';
import ProfLayout from '../layout/ProfLayout.vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const projects = ref([]);
const errorMessage = ref('');
const loading = ref(true);

// Fonction utilitaire pour formater les dates en "DD MMMM YYYY" (ex: 31 August 2025)
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
    const response = await api.get('/api/prof_project_management/all_project', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = response.data.result || [];
    projects.value = data.map((p) => ({
      id: p.id_project,
      name_project: p.name_project,
      // On garde les valeurs ISO en interne mais on formate à l’affichage
      date_project: p.date_project,
      end_date: p.end_date,
      // id_class sert de nom de classe
      classe: p.id_class,
      // id_sector sert de nom de champ (field)
      level: p.id_sector,
      // team_count affiché sous "Team Count"
      subgroups: p.team_count,
    }));
  } catch (error) {
    console.error('Erreur de récupération des projets:', error);
    if (error.response?.status === 404) {
      errorMessage.value = 'Projects endpoint not found. Please check if the backend server is running.';
    } else if (error.response?.status === 401) {
      errorMessage.value = 'Unauthorized access. Please log in again.';
    } else {
      errorMessage.value = 'Failed to load projects. Please try again later.';
    }
  } finally {
    loading.value = false;
  }
};

// Supprime un projet et met à jour la liste
const confirmDelete = async (id) => {
  if (confirm('Voulez-vous vraiment supprimer ce projet ?')) {
    try {
      await api.delete(`/api/prof_project_management/delete_project/${id}`);
      projects.value = projects.value.filter((p) => p.id !== id);
    } catch (error) {
      console.error('Erreur de suppression :', error);
    }
  }
};

// Redirige vers la page d’édition du projet
const editProject = (project) => {
  router.push({ path: '/AddProject', query: { id: project.id } });
};

// Redirige vers les détails du projet
const goToProject = (id) => {
  router.push({ name: 'ProjectDetails', query: { id } });
};

onMounted(fetchProjects);
</script>

<style>
@keyframes slide-fade {
  0% {
    opacity: 0;
    transform: translateY(20px) scale(0.98);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
.animate-slide-fade {
  animation: slide-fade 1.2s ease-out forwards;
}
</style>

<template>
  <admin-layout>
    <div class="flex min-h-screen bg-gray-50 dark:bg-gray-900 font-sans">
      <main class="flex-1 flex flex-col">
        <!-- Titre + compteur + barre de recherche + filtres -->
        <div class="flex items-center justify-between flex-wrap gap-4 p-6">
          <!-- Titre + compteur -->
          <h1 class="text-2xl font-bold flex items-center space-x-2 text-gray-800 dark:text-white">
            <span>Evaluation</span>
            <span class="bg-purple-100 text-purple-600 text-sm font-semibold px-3 py-1 rounded-full dark:bg-purple-200/10 dark:text-purple-300">
              {{ filteredEvaluations.length }} evaluations
            </span>
          </h1>

          <!-- Filtres -->
          <div class="flex gap-4">
            <select
              v-model="levelFilter"
              class="h-11 rounded-lg border border-gray-200 bg-transparent py-2.5 px-4 text-sm text-gray-800 dark:border-gray-800 dark:bg-gray-900 dark:text-white/90"
              @change="fetchFilteredEvaluations"
            >
              <option value="">All Levels</option>
              <option v-for="level in levels" :key="level" :value="level">{{ level }}</option>
            </select>
            <select
              v-model="classFilter"
              class="h-11 rounded-lg border border-gray-200 bg-transparent py-2.5 px-4 text-sm text-gray-800 dark:border-gray-800 dark:bg-gray-900 dark:text-white/90"
              @change="fetchFilteredEvaluations"
            >
              <option value="">All Classes</option>
              <option v-for="classe in classes" :key="classe" :value="classe">{{ classe }}</option>
            </select>
            <select
              v-model="typeFilter"
              class="h-11 rounded-lg border border-gray-200 bg-transparent py-2.5 px-4 text-sm text-gray-800 dark:border-gray-800 dark:bg-gray-900 dark:text-white/90"
              @change="fetchFilteredEvaluations"
            >
              <option value="">All Types</option>
              <option v-for="type in types" :key="type" :value="type">{{ type }}</option>
            </select>
          </div>

          <!-- Barre de recherche -->
          <div class="relative w-[400px]">
            <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 dark:text-white/30">🔍</span>
            <input
              type="text"
              v-model="search"
              placeholder="Search by Evaluation ID"
              class="h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pl-10 pr-4 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400
                     focus:border-[#692CF3] focus:outline-none focus:ring-2 focus:ring-[#692CF3]/30
                     hover:border-[#692CF3] transition-colors duration-200
                     dark:border-gray-800 dark:bg-gray-900 dark:bg-white/[0.03] dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-[#692CF3]"
            />
          </div>
        </div>

        <!-- Message d'erreur -->
        <div v-if="errorMessage" class="px-6 pb-4 text-red-600 dark:text-red-400">
          {{ errorMessage }}
        </div>

        <!-- Tableau -->
        <div class="overflow-x-auto px-6 pb-6">
          <table class="min-w-full bg-white dark:bg-gray-800 shadow text-gray-800 dark:text-gray-100">
            <thead class="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th class="px-4 py-2 text-left text-sm font-medium">ID</th>
                <th class="px-4 py-2 text-left text-sm font-medium">Full Name</th>
                <th class="px-4 py-2 text-left text-sm font-medium">Level</th>
                <th class="px-4 py-2 text-left text-sm font-medium">Class</th>
                <th class="px-4 py-2 text-left text-sm font-medium">Type</th>
                <th class="px-4 py-2 text-left text-sm font-medium">Submitted In</th>
                <th class="px-4 py-2 text-left text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="evaluation in filteredEvaluations"
                :key="evaluation.id"
                class="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <td class="px-4 py-2">{{ evaluation.id }}</td>
                <td class="px-4 py-2">{{ evaluation.fullName }}</td>
                <td class="px-4 py-2">{{ evaluation.level }}</td>
                <td class="px-4 py-2">{{ evaluation.classe }}</td>
                <td class="px-4 py-2">{{ evaluation.type }}</td>
                <td class="px-4 py-2">{{ evaluation.submittedIn }}</td>
                <td
                  class="p-3 text-purple-600 hover:underline cursor-pointer"
                  @click="goToViewReport(evaluation.id)"
                >
                  View evaluation →
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  </admin-layout>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import api from '@/services/api';
import AdminLayout from '@/components/layout/ProfLayout.vue';
import { useRouter } from 'vue-router';
import { debounce } from 'lodash'; // Import lodash for debouncing

const evaluations = ref([]);
const search = ref('');
const levelFilter = ref('');
const classFilter = ref('');
const typeFilter = ref('');
const levels = ref([]);
const classes = ref([]);
const types = ref([]);
const errorMessage = ref('');
const router = useRouter();

const fetchEvaluations = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await api.get('/api/prof_evaluation_history/evaluation_all', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = response.data.result || []; // Access the result array or default to empty array
    if (Array.isArray(data)) {
      evaluations.value = data.map(item => ({
        id: item.id_evaluation,
        fullName: item.full_name,
        level: item.sector_id,
        classe: item.id_class,
        type: item.evaluation_context,
        submittedIn: new Date(item.date_add).toLocaleDateString(),
      }));
      console.log('Evaluations loaded:', evaluations.value);
      errorMessage.value = '';
    } else {
      evaluations.value = [];
      errorMessage.value = 'No data found or unauthorized.';
    }
  } catch (error) {
    console.error('Erreur lors du chargement des évaluations:', error);
    errorMessage.value = error.response?.data?.message || 'Failed to load evaluations. Please try again.';
  }
};

const fetchFilterOptions = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await api.get('/api/prof_evaluation_history/evaluation_all', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = response.data.result || []; // Access the result array or default to empty array
    if (Array.isArray(data)) {
      levels.value = [...new Set(data.map(item => item.sector_id))].sort();
      classes.value = [...new Set(data.map(item => item.id_class))].sort();
      types.value = [...new Set(data.map(item => item.evaluation_context))].sort();
      errorMessage.value = '';
      console.log('Filter options loaded:', { levels: levels.value, classes: classes.value, types: types.value });
    } else {
      levels.value = [];
      classes.value = [];
      types.value = [];
      errorMessage.value = 'No filter data found.';
    }
  } catch (error) {
    console.error('Erreur lors du chargement des options de filtre:', error);
    errorMessage.value = error.response?.data?.message || 'Failed to load filter options. Please try again.';
  }
};

const fetchFilteredEvaluations = async () => {
  try {
    const token = localStorage.getItem('token');
    let url = '/api/prof_evaluation_history/evaluation_all';
    if (levelFilter.value) {
      url = `/api/prof_evaluation_history/filter_by_level/${levelFilter.value}`;
    } else if (classFilter.value) {
      url = `/api/prof_evaluation_history/filter_by_class/${classFilter.value}`;
    } else if (typeFilter.value) {
      url = `/api/prof_evaluation_history/filter_by_type/${typeFilter.value}`;
    }

    const response = await api.get(url, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = response.data.result || [];
    if (Array.isArray(data)) {
      evaluations.value = data.map(item => ({
        id: item.id_evaluation,
        fullName: item.full_name,
        level: item.sector_id,
        classe: item.id_class,
        type: item.evaluation_context,
        submittedIn: new Date(item.date_add).toLocaleDateString(),
      }));
      errorMessage.value = '';
    } else {
      evaluations.value = [];
      errorMessage.value = 'No data found.';
    }
  } catch (error) {
    console.error('Erreur lors du filtrage des évaluations:', error);
    errorMessage.value =  error.response.data.message ||'Failed to filter evaluations. Please try again.';
  }
};

// Debounced search function
const searchEvaluations = debounce(async (searchTerm) => {
  if (!searchTerm) {
    fetchFilteredEvaluations();
    errorMessage.value = '';
    return;
  }

  // Validate that searchTerm is a positive integer
  if (!/^\d+$/.test(searchTerm)) {
    errorMessage.value = 'Please enter a valid Evaluation ID (numeric only).';
    evaluations.value = [];
    return;
  }

  try {
    const token = localStorage.getItem('token');
    const response = await api.get(`/api/prof_evaluation_history/search_by_id_evaluation/${searchTerm}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = response.data.result || [];
    if (Array.isArray(data)) {
      evaluations.value = data.map(item => ({
        id: item.id_evaluation,
        fullName: item.full_name,
        level: item.sector_id,
        classe: item.id_class,
        type: item.evaluation_context,
        submittedIn: new Date(item.date_add).toLocaleDateString(),
      }));
      errorMessage.value = data.length === 0 ? 'No evaluations found for this ID.' : '';
    } else {
      evaluations.value = [];
      errorMessage.value = 'No data found.';
    }
  } catch (error) {
    console.error('Erreur lors de la recherche:', error);
    errorMessage.value =  error.response.data.message ||error.response?.status === 500
      ? 'Server error. Please check the Evaluation ID and try again.'
      : 'Failed to search evaluations. Please try again.';
    evaluations.value = [];
  }
}, 500); // 500ms debounce delay

watch(search, (newSearch) => {
  searchEvaluations(newSearch);
});

const filteredEvaluations = computed(() => {
  return evaluations.value;
});

const goToViewReport = (id) => {
  router.push(`/ViewEval?id=${id}`);
};

onMounted(() => {
  fetchEvaluations();
  fetchFilterOptions();
});
</script>
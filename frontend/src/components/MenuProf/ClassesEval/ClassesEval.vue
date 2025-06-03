<template>
  <ProfLayout>
    <div class="p-6 dark:bg-[#121212] min-h-screen">
      <h1 class="text-xl font-bold mb-4 text-gray-900 dark:text-white">
        My classes <span class="bg-purple-100 text-purple-600 text-sm font-semibold px-3 py-1 rounded-full dark:bg-purple-200/10 dark:text-purple-300">{{ displayedStudents.length }} students</span>
      </h1>

      <!-- Filtres niveaux -->
      <div class="mt-10 flex gap-0 border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden w-max text-sm font-medium">
        <button
          v-for="level in Object.keys(levels)"
          :key="level"
          @click="selectedLevel = level; selectedClass = ''; displayedStudents = []; fetchClasses(level)"
          :class="[
            'px-4 py-2 transition',
            selectedLevel === level
              ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700',
            'border-r border-gray-300 dark:border-gray-600 last:border-r-0'
          ]"
        >
          {{ level }}
        </button>
      </div>

      <!-- Filtres classes dynamiques -->
      <div class="flex flex-wrap gap-4 text-sm font-medium mt-10">
        <span
          v-for="classe in levels[selectedLevel]"
          :key="typeof classe === 'string' ? classe : classe.name"
          class="cursor-pointer"
          :class="[
            selectedClass === (typeof classe === 'string' ? classe : classe.name)
              ? 'text-gray-600 border-b-2 border-purple-600 dark:text-purple-300'
              : 'text-gray-600 dark:text-gray-300'
          ]"
          @click="selectClasse(typeof classe === 'string' ? classe : classe.name)"
        >
          {{ typeof classe === 'string' ? classe : classe.name }}
          <span
            class="bg-purple-100 text-purple-600 dark:bg-purple-200/10 dark:text-purple-300 px-3 rounded-full"
          >
            ({{ getTotalStudents(typeof classe === 'string' ? classe : classe.name) }} students)
          </span>
        </span>
      </div>

      <!-- Recherche -->
      <div class="mt-10 flex items-center gap-3">
        <div class="relative w-[400px]">
          <!-- Icône de recherche -->
          <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 dark:text-white/30">
            🔍
          </span>
          <input
            type="text"
            v-model="search"
            placeholder="Search by Student ID, Course Status or Project Status"
            class="h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pl-10 pr-4 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400
                   focus:border-[#692CF3] focus:outline-none focus:ring-2 focus:ring-[#692CF3]/30
                   hover:border-[#692CF3] transition-colors duration-200
                   dark:border-gray-800 dark:bg-gray-900 dark:bg-white/[0.03] dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-[#692CF3]"
          />
        </div>
      </div>

      <!-- Tableau -->
      <div class="overflow-x-auto mt-10">
        <table class="w-full table-auto text-sm bg-white dark:bg-gray-900 rounded shadow">
          <thead class="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200">
            <tr>
              <th class="text-left p-3"><input type="checkbox" /></th>
              <th class="text-left p-3">Full name</th>
              <th class="text-left p-3">CNE</th>
              <th class="text-left p-3">C.Eval.Status</th>
              <th class="text-left p-3">Last Evaluation</th>
              <th class="text-left p-3">P.Eval.Status</th>
              <th class="text-left p-3">Last Evaluation</th>
              <th class="text-left p-3">Signal Action</th>
              <th class="text-left p-3">Report</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="student in displayedStudents"
              :key="student.id"
              class="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <td class="p-3"><input type="checkbox" /></td>
              <td class="p-3 flex items-center gap-2">
                <img :src="student.avatar" class="w-8 h-8 rounded-full object-cover" />
                <div>
                  <div class="font-semibold text-gray-900 dark:text-white">{{ student.fullName }}</div>
                  <div class="text-gray-500 text-xs">{{ student.username }}</div>
                </div>
              </td>
              <td class="p-3 text-gray-700 dark:text-gray-300">{{ student.cne }}</td>
              <td class="p-3">
                <span :class="badgeClass(student.evalStatus)">{{ student.evalStatus }}</span>
              </td>
              <td class="p-3 text-gray-700 dark:text-gray-300">{{ student.lastEvalDate }}</td>
              <td class="p-3">
                <span :class="badgeClass(student.projectEvalStatus)">{{ student.projectEvalStatus }}</span>
              </td>
              <td class="p-3 text-gray-700 dark:text-gray-300">{{ student.projectEvalDate }}</td>
              <td class="p-3 text-purple-600 hover:underline cursor-pointer" @click="goToNewEvaluation(student.id)">➕ New Evaluation</td>
              <td class="p-3 text-purple-600 hover:underline cursor-pointer" @click="goToViewReport(student.id)">View Report →</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </ProfLayout>
</template>
  
  <script setup>
  import { ref, onMounted, computed, watch } from 'vue';
import { debounce } from 'lodash';
import api from '@/services/api';
import { useRouter } from 'vue-router';
import ProfLayout from '@/components/layout/ProfLayout.vue';


const router = useRouter();
const search = ref('');
const students = ref([]);
const levels = ref({});
const selectedLevel = ref('');
const selectedClass = ref('');
const displayedStudents = ref([]);

onMounted(async () => {
  try {
     const token = localStorage.getItem('token')
    const sectorResponse = await api.get('/api/prof_evaluation_classes/get_sector', {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (sectorResponse.data.result) {
      const fetchedLevels = {};
      sectorResponse.data.result.forEach(sector => {
        fetchedLevels[sector.name] = [];
      });
      levels.value = fetchedLevels;
      if (Object.keys(fetchedLevels).length > 0) {
        selectedLevel.value = Object.keys(fetchedLevels)[0];
        await fetchClasses(selectedLevel.value);
      }
    }
    console.log('Sectors fetched successfully:', levels.value);
  } catch (error) {
    console.error('Error fetching sectors:', error);
    
  }
});

const fetchClasses = async (level) => {
  try {
    const token = localStorage.getItem('token')
    const response = await api.get(`/api/prof_evaluation_classes/get_classes/${level}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (response.data.result) {
      levels.value[level] = response.data.result.map(classe => classe.name);
      const storedClass = localStorage.getItem('selectedClass');
      if (storedClass && levels.value[level].includes(storedClass)) {
        selectedClass.value = storedClass;
        await fetchStudents(storedClass);
      } else if (levels.value[level].length > 0) {
        selectedClass.value = levels.value[level][0];
        await fetchStudents(levels.value[level][0]);
      }
    }
  } catch (error) {
    console.error('Error fetching classes:', error);
    
  }
};

const fetchStudents = async (classe) => {
  try {
    const token = localStorage.getItem('token')
    const response = await api.get(`/api/prof_evaluation_classes/get_all_student/${classe}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (response.data.result) {
      displayedStudents.value = response.data.result.map(student => ({
        id: student.id_student,
        fullName: student.fullName,
        username: student.username || 'N/A',
        avatar: student.avatar || 'https://via.placeholder.com/32',
        cne: student.cne,
        evalStatus: student.courseEvalStatus || 'Not Submitted',
        lastEvalDate: student.lastCourseEvalDate || 'N/A',
        projectEvalStatus: student.projectEvalStatus || 'Not Submitted',
        projectEvalDate: student.lastProjectEvalDate || 'N/A',
      }));
      students.value = displayedStudents.value;
    } else {
      displayedStudents.value = [];
      students.value = [];
      console.warn('No students found for this class.');
    }
  } catch (error) {
    console.error('Error fetching students:', error);
    
  }
};

const selectClasse = async (classe) => {
  selectedClass.value = classe;
  localStorage.setItem('selectedClass', classe);
  await fetchStudents(classe);
};

const getTotalStudents = (classe) => {
  return selectedClass.value === classe ? displayedStudents.value.length : 0;
};

const badgeClass = (status) => {
  return status.toLowerCase() === 'submitted'
    ? 'text-green-800 bg-green-100 dark:text-green-300 dark:bg-green-900 px-2 py-1 rounded-full text-xs font-semibold'
    : 'text-orange-800 bg-orange-100 dark:text-orange-300 dark:bg-orange-900 px-2 py-1 rounded-full text-xs font-semibold';
};

const goToNewEvaluation = (id) => {
  router.push({ path: '/SkillsChoosen', query: { id } });
};

const goToViewReport = (id) => {
  router.push({ path: '/Rapport', query: { id } });
};

watch(search, debounce(async (newSearch) => {
  if (newSearch.trim()) {
    const searchTerm = newSearch.trim().toLowerCase();
    const isCNE = /^[a-zA-Z0-9]+$/.test(searchTerm);
    const isStatus = ['submitted', 'not submitted'].includes(searchTerm.toLowerCase());

    if (isCNE && selectedClass.value) {
      try {
        const response = await api.get(`/api/prof_evaluation_classes/search_by_student_cne/${searchTerm}/${selectedClass.value}`);
        displayedStudents.value = response.data.result ? response.data.result.map(mapStudent) : [];
      } catch (error) {
        console.error('Error searching by CNE:', error);
        displayedStudents.value = [];
        console.error('Failed to search by student ID.',error);
      }
    } else if (isStatus && selectedClass.value) {
      const endpoint = searchTerm.includes('project')
        ? `/api/prof_evaluation_classes/filtre_by_project_statut/${searchTerm}`
        : `/api/prof_evaluation_classes/filtre_by_course_statut/${searchTerm}/${selectedClass.value}`;
      try {
        const response = await api.get(endpoint);
        displayedStudents.value = response.data.result ? response.data.result.map(mapStudent) : [];
      } catch (error) {
        console.error('Error searching by status:', error);
        displayedStudents.value = [];

      }
    } else {
      displayedStudents.value = students.value.filter(s =>
        s.fullName.toLowerCase().includes(searchTerm)
      );
    }
  } else {
    displayedStudents.value = students.value;
  }
}, 500));

const mapStudent = student => ({
  id: student.id_student,
  fullName: student.fullName,
  username: student.username || 'N/A',
  avatar: student.avatar || 'https://via.placeholder.com/32',
  cne: student.cne,
  evalStatus: student.courseEvalStatus || 'Not Submitted',
  lastEvalDate: student.lastCourseEvalDate || 'N/A',
  projectEvalStatus: student.projectEvalStatus || 'Not Submitted',
  projectEvalDate: student.lastProjectEvalDate || 'N/A',
});

  </script>
  
  
  
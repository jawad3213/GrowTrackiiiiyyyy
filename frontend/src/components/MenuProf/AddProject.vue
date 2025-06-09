<template>
  <div v-if="isOpen" class="fixed inset-0 bg-gray-900 bg-opacity-60 flex items-center justify-center z-50 font-inter">
    <div class="bg-white border-2 rounded-2xl shadow-xl w-full max-w-xl p-6 sm:p-8 border-purple-500">
      <!-- Header -->
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-2xl mb-2 font-bold text-gray-900">Add Project</h2>
        <button @click="closeModal" class="text-gray-500 hover:text-gray-800 text-2xl font-bold">×</button>
      </div>

      <!-- Formulaire -->
      <form @submit.prevent="submitForm" class="space-y-4">
        <!-- Name + Subgroups -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="font-semibold">Name</label>
            <input
              v-model="form.name"
              type="text"
              placeholder="name"
              class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label class="font-semibold">How many Sub Group are there</label>
            <input
              v-model.number="form.subgroups"
              type="number"
              placeholder="Enter the number"
              class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        <!-- Month Start + Number of Months -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="font-semibold">Start Month*</label>
            <input
              v-model="form.month_start"
              type="month"
              class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm"
            />
          </div>
          <div>
            <label class="font-semibold">Number of Months*</label>
            <input
              v-model.number="form.month_number"
              type="number"
              min="1"
              class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm"
            />
          </div>
        </div>

        <!-- Level + Field -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="font-semibold">Year of Studies*</label>
            <select
              v-model="form.level"
              class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option disabled value="">-- Select --</option>
              <option>AP1</option>
              <option>AP2</option>
              <option>CI1</option>
              <option>CI2</option>
              <option>CI3</option>
            </select>
          </div>
          <div>
            <label class="font-semibold">Field*</label>
            <select
              v-model="form.field"
              :disabled="availableFields.length === 0"
              class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option disabled value="">-- select field --</option>
              <option v-for="field in availableFields" :key="field">{{ field }}</option>
            </select>
          </div>
        </div>

        <!-- Admin Notes -->
        <div>
          <label class="font-semibold">Admin Notes</label>
          <textarea
            v-model="form.description"
            rows="4"
            placeholder="e.g. Notes or description..."
            class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          ></textarea>
        </div>

        <!-- Rest of the form… -->
        <!-- … (Groupes, Actions, etc.) … -->

        <div class="flex justify-end space-x-3 mt-4">
          <button
            type="button"
            @click="closeModal"
            class="border border-gray-400 px-4 py-2 rounded text-gray-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded font-semibold"
          >
            Save Project
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import api from '@/services/api';

const router = useRouter();
const route = useRoute();
const isOpen = ref(true);
const projectId = ref(route.query.id);

// Codes de base (sans le “1” ou “2”)
const fieldsByYearBase = {
  AP: ['TD1', 'TD2', 'TD3'],
  CI: ['GINF', 'CYS', 'GSEA', 'GSR', 'GINL'],
};

const form = ref({
  name: '',
  subgroups: 0,
  month_start: '',
  month_number: 1,
  description: '',
  level: '',
  field: '',
  groups: [],
});
const newGroupName = ref('');

// computed : on ajoute la partie numérique à la suite des codes de base
const availableFields = computed(() => {
  const lvl = form.value.level; // ex: "CI1", "CI2", "AP1"…

  if (!lvl) return [];

  // Extraire la partie alphabétique et la partie numérique
  const prefixMatch = lvl.match(/^[A-Za-z]+/);
  const suffixMatch = lvl.match(/\d+$/);

  if (!prefixMatch || !suffixMatch) return [];

  const prefix = prefixMatch[0];    // "CI" ou "AP"
  const yearNum = suffixMatch[0];   // "1", "2", etc.

  const baseCodes = fieldsByYearBase[prefix] || [];
  // On retourne ["GINF1", "CYS1", "GSEA1", …] si prefix === "CI" et yearNum === "1"
  return baseCodes.map(code => `${code}${yearNum}`);
});

// Fermeture du modal
const closeModal = () => {
  isOpen.value = false;
  router.push('/ProjectMang');
};

// Fonction d’envoi du formulaire (exemple simplifié)
const submitForm = async () => {
  try {
    const { name, month_start, month_number, description, level, field, groups } = form.value;
    if (!name || !month_start || !month_number || !level || !field) return;

    // Transformer la date "YYYY-MM" en "MM/YYYY"
    const payload = {
      name,
      month_start: month_start.split('-').reverse().join('/'), // ex: "09/2025"
      month_number,
      description,
      level,
      field,
    };

    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    if (!projectId.value) {
      const { data } = await api.post(`/api/prof_project_management/add_project`, payload, { headers });
      const newProjectId = data.result.id_project;
      // … vous pouvez ensuite créer les groupes si besoin …
    } else {
      await api.patch(`/api/prof_project_management/update_project/${projectId.value}`, payload, { headers });
    }

    router.push('/ProjectMang');
  } catch (error) {
    console.error('Erreur lors de la soumission du formulaire :', error);
  }
};

onMounted(async () => {
  if (projectId.value) {
    // … charger les données du projet pour l’édition (comme avant) …
  }
});
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

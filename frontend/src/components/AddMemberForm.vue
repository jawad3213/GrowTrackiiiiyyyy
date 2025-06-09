<template>
      <ProfLayout>
  <div>
    <!-- Header -->
    <section class="bg-gray-50 dark:bg-gray-900 py-16">
      <div class="max-w-3xl mx-auto text-center px-4">

        <!-- Animated Heading -->
        <StreamingText
          text="Manage Group Members"
          textClass="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-8"
          :fromVars="{ y: 20, opacity: 0 }"
          :toVars="{ y: 0, opacity: 1, duration: 1.5 }"
          splittingBy="words"
        />

        <!-- Members Grid -->
        <div class="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          <div
            v-for="(m, idx) in members"
            :key="m.id_member || idx"
            class="relative group"
            :style="{ 'animation-delay': `${idx * 100}ms` }"
          >
            <!-- Gradient hover glow -->
            <div
              class="absolute inset-0 bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-200 rounded-xl blur-lg opacity-0 group-hover:opacity-50 transition duration-500"
            ></div>

            <!-- Member Card -->
            <div
              class="relative bg-white dark:bg-gray-800 rounded-xl p-6 text-center shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 opacity-0 animate-slide-scale-fade"
            >
              <div
                class="w-16 h-16 mx-auto rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-2xl font-semibold text-indigo-600 dark:text-indigo-400 mb-4"
              >
                {{ (m.full_name || m.cne).charAt(0) }}
              </div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {{ m.full_name || '—' }}
              </h3>
              <p class="text-gray-500 dark:text-gray-400 text-sm">CNE: {{ m.cne }}</p>
            </div>
          </div>
        </div>

        <!-- Add Member Form -->
        <div class="mt-12 relative group max-w-md mx-auto">
          <!-- Gradient blur background -->
          <div
            class="absolute inset-0 bg-gradient-to-r from-indigo-500 via-pink-500 to-yellow-400 rounded-2xl blur-lg opacity-30 filter transition duration-500 group-hover:opacity-60"
          ></div>

          <form
            @submit.prevent="submitAddMember"
            class="relative bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl space-y-6"
          >
            <div>
              <label class="block font-semibold text-gray-700 dark:text-gray-200 mb-2">
                Member CNE
              </label>
              <input
                v-model="memberCne"
                type="text"
                placeholder="Enter member CNE"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            <div class="flex justify-between items-center">
              <button
                type="button"
                @click="goBack"
                class="text-gray-700 dark:text-gray-300 font-medium hover:underline"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="relative inline-flex items-center justify-center px-6 py-3 bg-gray-900 dark:bg-gray-800 text-white rounded-xl font-semibold transition-transform duration-200 hover:scale-105 hover:shadow-lg"
              >
                Add Member
                <svg
                  aria-hidden="true"
                  viewBox="0 0 10 10"
                  width="10"
                  height="10"
                  fill="none"
                  class="ml-2 stroke-white stroke-2 transition-transform group-hover:translate-x-1"
                >
                  <path d="M0 5h7" />
                  <path d="M1 1l4 4-4 4" />
                </svg>
              </button>
            </div>

            <p v-if="errorMessage" class="text-red-500 text-center">{{ errorMessage }}</p>
            <p v-if="successMessage" class="text-green-500 text-center">{{ successMessage }}</p>
          </form>
        </div>
      </div>
    </section>

    
  </div>
     </ProfLayout>
</template>
<script setup>
import ProfLayout from './layout/ProfLayout.vue';
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '@/services/api';
import HeaderPage from '@/components/Header.vue';
import StreamingText from '@/components/StreamingText.vue';


const route = useRoute();
const router = useRouter();
const idGroup = route.params.id_group;

const memberCne = ref('');
const members = ref([]);
const loadingMembers = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

const fetchMembers = async () => {
  loadingMembers.value = true;
  try {
    const token = localStorage.getItem('token');
    const res = await api.get(
      `/api/prof_project_management/all_member/${idGroup}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    members.value = res.data.result || [];
  } catch (err) {
    errorMessage.value = '.';
  } finally {
    loadingMembers.value = false;
  }
};

onMounted(fetchMembers);

const submitAddMember = async () => {
  errorMessage.value = '';
  successMessage.value = '';
  if (!memberCne.value.trim()) {
    errorMessage.value = 'CNE is required.';
    return;
  }
  try {
    const token = localStorage.getItem('token');
    await api.post(
      `/api/prof_project_management/add_member/${idGroup}`,
      { cne: memberCne.value.trim() },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    successMessage.value = 'Member added successfully.';
    memberCne.value = '';
    await fetchMembers();
  } catch (err) {
    errorMessage.value = 'Failed to add member. Please check the CNE.';
  }
};

const goBack = () => router.back();
</script>

<style>
@keyframes slide-scale-fade {
  0% {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.animate-slide-scale-fade {
  animation: slide-scale-fade 0.8s ease-out forwards;
}
</style>

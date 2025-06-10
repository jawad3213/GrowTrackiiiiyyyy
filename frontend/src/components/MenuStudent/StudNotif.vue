<template>
  <StudentLayout>
    <div class="p-6 min-h-screen bg-gray-50 dark:bg-[#121212]">
      <h1 class="text-2xl font-bold flex items-center space-x-2 text-gray-800 dark:text-white">
        <span>Notifications</span>
        <span class="bg-purple-100 text-purple-600 text-sm font-semibold px-3 py-1 rounded-full dark:bg-purple-200/10 dark:text-purple-300">
          {{ notifications.length }} Notifications
        </span>
      </h1>

      <!-- Recherche (Optional Search Feature) -->
      <div class="flex gap-3 mb-4">
        <select v-model="searchType" class="border rounded px-2 py-1">
          <option value="all">All</option>
          <option value="content">By Content</option>
        </select>
        <div class="relative w-[400px]">
          <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 dark:text-white/30">🔍</span>
          <input
            type="text"
            v-model="search"
            placeholder="Search notifications"
            class="h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pl-10 pr-4 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-[#692CF3] focus:outline-none focus:ring-2 focus:ring-[#692CF3]/30 dark:border-gray-800 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-[#692CF3]"
            :disabled="searchType === 'all'"
          />
        </div>
        <button @click="doSearch" class="bg-purple-600 text-white px-4 py-1 rounded">Search</button>
      </div>

      <!-- Notifications Cards -->
      <div v-if="loading" class="text-center">Loading...</div>
      <div v-else>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div
            v-for="notification in notifications"
            :key="notification.id_notification"
            class="notification-card bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
          >
            <!-- Notification Status (Icon for approval/rejection) -->
            <div v-if="notification.status === 'approved'" class="flex items-center text-green-600">
              <svg class="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true" role="img">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              Approved
            </div>
            <div v-if="notification.status === 'rejected'" class="flex items-center text-red-600">
              <svg class="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true" role="img">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
              Rejected
            </div>

            <!-- Content Notification -->
            <p class="text-sm text-gray-800 dark:text-white">{{ notification.content_notification }}</p>

            <!-- User Avatar with Random Background Color -->
            <div class="flex items-center mt-4">
              <div :style="{ backgroundColor: randomColor }" class="w-10 h-10 flex items-center justify-center rounded-full text-white font-bold">
                A
              </div>
              <div class="ml-3">
                <span class="text-sm font-medium text-gray-800 dark:text-white">Admin</span>
              </div>
            </div>

            <!-- See More Button -->
            <div class="flex justify-end mt-4">
              <button class="text-blue-500 hover:text-blue-700">See More</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination (optional) -->
      <div class="flex justify-between items-center mt-6 text-sm text-gray-600 dark:text-white">
        <span>Page 1 of 10</span>
        <div class="space-x-2">
          <button class="px-4 py-2 border rounded border-gray-300 dark:border-gray-700">Previous</button>
          <button class="px-4 py-2 border rounded border-gray-300 dark:border-gray-700">Next</button>
        </div>
      </div>
    </div>
  </StudentLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '@/services/api';
import StudentLayout from '@/components/layout/StudentLayout.vue';

// Student ID (use the actual ID of the student from the context or route)
const studentId = '1e7e6475-93ce-4947-92b1-ef1100ee2efa';

const notifications = ref([]);
const searchType = ref('all');
const search = ref('');
const loading = ref(true);
const randomColor = ref(getRandomColor()); // Store the random background color

// Fetch notifications from the API
const fetchNotifications = async () => {
  const token = localStorage.getItem('token');
  let url = `/student/notifications/all_notifications/${studentId}`;
  
  if (searchType.value === 'content' && search.value) {
    url = `/student/notifications/search_by_content/${studentId}/${encodeURIComponent(search.value)}`;
  }

  try {
    const res = await api.get(url, {
      headers: { Authorization: `Bearer ${token}` }
    });
    notifications.value = res.data.data;
  } catch (err) {
    console.error('Error fetching notifications:', err);
  } finally {
    loading.value = false;
  }
};

// Perform search
const doSearch = async () => {
  loading.value = true;
  await fetchNotifications();
};

// Function to generate a random color for the background
function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

onMounted(fetchNotifications);
</script>

<style scoped>
.notification-card {
  background-color: #f9fafb;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 16px;
  transition: all 0.3s ease;
}

.notification-card:hover {
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
}

.notification-card .text-sm {
  color: #333;
}

.notification-card button {
  font-size: 0.875rem;
  text-decoration: underline;
}
</style>

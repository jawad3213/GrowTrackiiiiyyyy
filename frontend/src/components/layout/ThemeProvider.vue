<template>
  <slot></slot>
</template>

<script setup lang="ts">
import { ref, provide, onMounted, watch, computed } from 'vue'
import { useRoute } from 'vue-router'

type Theme = 'light' | 'dark'
const theme = ref<Theme>('light')
const isInitialized = ref(false)

const route = useRoute()

// Liste des routes où le dark mode est désactivé
const excludedDarkRoutes = ['/', '/AboutUs', '/Teachers', '/Students']

const isDarkMode = computed(() => theme.value === 'dark')

const toggleTheme = () => {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
}

onMounted(() => {
  const savedTheme = localStorage.getItem('theme') as Theme | null
  const initialTheme = savedTheme || 'light'
  theme.value = initialTheme
  isInitialized.value = true
})

watch([theme, isInitialized, route], ([newTheme, newIsInitialized, newRoute]) => {
  if (newIsInitialized) {
    localStorage.setItem('theme', newTheme)

    const isExcluded = excludedDarkRoutes.includes(newRoute.path)

    if (newTheme === 'dark' && !isExcluded) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }
})

provide('theme', {
  isDarkMode,
  toggleTheme,
})
</script>

<script lang="ts">
import { inject } from 'vue'

export function useTheme() {
  const theme = inject('theme')
  if (!theme) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return theme
}
</script>

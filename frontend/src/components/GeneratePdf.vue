<template>
  <div>
    <button
      @click="generatePdf"
      :disabled="loading"
      class="mt-6 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
    >
      {{ loading ? 'Generating PDF...' : 'Export Projects to PDF' }}
    </button>

    <p v-if="error" class="mt-2 text-red-600">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

// tell Axios to always send cookies
axios.defaults.withCredentials = true

const loading = ref(false)
const error   = ref(null)
const profile = ref([])
const evale   = ref([])

async function generatePdf() {
  loading.value = true
  error.value   = null

  try {
    // 1) Fetch Profile_Section
    const { data } = await axios.get(
      'http://localhost:3000/api/report/Profile_Section/STU011'
    )
    profile.value = Array.isArray(data) ? data : data.result

    // 2) Fetch Evaluation_Section
    const { data: data2 } = await axios.get(
      'http://localhost:3000/api/report/Evaluation_Section/STU011'
    )
    evale.value = Array.isArray(data2) ? data2 : data2.result

    // 3) Send both to your PDF endpoint
    const pdfRes = await axios.post(
      'http://localhost:3000/api/generate-pdf',
      {
        profile: profile.value,
        evale:   evale.value
      },
      {
        responseType: 'blob'
      }
    )




    
    // 4) Trigger download
    const blob = new Blob([pdfRes.data], { type: 'application/pdf' })
    const url  = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href     = url
    link.download = 'profile.pdf'
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)

  } catch (err) {
    console.error('PDF export failed:', err)
    error.value =
      err.response?.data?.message ||
      err.message ||
      'Failed to generate PDF.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* Tailwind handles styling */
</style>

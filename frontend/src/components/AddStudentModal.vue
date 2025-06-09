<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 flex items-center justify-center overflow-y-auto z-50 font-inter"
  >
    <!-- Backdrop with reduced opacity + blur -->
    <div
      class="fixed inset-0 bg-gray-400/30 backdrop-blur-[8px]"
      @click="closeModal"
      aria-hidden="true"
    ></div>

    <!-- Actual dialog box -->
    <div
      class="relative bg-white border-2 rounded-2xl shadow-xl w-full max-w-xl p-6 sm:p-8 border-t-2 border-purple-500"
    >
      <!-- Header -->
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-2xl mb-2 font-bold text-gray-900">
          {{ isEditMode ? 'Edit Student' : 'Add Student' }}
        </h2>
        <button
          @click="closeModal"
          class="text-gray-500 hover:text-gray-800 text-2xl font-bold"
        >
          &times;
        </button>
      </div>

      <!-- Form -->
      <form @submit.prevent="submitForm" class="space-y-4">
        <!-- Full Name + CIN -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="font-semibold">Full Name*</label>
            <input
              v-model="Student.full_name"
              type="text"
              placeholder="Full name"
              class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <span class="text-red-500 text-sm">{{ formStore.errors.full_name }}</span>
          </div>
          <div>
            <label class="font-semibold">CIN*</label>
            <input
              v-model="Student.cin"
              type="text"
              placeholder="K00000"
              class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <span class="text-red-500 text-sm">{{ formStore.errors.cin }}</span>
          </div>
        </div>

        <!-- CNE (newly added) -->
        <div>
          <label class="font-semibold">CNE*</label>
          <input
            v-model="Student.cne"
            type="text"
            placeholder="CNE000001"
            class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <span class="text-red-500 text-sm">{{ formStore.errors.cne }}</span>
        </div>

        <!-- Email -->
        <div>
          <label class="font-semibold">Email*</label>
          <input
            v-model="Student.email"
            type="email"
            placeholder="you@company.com"
            class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <span class="text-red-500 text-sm">{{ formStore.errors.email }}</span>
        </div>

        <!-- Password (only when not editing) -->
        <div v-if="!isEditMode">
          <label class="font-semibold">Password*</label>
          <input
            v-model="Student.pass"
            type="password"
            placeholder="Enter a secure password"
            class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <span class="text-red-500 text-sm">{{ formStore.errors.pass }}</span>
        </div>
        <div v-if="!isEditMode" class="w-full">
          <button
            type="button"
            @click="generatePassword"
            class="w-full py-2 font-semibold text-white rounded-md bg-gradient-to-r from-purple-600 to-orange-400 hover:from-purple-700 hover:to-orange-500 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Generate Password
          </button>
        </div>

        <!-- Year + Field -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="font-semibold">Year of Studies*</label>
            <select
              v-model="Student.id_sector"
              class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option disabled value="">-- Select --</option>
              <option>AP1</option>
              <option>AP2</option>
              <option>CI1</option>
              <option>CI2</option>
              <option>CI3</option>
            </select>
            <span class="text-red-500 text-sm">{{ formStore.errors.id_sector }}</span>
          </div>
          <div>
            <label class="font-semibold">Field*</label>
            <select
              v-model="Student.id_class"
              :disabled="availableFields.length === 0"
              class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option disabled value="">-- select field --</option>
              <option v-for="id_class in availableFields" :key="id_class">
                {{ id_class }}
              </option>
            </select>
            <span class="text-red-500 text-sm">{{ formStore.errors.id_class }}</span>
          </div>
        </div>

        <!-- Admin Notes -->
        <div>
          <label class="font-semibold">Admin Notes</label>
          <textarea
            v-model="Student.note"
            rows="4"
            placeholder="e.g. I joined Stripe’s Customer Success team..."
            class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          ></textarea>
          <span class="text-red-500 text-sm">{{ formStore.errors.note }}</span>
        </div>

        <!-- Alerts -->
        <p v-if="formStore.error" class="text-red-500 text-sm mb-2 animate-pulse">
          {{ formStore.error }}
        </p>
        <p v-if="formStore.success" class="text-green-500 text-sm mb-2 animate-pulse">
          {{ formStore.success }}
        </p>

        <!-- Buttons -->
        <div class="flex gap-4 pt-4">
          <button
            type="button"
            @click="closeModal"
            class="flex-1 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="formStore.loading"
            class="flex-1 py-2 font-semibold text-white rounded-md bg-gradient-to-r from-purple-600 to-orange-400 hover:from-purple-700 hover:to-orange-500 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="formStore.loading">Loading...</span>
            <span v-else>Confirm</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useFormStore } from '@/stores/form'
import { useStudentStore } from '@/stores/student'
import { AddStudentSchema } from '@/schemas/AddStudent.schema'
import axios from 'axios'

const router = useRouter()
const StudentStore = useStudentStore()
const formStore = useFormStore()
const route = useRoute()
const isEditMode = route.params.cin !== undefined
const OriginalData = {}
const UpdatedData = {}

const isOpen = ref(true)

const fieldsByYear = {
  AP: ['TD1', 'TD2', 'TD3'],
  CI: ['GINF1', 'GSEA1', 'CYS1', 'GSR1', 'GINL1']
}

const availableFields = computed(() => {
  if (Student.value.id_sector.startsWith('AP')) {
    return fieldsByYear.AP
  } else if (Student.value.id_sector.startsWith('CI')) {
    return fieldsByYear.CI
  }
  return []
})

// Initialize Student with cne added between cin and email
const Student = ref({
  full_name: '',
  cin: '',
  cne: '',         // ← New property for CNE
  email: '',
  pass: '',
  id_sector: 'AP1',
  id_class: 'GINF1',
  note: ''
})

const student = computed(() => ({
  ...Student.value,
  field: `${Student.value.id_class}`
}))

async function generatePassword() {
  try {
    const res = await axios.get(
      'https://api.genratr.com/?length=16&uppercase&lowercase&numbers'
    )
    const pass = res.data.password
    Student.value.pass = pass
  } catch (error) {
    console.log('Error occurred while trying to generate a password', error)
  }
}

async function submitForm() {
  if (!isEditMode) {
    try {
      // Include cne in the data sent to API
      const sanitizedData = formStore.sanitizeInputs(student.value)
      const valid = await formStore.validateWithSchema(sanitizedData, AddStudentSchema)
      if (valid) {
        await formStore.submitForm('/admin/students/create', sanitizedData)
        if (!formStore.errors) {
          console.log('sent')
          formStore.clearStatus()
          router.push('/Student')
        }
      }
    } catch (error) {
      console.log('here is the error ', error)
    }
  } else {
    try {
      for (const key in Student.value) {
        if (Student.value[key] !== OriginalData[key]) {
          UpdatedData[key] = Student.value[key]
        }
      }
      const sanitizedPartielData = formStore.sanitizeInputs(UpdatedData)
      const partialSchema = AddStudentSchema.pick(Object.keys(UpdatedData))
      const valid = await formStore.validateWithSchema(sanitizedPartielData, partialSchema)
      if (valid) {
        await StudentStore.updateStudent(OriginalData.id_member, sanitizedPartielData)
        if (!StudentStore.errors) {
          console.log('sent')
          StudentStore.clearStatus()
          router.push('/Student')
        }
      }
    } catch (error) {
      console.log('here is the error ', error)
    }
  }
}

function closeModal() {
  isOpen.value = false
  router.push('/Student')
}

onMounted(async () => {
  if (isEditMode) {
    try {
      const response = await StudentStore.getStudentBycin(route.params.cin)
      Student.value = response.data
      for (const key in Student.value) {
        OriginalData[key] = Student.value[key]
      }
    } catch (err) {
      console.log(err)
    }
  }
  formStore.clearStatus()
})
</script>

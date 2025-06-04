<template>
  <StudentLayout>
    <div class="max-w-3xl mx-auto p-6">
      <h1
        class="bg-[#868CFF] text-white py-4 rounded-lg text-3xl sm:text-4xl font-bold text-center mb-8"
      >
        Evaluate Yourself By Yourself
      </h1>

      <!-- Liste des compétences -->
      <div v-for="(skill, index) in skills" :key="index" class="mb-6">
        <button
          @click="toggle(index)"
          class="w-full flex justify-between items-center bg-[#FA9148] text-white text-xl sm:text-2xl px-4 py-3 rounded-md font-semibold transition-colors hover:bg-[#e87c30] focus:outline-none"
        >
          {{ skill.name }}
          <span class="text-xl">{{ skill.open ? '▲' : '▼' }}</span>
        </button>

        <!-- Questions + sliders -->
        <div
          v-if="skill.open"
          class="bg-orange-50 border border-orange-300 px-6 py-4 rounded-b-md mt-1"
        >
          <div v-if="skill.questions.length > 0">
            <div
              v-for="(q, qIndex) in skill.questions"
              :key="qIndex"
              class="mb-5"
            >
              <label class="font-semibold block mb-2 text-lg">{{ q.text }}</label>
              <input
                type="range"
                min="0"
                max="5"
                step="0.1"
                v-model.number="skill.ratings[qIndex]"
                class="w-full accent-purple-600"
              />
              <p class="text-sm text-center text-purple-700 mt-1">
                {{ skill.ratings[qIndex].toFixed(1) }}
              </p>
            </div>
          </div>
          <p v-else class="text-gray-600 text-center">
            Chargement des questions...
          </p>
        </div>
      </div>

      <!-- Recapitulation -->
      <div class="mb-8">
        <button
          @click="toggle(skills.length)"
          class="w-full flex justify-between items-center bg-[#FA9148] text-white text-xl sm:text-2xl px-4 py-3 rounded-md font-semibold transition-colors hover:bg-[#e87c30] focus:outline-none"
        >
          Recapitulation
          <span class="text-xl">{{ recapOpen ? '▲' : '▼' }}</span>
        </button>

        <div
          v-if="recapOpen"
          class="bg-gray-50 border border-gray-200 px-6 py-4 rounded-b-md mt-1"
        >
          <div v-for="(skill, index) in skills" :key="index" class="mb-3">
            <p class="text-gray-800">
              {{ skill.name }} : {{ averageRating(skill.ratings) }} / 5
            </p>
          </div>
          <p class="mt-4 text-sm font-semibold">
            Why did you choose to give yourself such a mark?
          </p>
          <textarea
            v-model="recapText"
            rows="3"
            class="w-full border border-gray-300 mt-2 p-3 rounded-md text-sm resize-none focus:ring focus:ring-purple-200"
            placeholder="e.g. I focused mainly on onboarding new customers..."
          ></textarea>
        </div>
      </div>

      <!-- Submit -->
      <div class="flex justify-center">
        <button
          @click="submit"
          class="bg-[#868CFF] text-white py-3 px-8 rounded-lg text-2xl sm:text-3xl font-bold hover:opacity-90 transition-opacity max-w-xs w-full"
        >
          Submit
        </button>
      </div>
    </div>
  </StudentLayout>
</template>

<script>
import StudentLayout from '@/components/layout/StudentLayout.vue'
import axios from 'axios'

export default {
  components: { StudentLayout },
  data() {
    return {
      skills: [
        { name: "Conflict Resolution", open: false, questions: [], ratings: [] },
        { name: "Influence and Persuasion", open: false, questions: [], ratings: [] },
        { name: "Communication", open: false, questions: [], ratings: [] },
        { name: "Leadership", open: false, questions: [], ratings: [] },
        { name: "Critical Thinking", open: false, questions: [], ratings: [] },
        { name: "Adaptability", open: false, questions: [], ratings: [] },
      ],
      recapOpen: false,
      recapText: ''
    }
  },
  methods: {
    async toggle(index) {
      if (index === this.skills.length) {
        this.recapOpen = !this.recapOpen
        return
      }

      const skill = this.skills[index]
      skill.open = !skill.open

      if (skill.open && skill.questions.length === 0) {
        try {
          const res = await axios.get(
            `http://localhost:3001/questions?skill=${encodeURIComponent(skill.name)}`
          )
          this.$set(this.skills[index], 'questions', res.data)
          this.$set(
            this.skills[index],
            'ratings',
            Array(res.data.length).fill(0)
          )
        } catch (error) {
          console.error(`Erreur lors du chargement des questions pour ${skill.name}`, error)
        }
      }
    },

    averageRating(ratings) {
      if (!ratings.length) return '0.0'
      const sum = ratings.reduce((acc, r) => acc + r, 0)
      return (sum / ratings.length).toFixed(1)
    },

    async submit() {
      for (const skill of this.skills) {
        const answers = skill.questions.map((q, i) => ({
          skill: skill.name,
          question: q.text,
          rating: skill.ratings[i] ?? 0
        }))

        await axios.post('http://localhost:3001/answers', {
          skill: skill.name,
          answers
        })
      }

      alert("Your answers have been submitted. Thank you!")
      // You can redirect or clear fields here if needed
    }
  }
}
</script>

<style scoped>
/* Optional: if you want a subtle shadow on expanded panels */
.bg-orange-50 {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.bg-gray-50 {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}
</style>

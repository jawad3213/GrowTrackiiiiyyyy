<template>
  <div>
    <!-- Si vous gardez encore un HeaderPage au‐dessus -->
    <HeaderPage />

    <section class="bg-white py-16">
      <div class="max-w-3xl mx-auto text-center px-4">
        <!-- ↓ On remplace l’ancien <h2> par le nouveau StreamingText ↓ -->
        <StreamingText
          text="Meet our team"
          textClass="text-4xl font-bold text-gray-900 mb-4"
          :fromVars="{ y: 20, opacity: 0 }"
          :toVars="{ y: 0, opacity: 1, duration: 2 }"
          splittingBy="words"
        />

        <p
          class="text-lg leading-relaxed text-center text-gray-700 dark:text-gray-300 max-w-2xl mx-auto mb-8 px-4"
        >
          <span class="font-medium text-gray-800 dark:text-white">
            "Alone we can do so little, together we can achieve anything."
          </span>
          <br />
          At the heart of our success is one powerful force:
          <span class="font-semibold text-indigo-600 dark:text-indigo-400">Collaboration</span>.
          <br />
        </p>

        <div class="flex justify-center space-x-4">
          <!-- From Uiverse.io by shivam_7937 -->
          <div class="relative inline-flex items-center justify-center gap-4 group">
            <div
              class="absolute inset-0 duration-1000 opacity-60 transition-all bg-gradient-to-r from-indigo-500 via-pink-500 to-yellow-400 rounded-xl blur-lg filter group-hover:opacity-100 group-hover:duration-200"
            ></div>
            <a
              role="button"
              class="group relative inline-flex items-center justify-center text-base rounded-xl bg-gray-900 px-8 py-3 font-semibold text-white transition-all duration-200 hover:bg-gray-800 hover:shadow-lg hover:-translate-y-0.5 hover:shadow-gray-600/30"
              title="payment"
              href="#"
            >
              Watch the demo video of our working method
              <svg
                aria-hidden="true"
                viewBox="0 0 10 10"
                height="10"
                width="10"
                fill="none"
                class="mt-0.5 ml-2 -mr-1 stroke-white stroke-2"
              >
                <path d="M0 5h7" class="transition opacity-0 group-hover:opacity-100"></path>
                <path d="M1 1l4 4-4 4" class="transition group-hover:translate-x-[3px]"></path>
              </svg>
            </a>
          </div>
        </div>

        <span
          class="block mt-5 text-xl opacity-0 animate-slide-fade font-medium text-gray-800 dark:text-white"
        >
          And here is
          <span class="font-bold underline decoration-indigo-500 underline-offset-4">the team</span>
          whose commitment brings this application to life.
        </span>
      </div>

      <!-- Grid des membres de l’équipe -->
      <div class="mt-8 max-w-6xl mx-auto px-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div
            v-for="member in team"
            :key="member.name"
            class="relative group"
          >
            <!-- Gradient overlay behind each card -->
            <div
              class="absolute inset-0 bg-gradient-to-r from-indigo-500 via-pink-500 to-yellow-400 rounded-lg
                     opacity-0 filter blur-lg transition-all duration-1000
                     group-hover:opacity-60 group-hover:duration-200"
            ></div>

            <!-- Card content -->
            <div class="relative bg-gray-50 rounded-lg p-6 text-center">
              <img
                class="w-24 h-24 mx-auto rounded-full object-cover"
                :src="member.image"
                :alt="member.name"
              />
              <h3 class="mt-4 text-lg font-semibold text-gray-900">{{ member.name }}</h3>
              <p class="text-indigo-600 text-sm">{{ member.position }}</p>
              <p class="mt-2 text-gray-500 text-sm">{{ member.bio }}</p>

              <div class="mt-4 flex justify-center space-x-4">
                <a
                  v-if="member.linkedin"
                  :href="member.linkedin"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-gray-400 hover:text-gray-600"
                >
                  <span class="sr-only">LinkedIn</span>
                  <i class="fa-brands fa-linkedin fa-2xl mr-4"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <Footer />
  </div>
</template>

<script>
import HeaderPage from './Header.vue'
import StreamingText from '@/components/StreamingText.vue'
import Footer from '@/components/Footer.vue'
import jaouad from '../assets/personal/jaouad.jpg'
import sara from '../assets/personal/sara.jpg'
import soukaina from '../assets/personal/soukaina.jpg'
import nada from '../assets/personal/nada.jpg'
import nour from '../assets/personal/nour.jpg'
import mosab from '../assets/personal/mosab.jpg'


export default {
  name: 'Team',
  components: {
    HeaderPage,
    StreamingText,
    Footer
  },
  data() {
    return {
      team: [
        {
          name: 'Fairadi Ihssane',
          position: 'Founder & CEO',
          bio: 'Former co-founder of Opendoor. Early staff at Spotify and Clearbit.',
          image: 'jaouad',
          linkedin: 'https://linkedin.com/in/oliviarhye',
        },
        {
          name: 'El Hail Jaouad',
          position: 'Assistant Manager',
          bio: 'Responsible for version control and interface design using Figma.',
          image: jaouad,
          linkedin: 'https://www.linkedin.com/in/el-hail-jaouad-97baa7359/',
        },
        {
          name: 'El Ouansaidi Soukayna',
          position: 'Frontend Developer',
          bio: 'Building responsive and dynamic interfaces using Vue.js.',
          image:soukaina,
          linkedin: 'https://www.linkedin.com/in/soukaina-elouansaidi-65b104256/?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app',
        },
        {
          name: 'El Oukili Nada',
          position: 'Backend Developer',
          bio: 'Secure, scalable Node.js/Express/PostgreSQL APIs.',
          image: nada,
          linkedin: 'https://www.linkedin.com/in/nada-el-oukili-5a929b2b5/',
        },
        {
          name: 'Ouhba Nourelhouda',
          position: 'CI/CD and Deployment Responsible',
          bio: 'utomates testing, building, and deployment using CI/CD pipelines and Docker.',
          image: nour,
          linkedin: 'https://www.linkedin.com/in/nourelhouda-ouhba-18996a265?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app',
        },
        {
          name: 'El Ghrich Salman',
          position: 'Product Designer',
          bio: 'Équipe fondatrice design chez Figma. Ancienne Pleo, Stripe, Tile.',
          image: '/images/team/natali.jpg',
          linkedin: 'https://linkedin.com/in/natalicraig',
        },
        {
          name: 'Laaroussi Sara',
          position: 'Frontend Developer',
          bio: 'Focused on crafting responsive and intuitive web applications with attention to performance and UX.',
          image: sara,
          linkedin: 'https://www.linkedin.com/in/sara-laaroussi-541b04331?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app',
         
        },
        {
          name: 'Kaddoura Hamza',
          position: 'Backend Developer',
          bio: 'Secure, scalable Node.js/Express/PostgreSQL APIs.',
          image: '/images/team/orlando.jpg',
          linkedin: 'https://linkedin.com/in/orlandodiggs',
          
        },
        {
          name: 'Ben Abdellah Mosab',
          position: 'Customer Success',
          bio: 'Lead CX chez Wealthsimple. Ancien PagerDuty & Sqreen.',
          image: mosab,
          linkedin: 'https://www.linkedin.com/in/mosab-ben-abdellah-b6b7052b9?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app',
          
        },
        {
          name: 'El Ibrahimi Rim',
          position: 'Customer Success',
          bio: 'Lead CX chez Wealthsimple. Ancien PagerDuty & Sqreen.',
          image: '/images/team/orlando.jpg',
          linkedin: 'https://linkedin.com/in/orlandodiggs',
          
        }
      ]
    }
  },
  methods: {
    goToAbout() {
      this.$router.push({ name: 'AboutUs' })
    },
    goToPositions() {
      this.$router.push({ name: 'OpenPositions' })
    }
  }
}
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
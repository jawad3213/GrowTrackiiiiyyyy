<template>
  <div>
    <!-- Header -->
    <HeaderPage />

    <!-- Hero Section -->
    <div
  class="items-center w-10/12 grid-cols-2 mx-auto overflow-x-hidden lg:grid
         md:py-14 lg:py-24 xl:py-14 lg:mt-3 xl:mt-5"
  data-aos="fade-right"
  data-aos-duration="800"
>
  <!-- Colonne gauche : titre / texte / CTA / défi -->
  <div class="pr-2 md:mb-14 py-14 md:py-0">
    <h1
      style="font-weight: bold; font-size: 60px; color: #212121; font-family: 'Inter', sans-serif;"
    >
      <span class="block w-full">Master Your Soft Skills. Own Your Tomorrow.</span>
    </h1>
    <p
      class="text-[20px] font-normal text-[#231B00] font-inter py-4 2xl:py-8 md:py-6 2xl:pr-5"
    >
      The skills you grow today unlock the opportunities of tomorrow. Your future begins
      with what you choose to learn now
    </p>

    <!-- Call To Action -->
    <div class="mt-4">
      <router-link
        to="/ContactUs"
        class="inline-block px-8 py-4 text-white  text-xl font-semibold rounded-full"
        style="background: linear-gradient(to right, #692CF3, #F97316);"
      >
        Start Now
      </router-link>
    </div>

    <!-- Daily Challenge intégré dans le Hero -->
    
  </div>

  <!-- Colonne droite : image hero -->
  <div class="pb-0 overflow-hidden md:p-10 lg:p-0 sm:pb-0">
    <img
      id="heroImg1"
      class="transition-all duration-300 ease-in-out hover:scale-105
             lg:w-full sm:mx-auto sm:w-5/6 sm:pb-12 lg:pb-0"
      src="../assets/LoadingPage.jpg"
      alt="Awesome hero page image"
      width="500"
      height="888"
    />
  </div>
</div>


    <div class="bg-[#DAD1EE] overflow-hidden">
  <div id="marquee" class="flex items-center space-x-12 will-change-transform">
    <!-- Vos 7 logos initiaux -->
    <img src="../assets/spons1.png"  alt="Sponsor 1" class="marquee-item w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 object-contain"/>
    <img src="../assets/sponso2.png" alt="Sponsor 2" class="marquee-item w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 object-contain"/>
    <img src="../assets/sponso3.png" alt="Sponsor 3" class="marquee-item w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 object-contain"/>
    <img src="../assets/sponso4.png" alt="Sponsor 4" class="marquee-item w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 object-contain"/>
    <img src="../assets/sponso5.png" alt="Sponsor 5" class="marquee-item w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 object-contain"/>
    <img src="../assets/sponso6.png" alt="Sponsor 6" class="marquee-item w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 object-contain"/>
    <img src="../assets/sponso7.png" alt="Sponsor 7" class="marquee-item w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 object-contain"/>
  </div>
</div>

    <!-- Features Section -->
    <section class="bg-white py-16 px-6">
      <h2 class="text-center text-6xl md:text-5xl font-bold text-[#F97316] mb-12">
        Grow Professionally Through Your Soft Skills
      </h2>
      <div class="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 text-center">
        <div>
          <img
            src="../assets/icon1.png"
            alt="Auto-évaluation"
            class="mx-auto w-40 h-40 md:w-48 md:h-48 object-fill mb-4"
          />
          <h3 class="text-[#692CF3] font-bold mb-2 text-xl">Auto-évaluation facile</h3>
          <p class="text-gray-800">
            Répondez à des questionnaires simples pour faire<br />
            le point sur vos compétences et voir où vous<br />
            brillez ou ce que vous pourriez améliorer.
          </p>
        </div>
        <div>
          <img
            src="../assets/icon3.png"
            alt="Évaluation 360"
            class="mx-auto w-40 h-40 md:w-48 md:h-48 object-fill mb-4"
          />
          <h3 class="text-[#692CF3] font-bold mb-2 text-xl">Évaluations 360°</h3>
          <p class="text-gray-800">
            Recevez des feedbacks constructifs de la part de<br />
            vos camarades, professeurs, tuteurs et même<br />
            d'encadrants extérieurs.
          </p>
        </div>
        <div>
          <img
            src="../assets/icon4.png"
            alt="Progression"
            class="mx-auto w-40 h-40 md:w-48 md:h-48 object-fill mb-4"
          />
          <h3 class="text-[#692CF3] font-bold mb-2 text-xl">Suivi visuel de votre progression</h3>
          <p class="text-gray-800">
            Consultez des tableaux de bord et des<br />
            graphiques clairs pour observer votre évolution<br />
            au fil du temps.
          </p>
        </div>
        <div>
          <img
            src="../assets/icon2.png"
            alt="Défis"
            class="mx-auto w-40 h-40 md:w-48 md:h-48 object-fill mb-4"
          />
          <h3 class="text-[#692CF3] font-bold mb-2 text-xl">Détection et suivi des défis</h3>
          <p class="text-gray-800">
            Dès qu’un signe de difficulté apparaît, la<br />
            plateforme vous alerte pour que vous puissiez<br />
            agir rapidement.
          </p>
        </div>
      </div>
    </section>

    <!-- FAQ Section -->
    <section class="bg-[#EDE6FF] py-16 px-6">
      <div class="text-center mb-12">
        <h2 class="text-6xl font-bold text-gray-900">Got Questions? We’ve Got Answers</h2>
        <p class="text-[20px] font-normal text-[#000000] font-inter mt-4">
          Practical Solutions To Elevate Your Soft Skills And Teaching Experience
        </p>
      </div>
      <div class="max-w-6xl mx-auto px-4 py-16 space-y-16">
        <div class="flex flex-col md:flex-row items-center gap-12">
          <img
            src="../assets/feat1.png"
            alt="FAQ 1"
            class="w-80 h-80 md:w-96 md:h-96 object-fill"
          />
          <div class="max-w-xl">
            <h3 class="text-[#692CF3] font-bold text-2xl md:text-3xl lg:text-4xl mb-4 leading-snug">
              How Can I Track My Soft Skills Without Spending Hours On Evaluations?
            </h3>
            <p class="text-gray-800 text-base md:text-lg">
              GrowTrack offers quick self-assessment quizzes that take just minutes to complete.
              Your progress is automatically updated on a personal dashboard, so you can see
              your improvement at a glance.
            </p>
          </div>
        </div>
        <div class="flex flex-col md:flex-row-reverse items-center gap-12">
          <img
            src="../assets/feat2.png"
            alt="FAQ 2"
            class="w-80 h-80 md:w-96 md:h-96 object-fill"
          />
          <div class="max-w-xl">
            <h3 class="text-[#692CF3] font-bold text-2xl md:text-3xl lg:text-4xl mb-4 leading-snug">
              I’d Like Feedback From Peers But Worry About Privacy—What Can I Do?
            </h3>
            <p class="text-gray-800 text-base md:text-lg">
              Use GrowTrack’s 360° co-evaluation in anonymous mode. Peers can provide candid feedback
              without revealing personal details, ensuring honest and helpful insights.
            </p>
          </div>
        </div>
        <div class="flex flex-col md:flex-row items-center gap-12">
          <img
            src="../assets/feat3.png"
            alt="FAQ 3"
            class="w-80 h-80 md:w-96 md:h-96 object-fill"
          />
          <div class="max-w-xl">
            <h3 class="text-[#692CF3] font-bold text-2xl md:text-3xl lg:text-4xl mb-4 leading-snug">
              As A Professor, How Do I Spot Students Who Need Extra Support?
            </h3>
            <p class="text-gray-800 text-base md:text-lg">
              Our real-time alerts notify you when a student’s score drops, allowing you to intervene
              early and offer targeted guidance before problems escalate.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials Section -->
    <section class="bg-white py-16 px-6">
      <div class="max-w-6xl mx-auto text-center">
        <h2 class="text-6xl font-bold text-gray-900">What Our Institutions Say</h2>
        <p class="text-[20px] font-normal text-[#000000] font-inter mt-4">Real Feedback From Universities And Schools Using GrowTrack To Empower Student Success.</p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
          <div class="flex flex-col items-center text-center px-6">
            <div class="flex justify-center mb-3 text-orange-500 text-xl">
              <span>★</span><span>★</span><span>★</span><span>★</span><span class="text-gray-400">★</span>
            </div>
            <p class="text-[20px] font-medium text-[#424242] font-inter mb-6 w-[300px] italic">
              "GrowTrack gives our students an easy way to boost their soft skills. Feedback shows they're more confident, communicative, and effective team players.”
            </p>
            <img
              src="../assets/sponso7.png"
              alt="Cadi Ayyad"
              class="w-20 h-20 md:w-24 md:h-24 object-fill mb-2"
            />
            <p class="text-sm text-gray-700 font-medium">Cadi Ayyad</p>
          </div>
          <div class="flex flex-col items-center text-center px-6">
            <div class="flex justify-center mb-3 text-orange-500 text-xl">
              <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
            </div>
            <p class="text-[20px] font-medium text-[#424242] font-inter mb-6 w-[300px] italic">
              "GrowTrack has transformed our soft skills evaluations. Clear dashboards and diverse feedback keep our students motivated and agile, essential for today's workplace."
            </p>
            <img
              src="../assets/sponso4.png"
              alt="Ibn Zohr"
              class="w-20 h-20 md:w-24 md:h-24 object-fill mb-2"
            />
            <p class="text-sm text-gray-700 font-medium">Ibn Zohr</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <Footer />
  </div>
</template>

<script>
import axios from 'axios';
import HeaderPage from './Header.vue';
import Footer from './Footer.vue';

export default {
  name: 'LoadingPage',
  components: {
    HeaderPage,
    Footer
  },
  data() {
    return {
      challenges: [
        "Pratiquez 5 minutes d'écoute active avec un ami.",
        "Notez 3 de vos forces et partagez-les à un collègue.",
        "Distribuez un compliment sincère à quelqu’un aujourd’hui.",
        "Prenez 10 minutes pour méditer sur une réussite passée.",
        "Proposez votre aide à un camarade sur un défi personnel.",
        "Entraînez-vous à reformuler un feedback en positif."
      ],
      currentChallenge: ''
    };
  },
  created() {
    this.nextChallenge();
  },
  methods: {
    nextChallenge() {
      const idx = Math.floor(Math.random() * this.challenges.length);
      this.currentChallenge = this.challenges[idx];
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
    const marquee = document.getElementById('marquee');

    // 1) On clone tous les éléments et on les préfixe pour permettre un wrap seamless
    const originals = Array.from(marquee.children);
    const clones = originals.map(el => el.cloneNode(true));
    // Insertion à l’avant dans le bon ordre
    clones.reverse().forEach(clone => marquee.insertBefore(clone, marquee.firstChild));

    // 2) On prépare l’animation
    const resetPoint = marquee.scrollWidth / 2; // largeur d’un bloc (originals)
    let pos = -resetPoint;                       // on démarre décalé à gauche
    const speed = 1;                             // px par frame

    function animate() {
      pos += speed;                              // on avance vers la droite
      if (pos >= 0) pos = -resetPoint;           // dès qu’on dépasse, on revient au début
      marquee.style.transform = `translateX(${pos}px)`;
      requestAnimationFrame(animate);
    }

    animate();
  });
</script>

<style scoped>
/* Si vous avez besoin de styles personnalisés, ajoutez-les ici */
</style>
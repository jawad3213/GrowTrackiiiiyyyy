<template>
  <div>
    <!-- ===================== Header ===================== -->
    <HeaderPage />

    <!-- ===================== Hero + CTA ===================== -->
    <div
      class="items-center w-10/12 grid-cols-2 mx-auto overflow-x-hidden lg:grid md:py-14 lg:py-24 xl:py-14 lg:mt-3 xl:mt-5"
      data-aos="fade-right"
      data-aos-duration="800"
    >
      <div class="pr-2 md:mb-14 py-14 md:py-0">
        <!-- Animated Heading -->
        <h1 class="animated-heading">
          <span class="word" style="--delay: 0s">Join</span>
          <span class="word" style="--delay: 0.15s">the</span>
          <span class="word" style="--delay: 0.3s">GrowTrack</span>
          <span class="word" style="--delay: 0.45s">Community</span>
        </h1>

        <p
          class="text-[20px] font-normal text-[#231B00] font-inter py-4 2xl:py-8 md:py-6 2xl:pr-5"
        >
          Thousands of students already trust GrowTrack to help them thrive. Whether you’re exploring career paths or building teamwork skills,
          GrowTrack gives you the tools and support to confidently move forward.
        </p>

        <div class="mt-4">
          <router-link
            to="/Login"
            class="inline-block px-8 py-4 text-white text-xl font-semibold rounded-full"
            style="background: linear-gradient(to right, #692CF3, #F97316);"
          >
            Get your account and start now
          </router-link>
        </div>
      </div>

      <div class="pb-0 overflow-hidden md:p-10 lg:p-0 sm:pb-0">
        <img
          id="heroImg1"
          class="transition-all duration-300 ease-in-out hover:scale-105 lg:w-5/6 sm:mx-auto sm:w-5/6 sm:pb-12 lg:pb-0"
          src="@/assets/students.jpg"
          alt="Awesome hero page image"
          width="500"
          height="888"
        />
      </div>
    </div>

    <!-- ===================== Features Section ===================== -->
    <section class="bg-[#DAD1EE] py-16">
      <div>
        <!-- Titre centré -->
        <div class="text-center">
          <h2 class="text-6xl font-bold text-gray-900">
            Start From Scratch, Build Your Future
          </h2>
          <p class="text-[20px] font-bold text-[#000000] font-inter mt-4">
            With GrowTrack, You Can Kick-Start Your Journey By
          </p>
        </div>

        <!-- Contenu grille -->
        <div
          ref="featuresContainer"
          class="w-10/12 mx-auto overflow-x-hidden grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          data-aos="fade-right"
          data-aos-duration="800"
        >
          <!-- Liste des fonctionnalités -->
          <div class="space-y-8">
            <!-- Bloc 1 -->
            <div class="feature-item flex items-start gap-4">
              <img
                src="@/assets/strengh.png"
                alt="Strength Icon"
                class="w-20 h-20 mt-1 icon-image"
              />
              <div>
                <h3 class="text-3xl font-semibold text-gray-800 mb-1">
                  Discovering Your Strengths
                </h3>
                <p class="text-xl text-gray-600">
                  Begin with our quick self-assessment quizzes. They help you identify what you're good at and pinpoint areas for improvement.
                </p>
              </div>
            </div>

            <!-- Bloc 2 -->
            <div class="feature-item flex items-start gap-4">
              <img
                src="@/assets/gathering.png"
                alt="Feedback Icon"
                class="w-20 h-20 mt-1 icon-image"
              />
              <div>
                <h3 class="text-3xl font-semibold text-gray-800 mb-1">
                  Gathering Honest Feedback
                </h3>
                <p class="text-xl text-gray-600">
                  Receive constructive insights from your peers and teachers. This feedback shows you what to focus on, even when you feel you haven't accomplished much yet.
                </p>
              </div>
            </div>

            <!-- Bloc 3 -->
            <div class="feature-item flex items-start gap-4">
              <img
                src="@/assets/tracking.png"
                alt="Progress Icon"
                class="w-20 h-20 mt-1 icon-image"
              />
              <div>
                <h3 class="text-3xl font-semibold text-gray-800 mb-1">
                  Tracking Your Progress
                </h3>
                <p class="text-xl text-gray-600">
                  Our dynamic dashboards display your growth clearly. Every small step is recorded, so you'll see real progress over time.
                </p>
              </div>
            </div>

            <!-- Bloc 4 -->
            <div class="feature-item flex items-start gap-4">
              <img
                src="@/assets/earning.png"
                alt="Recognition Icon"
                class="w-20 h-20 mt-1 icon-image"
              />
              <div>
                <h3 class="text-3xl font-semibold text-gray-800 mb-1">
                  Earning Recognition
                </h3>
                <p class="text-xl text-gray-600">
                  As you improve, celebrate your achievements with shareable badges. Each badge is a milestone proving that even if you started with nothing, you're becoming the best version of yourself.
                </p>
              </div>
            </div>
          </div>

          <!-- Illustration (dans la même grille) -->
          <div class="flex justify-center">
            <img
              src="@/assets/students1.png"
              alt="Success Illustration"
              class="w-11/12"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- ===================== Testimonials Section ===================== -->
    <section class="bg-white py-33 px-6">
      <div class="max-w-6xl mx-auto text-center">
        <!-- Title -->
        <h2 class="text-6xl font-bold text-gray-900">
          What Our Students Say
        </h2>
        <p class="text-[20px] font-normal text-[#000000] font-inter mt-4">
          Real Feedback From Students Using GrowTrack To Empower Student Success.
        </p>

        <!-- Carousel wrapper -->
        <div class="mt-20 relative overflow-hidden">
          <!-- Left arrow -->
          <button
            @click="prevSlide"
            class="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow hover:bg-gray-100"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6 text-gray-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <!-- Right arrow -->
          <button
            @click="nextSlide"
            class="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow hover:bg-gray-100"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6 text-gray-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <!-- Slides container -->
          <div
            ref="carousel"
            class="flex space-x-4 transition-transform duration-500 ease-in-out"
            :style="{ transform: `translateX(-${currentIndex * (slideWidth + gap)}px)` }"
          >
            <div
              v-for="(item, idx) in testimonials"
              :key="idx"
              class="flex-shrink-0 w-[calc(50%-0.5rem)] testimonial-item"
            >
              <div class="flex flex-col items-center text-center px-6">
                <div class="flex justify-center mb-3 text-orange-500 text-xl">
                  <span>★</span><span>★</span><span>★</span><span>★</span>
                  <span class="text-gray-400">★</span>
                </div>
                <p
                  class="text-[20px] font-medium text-[#424242] font-inter mb-6 w-[300px] italic"
                >
                  {{ item.quote }}
                </p>
                <img
                  :src="item.img"
                  :alt="item.name"
                  class="w-12 h-12 object-contain mb-2 rounded-full"
                />
                <p class="text-sm text-gray-700 font-medium">{{ item.name }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===================== Footer ===================== -->
    <Footer />

    <!-- ===================== Scroll Indicator (NEW) ===================== -->
    <div ref="scrollIndicator" class="scroll-indicator">
      <div ref="scrollDot" class="indicator-dot"></div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import HeaderPage from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import j from '@/assets/photo1.png'
import k from '@/assets/photo2.webp'

export default {
  name: 'Students',
  components: { HeaderPage, Footer },
  setup() {
    const featuresContainer = ref(null)
    const testimonialsContainer = ref(null)
    const carousel = ref(null)

    // Refs for scroll indicator
    const scrollIndicator = ref(null)
    const scrollDot = ref(null)

    let featuresObserver = null
    let testimonialsObserver = null

    // Carousel state
    const testimonials = [
      {
        quote:
          "GrowTrack really helped me understand my strengths and areas to improve. The platform is easy to use and the feedback from my peers was incredibly valuable. I would love to see even more features in the future!”",
        img: j,
        name: 'Rania EL jabri'
      },
      {
        quote:
          "Using GrowTrack was an amazing experience! It made me much more aware of my soft skills and how to develop them. The dashboard is clear, the feedback is motivating, and I genuinely feel more confident in my teamwork and communication skills.",
        img: k,
        name: 'Manal El Hassani'
      },
      {
        quote:
          "The interactive exercises on GrowTrack guided me every step of the way. I went from zero knowledge to mastering core soft skills in just weeks.",
        img: j,
        name: 'Narimane Roumani'
      },
      {
        quote:
          "I loved seeing my progress visualized daily. GrowTrack’s community support kept me motivated, even on tough days.",
        img: k,
        name: 'Aya El Hassani '
      }
    ]
    const currentIndex = ref(0)
    const slideWidth = ref(0)
    const gap = 16 // matches space-x-4 = 1rem = 16px
    let intervalId = null

    function nextSlide() {
      currentIndex.value =
        currentIndex.value < testimonials.length - 2
          ? currentIndex.value + 1
          : 0
    }
    function prevSlide() {
      currentIndex.value =
        currentIndex.value > 0
          ? currentIndex.value - 1
          : testimonials.length - 2
    }
    function startAutoScroll() {
      intervalId = setInterval(() => {
        nextSlide()
      }, 4000)
    }
    function stopAutoScroll() {
      clearInterval(intervalId)
      intervalId = null
    }
    function calculateSlideWidth() {
      const container = carousel.value
      if (container && container.children.length > 0) {
        slideWidth.value = container.children[0].offsetWidth
      }
    }

    // Intersection‐Observer utility
    const createObserver = (containerRef, childSelector, staggerDelay) => {
      if (!containerRef.value) return null

      const items = Array.from(
        containerRef.value.querySelectorAll(childSelector)
      )
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('show')
              observer.unobserve(entry.target)
            }
          })
        },
        { threshold: 0.2 }
      )

      items.forEach((el, idx) => {
        el.style.transitionDelay = `${idx * staggerDelay}s`
        observer.observe(el)
      })

      return observer
    }

    // Update the scroll‐dot position based on window scroll
    function updateScrollDot() {
      const indicatorEl = scrollIndicator.value
      const dotEl = scrollDot.value
      if (!indicatorEl || !dotEl) return

      const scrollTop = window.scrollY || window.pageYOffset
      const docHeight = document.documentElement.scrollHeight
      const winHeight = window.innerHeight
      const scrollable = docHeight - winHeight
      if (scrollable <= 0) {
        dotEl.style.top = '0px'
        return
      }

      // Height of the indicator track minus dot’s height
      const trackHeight = indicatorEl.clientHeight
      const dotHeight = dotEl.clientHeight
      const maxDotTop = trackHeight - dotHeight

      // Calculate percentage scrolled
      const scrollPerc = scrollTop / scrollable
      const newTop = scrollPerc * maxDotTop

      dotEl.style.top = `${newTop}px`
    }

    // Measure the footer’s height and push the bottom of the indicator up
    function updateIndicatorBottom() {
      const indicatorEl = scrollIndicator.value
      if (!indicatorEl) return

      const footerEl = document.querySelector('footer')
      if (!footerEl) {
        indicatorEl.style.bottom = '20px'
        return
      }

      const footerHeight = footerEl.offsetHeight
      indicatorEl.style.bottom = `${footerHeight + 20}px`
    }

    onMounted(() => {
      // Features observer
      featuresObserver = createObserver(
        featuresContainer,
        '.feature-item',
        0.15
      )

      // Testimonials observer
      testimonialsObserver = createObserver(
        testimonialsContainer,
        '.testimonial-item',
        0.2
      )

      // Carousel setup after DOM updates
      nextTick(() => {
        calculateSlideWidth()
        window.addEventListener('resize', calculateSlideWidth)
        startAutoScroll()
      })

      // Scroll‐indicator setup
      nextTick(() => {
        updateIndicatorBottom()
        updateScrollDot()
        window.addEventListener('resize', updateIndicatorBottom)
        window.addEventListener('resize', updateScrollDot)
        window.addEventListener('scroll', updateScrollDot)
      })
    })

    onBeforeUnmount(() => {
      if (featuresObserver) featuresObserver.disconnect()
      if (testimonialsObserver) testimonialsObserver.disconnect()
      window.removeEventListener('resize', calculateSlideWidth)
      stopAutoScroll()
      window.removeEventListener('scroll', updateScrollDot)
      window.removeEventListener('resize', updateScrollDot)
      window.removeEventListener('resize', updateIndicatorBottom)
    })

    return {
      featuresContainer,
      testimonialsContainer,
      carousel,
      testimonials,
      currentIndex,
      slideWidth,
      gap,
      nextSlide,
      prevSlide,
      scrollIndicator,
      scrollDot
    }
  }
}
</script>

<style scoped>
/* =====================================================================
   Animated Heading Styles for “Join the GrowTrack Community”
   ===================================================================== */

.animated-heading {
  display: flex;
  flex-wrap: wrap;
  font-weight: bold;
  font-size: 60px;
  color: #212121;
  font-family: 'Inter', sans-serif;
  line-height: 1.1;
  overflow: hidden;
}

.word {
  display: inline-block;
  opacity: 0;
  transform: translateY(40px);
  margin-right: 0.5rem;
  animation: fadeInUp 0.8s ease-out forwards;
  animation-delay: var(--delay);
}

/* Fade‐in‐up keyframes */
@keyframes fadeInUp {
  0% {
    opacity: 0;
    transform: translateY(40px) scale(0.95);
  }
  60% {
    opacity: 1;
    transform: translateY(-5px) scale(1.02);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* =====================================================================
   Feature Items & Icon Hover
   ===================================================================== */
.feature-item {
  opacity: 0;
  transform: translateY(40px);
  transition: transform 0.6s ease-out, opacity 0.6s ease-out;
}
.feature-item.show {
  opacity: 1;
  transform: translateY(0);
}

.icon-image {
  transition: transform 0.3s ease-out;
}
.icon-image:hover {
  transform: scale(1.1);
}

/* =====================================================================
   Hide Scrollbar
   ===================================================================== */
::-webkit-scrollbar {
  display: none;
}

/* =====================================================================
   Scroll Indicator Styles
   ===================================================================== */
.scroll-indicator {
  position: fixed;
  top: 100px; /* Adjust to start below header */
  right: 20px;
  width: 4px;
  background: rgba(105, 44, 243, 0.2);
  border-radius: 2px;
  bottom: 20px; /* Overridden by JS */
  z-index: 50;
}

.indicator-dot {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #692CF3;
  box-shadow:
    0 0 10px rgba(105, 44, 243, 0.8),
    0 0 20px rgba(105, 44, 243, 0.6);
  top: 0; /* Overridden by JS */
  transition: top 0.1s ease-out;
}
</style>

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
        <!-- Typing‐animation headline -->
        <h1 class="font-bold text-[60px] text-[#212121] font-inter">
          <span class="block">
            {{ typedText }}<span class="inline-block cursor"></span>
          </span>
        </h1>

        <p
          class="text-[20px] font-normal text-[#231B00] font-inter py-4 2xl:py-8 md:py-6 2xl:pr-5"
        >
          Innovative tools and actionable insights designed to elevate student performance and revolutionize your educational
          environment. Leverage state of the art resources that empower educators to personalize learning experiences,
          track progress in real time, and implement data-driven strategies.
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
          src="@/assets/profo.png"
          alt="Awesome hero page image"
          width="500"
          height="888"
        />
      </div>
    </div>

    <!-- ===================== Features Section ===================== -->
    <section style="background-color: #FDC096" class="py-16">
      <div>
        <!-- Titre centré -->
        <div class="text-center">
          <h2 class="text-6xl font-bold text-gray-900">
            Start From Scratch, Build Your Future
          </h2>
          <p class="text-[20px] font-normal text-[#000000] font-inter mt-4">
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
                  Pinpointing Student Strengths
                </h3>
                <p class="text-xl text-gray-600">
                  Assess your students’ soft skills to identify where each individual excels or needs support. Tailor lesson
                  plans to guide them toward meaningful growth.
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
                  Gathering Comprehensive Feedback
                </h3>
                <p class="text-xl text-gray-600">
                  Collect insights from colleagues, administrators, and the students themselves. This multi-source feedback highlights what’s
                  working and reveals areas to improve.
                </p>
              </div>
            </div>

            <!-- Bloc 3 -->
            <div class="feature-item flex items-start gap-4">
              <img
                src="@/assets/cahier.png"
                alt="Progress Icon"
                class="w-20 h-20 mt-1 icon-image"
              />
              <div>
                <h3 class="text-3xl font-semibold text-gray-800 mb-1">
                  Tracking Classroom Progress
                </h3>
                <p class="text-xl text-gray-600">
                  Use real-time dashboards to monitor overall performance and spot emerging patterns. Respond quickly and effectively to keep
                  your students on the right track.
                </p>
              </div>
            </div>

            <!-- Bloc 4 -->
            <div class="feature-item flex items-start gap-4">
              <img
                src="@/assets/person.png"
                alt="Recognition Icon"
                class="w-20 h-20 mt-1 icon-image"
              />
              <div>
                <h3 class="text-3xl font-semibold text-gray-800 mb-1">
                  Celebrating Milestones
                </h3>
                <p class="text-xl text-gray-600">
                  Acknowledge achievements at individual and group levels. By spotlighting progress, you cultivate a classroom culture that inspires
                  and motivates everyone to aim higher.
                </p>
              </div>
            </div>
          </div>

          <!-- Illustration (dans la même grille) -->
          <div class="feature-item flex justify-center">
            <img
              src="@/assets/Professor-pana.svg"
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
          What Our Professors Say
        </h2>
        <p class="text-[20px] font-normal text-[#000000] font-inter mt-4">
          Real Feedback From Professors Using GrowTrack To Empower Student Success.
        </p>

        <!-- Carousel wrapper -->
        <div ref="testimonialsContainer" class="mt-20 relative overflow-hidden carousel-wrapper">
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
import HeaderPage from "@/components/Header.vue"
import Footer from "@/components/Footer.vue"
import prof1 from "@/assets/prof1.png"
import prof2 from "@/assets/prof3.jpg"
import prof3 from "@/assets/prof2.jpg"

export default {
  name: 'Teachers',
  components: {
    HeaderPage,
    Footer
  },
  setup() {
    // — Typing effect state —
    const fullText = 'Empower Your Teaching Journey Right Now'
    const typedText = ref('')

    function typeWriter() {
      let idx = 0
      const speed = 70 // milliseconds per character
      const interval = setInterval(() => {
        if (idx < fullText.length) {
          typedText.value += fullText.charAt(idx)
          idx++
        } else {
          clearInterval(interval)
        }
      }, speed)
    }

    // — IntersectionObserver utility for features/testimonials —
    const featuresContainer = ref(null)
    const testimonialsContainer = ref(null)
    const carousel = ref(null)

    let featuresObserver = null
    let testimonialsObserver = null

    function createObserver(containerRef, childSelector, staggerDelay) {
      if (!containerRef.value) return null

      const items = Array.from(containerRef.value.querySelectorAll(childSelector))
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

    // — Carousel state for testimonials —
    const testimonials = [
      {
        quote:
          "GrowTrack is an excellent tool for evaluating students' soft skills. It allows clear tracking of skills that are often difficult to measure. I especially appreciate the quality of the feedback and how it encourages student autonomy. Some small visual improvements could make the platform even smoother to use!",
        img: prof1,
        name: 'Mr. Khalid Alami'
      },
      {
        quote:
          "GrowTrack has greatly helped me guide my students in developing their soft skills. The assessments are well-structured, the dashboards are clear, and the personalized feedback is highly valuable. It’s a complete and motivating platform, both for teachers and for students!",
        img: prof2,
        name: 'Mme. Sara Bennani'
      },
      {
        quote:
          "The interactive modules for teachers are fantastic. I can track class-wide performance and provide targeted support instantly. My students love the immediate insights!",
        img: prof3,
        name: 'Mr. Ahmed El Idrissi'
      },
      {
        quote:
          "Using GrowTrack in my classroom transformed how I evaluate soft skills. Real-time updates and peer-feedback features keep everyone engaged and accountable.",
        img: prof2,
        name: 'Mme Fatima Zahra Toukali' 
      }
    ]
    const currentIndex = ref(0)
    const slideWidth = ref(0)
    const gap = 16 // equals space-x-4 (1rem = 16px)
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

    // — Scroll‐indicator logic —
    const scrollIndicator = ref(null)
    const scrollDot = ref(null)

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

      const trackHeight = indicatorEl.clientHeight
      const dotHeight = dotEl.clientHeight
      const maxDotTop = trackHeight - dotHeight
      const scrollPerc = scrollTop / scrollable
      const newTop = scrollPerc * maxDotTop
      dotEl.style.top = `${newTop}px`
    }

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
      // Start typing animation
      typeWriter()

      // Set up observers for features/testimonials fade‐in
      featuresObserver = createObserver(
        featuresContainer,
        '.feature-item',
        0.15
      )
      testimonialsObserver = createObserver(
        testimonialsContainer,
        '.testimonial-item',
        0.2
      )

      // Carousel measurements & auto scroll
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
        window.addEventListener('scroll', updateScrollDot)
        window.addEventListener('resize', updateScrollDot)
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
      typedText,
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
/* ===================== Typing Cursor Styling ===================== */
@keyframes blink {
  0%, 50% {
    opacity: 1;
  }
  51%, 100% {
    opacity: 0;
  }
}
.cursor {
  display: inline-block;
  width: 2px;
  background-color: currentColor;
  animation: blink 1s step-start infinite;
  margin-left: 2px;
}

/* ----------------------------------------------------------------------------
   “slide up & fade in” base state for both feature blocks and testimonial blocks
   ---------------------------------------------------------------------------- */
.feature-item,
.testimonial-item {
  opacity: 0;
  transform: translateY(40px);
  transition: transform 0.6s ease-out, opacity 0.6s ease-out;
}

/* When the item scrolls into view, add “show” => fade in and slide up */
.feature-item.show,
.testimonial-item.show {
  opacity: 1;
  transform: translateY(0);
}

/* Icon hover scale effect (purely decorative) */
.icon-image {
  transition: transform 0.3s ease-out;
}
.icon-image:hover {
  transform: scale(1.1);
}

/* Hide scrollbar */
::-webkit-scrollbar {
  display: none;
}

/* Carousel container wrapper to ensure overflow hidden */
.carousel-wrapper {
  overflow: hidden;
}

/* ===================== Scroll Indicator Styles ===================== */
.scroll-indicator {
  position: fixed;
  top: 100px; /* Start below the header (adjust if needed) */
  right: 20px;
  width: 4px; /* Track is 4px wide */
  background: rgba(105, 44, 243, 0.2); /* 20% opacity of #692CF3 */
  border-radius: 2px;
  /* bottom will be overridden by JS to (footerHeight + 20px) */
  bottom: 20px;
  z-index: 50;
}

.indicator-dot {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 16px;  /* Dot diameter */
  height: 16px; /* Dot diameter */
  border-radius: 50%;
  background: #692CF3; /* Solid brand color */
  box-shadow:
    0 0 10px rgba(105, 44, 243, 0.8),
    0 0 20px rgba(105, 44, 243, 0.6);
  top: 0; /* JS will override this */
  transition: top 0.1s ease-out;
}
</style>

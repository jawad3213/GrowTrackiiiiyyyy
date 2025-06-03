<template>
  <div>
    <!-- Header -->
    <HeaderPage />

    <!-- Hero + CTA -->
    <div
      class="items-center w-10/12 grid-cols-2 mx-auto overflow-x-hidden lg:grid md:py-0 lg:py-0 xl:py-0 lg:mt-3 xl:mt-5"
      data-aos="fade-right"
      data-aos-duration="800"
    >
      <div class="pr-2 md:mb-14 py-14 md:py-0">
        <!-- Typing Animation Headline -->
        <h1 class="font-bold text-[50px] text-[#212121] font-inter">
          <span class="block w-full">
            {{ typedText }}<span class="inline-block cursor"></span>
          </span>
        </h1>

        <p class="text-[20px] font-normal text-[#231B00] font-inter py-4 2xl:py-8 md:py-6 2xl:pr-5">
          The skills you grow today unlock the opportunities of tomorrow. Your
          future begins with what you choose to learn now.
        </p>
        <div class="mt-4">
          <router-link
            to="/ContactUs"
            class="inline-block px-8 py-4 text-white text-xl font-semibold rounded-full"
            style="background: linear-gradient(to right, #692CF3, #F97316);"
          >
            Contact us for more information
          </router-link>
        </div>
      </div>
      <div class="pb-0 overflow-hidden md:p-10 l:p-0 sm:pb-0">
        <img
          id="heroImg1"
          class="transition-all duration-300 ease-in-out hover:scale-105 lg:w-full sm:mx-auto sm:w-5/6 sm:pb-12 lg:pb-0"
          src="@/assets/LoadingPage.jpg"
          alt="Awesome hero page image"
          width="500"
          height="888"
        />
      </div>
    </div>

    <!-- Sponsors slider -->
    <div class="bg-[#DAD1EE] overflow-hidden">
      <div ref="marquee" class="flex items-center space-x-12 will-change-transform">
        <!-- Vos 7 logos initiaux -->
        <img
          src="@/assets/spons1.png"
          alt="Sponsor 1"
          class="marquee-item w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 object-contain"
        />
        <img
          src="@/assets/spons2.png"
          alt="Sponsor 2"
          class="marquee-item w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 object-contain"
        />
        <img
          src="@/assets/sponso3.png"
          alt="Sponsor 3"
          class="marquee-item w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 object-contain"
        />
        <img
          src="@/assets/sponso4.png"
          alt="Sponsor 4"
          class="marquee-item w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 object-contain"
        />
        <img
          src="@/assets/sponso5.png"
          alt="Sponsor 5"
          class="marquee-item w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 object-contain"
        />
        <img
          src="@/assets/sponso6.png"
          alt="Sponsor 6"
          class="marquee-item w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 object-contain"
        />
        <img
          src="@/assets/sponso7.png"
          alt="Sponsor 7"
          class="marquee-item w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 object-contain"
        />
      </div>
    </div>

    <!-- Features -->
    <section class="bg-white py-16 px-6">
      <h2 class="text-center text-6xl md:text-5xl font-bold text-[#F97316] mb-12">
        Grow Professionally Through Your Soft Skills
      </h2>
      <!-- Added ref here for IntersectionObserver -->
      <div
        ref="featuresContainer"
        class="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 text-center"
      >
        <div class="feature-item">
          <img
            src="@/assets/icon1.png"
            alt="Auto-évaluation"
            class="mx-auto w-30 h-30 mb-4 icon-image"
          />
          <h3 class="text-[#692CF3] font-bold mb-2 text-xl">
            Self-assessment made easy
          </h3>
          <p class="text-gray-800">
            Answer simple questionnaires to evaluate your skills,<br />
            see where you shine, and identify areas<br />
            you could improve.
          </p>
        </div>
        <div class="feature-item">
          <img
            src="@/assets/icon3.png"
            alt="Évaluation 360"
            class="mx-auto w-30 h-30 mb-4 icon-image"
          />
          <h3 class="text-[#692CF3] font-bold mb-2 text-xl">
            Evaluations 360°
          </h3>
          <p class="text-gray-800">
            Get constructive feedback from your <br />
            classmates, professors, tutors, and even external<br />
            supervisors to help you grow and improve.
          </p>
        </div>
        <div class="feature-item">
          <img
            src="@/assets/icon4.png"
            alt="Progression"
            class="mx-auto w-30 h-30 mb-4 icon-image"
          />
          <h3 class="text-[#692CF3] font-bold mb-2 text-xl">
            Visual tracking of your progress
          </h3>
          <p class="text-gray-800">
            Explore clear dashboards and charts to monitor<br />
            your growth and track your development over time.
          </p>
        </div>
        <div class="feature-item">
          <img
            src="@/assets/icon2.png"
            alt="Défis"
            class="mx-auto w-30 h-30 mb-4 icon-image"
          />
          <h3 class="text-[#692CF3] font-bold mb-2 text-xl">
            Challenge detection and monitoring
          </h3>
          <p class="text-gray-800">
            As soon as any sign of difficulty arises, <br />
            the platform alerts you, allowing you to take quick <br />
            action and stay on track.
          </p>
        </div>
      </div>
    </section>

    <!-- ===== Professional Timeline ===== -->
    <section class="timeline-section bg-[#F9F9F9] py-16 px-4">
      <h2 class="text-center text-6xl md:text-5xl font-bold  text-[#692CF3] mb-12">
        How the System Works
      </h2>
      <div class="timeline-container relative max-w-3xl mx-auto">
        <!-- Vertical line -->
        <div class="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-[#692CF3]/20"></div>

        <!-- Timeline Item 1 -->
        <div
          class="timeline-item opacity-0 transform translate-y-8 transition duration-700 ease-out"
          ref="timelineItems"
        >
          <div class="timeline-content flex items-center">
            <div class="w-1/2 pr-8 text-right">
              
              <h3 class="text-2xl font-semibold text-gray-800">
                 Contact Us for More Information
              </h3>
              <p class="text-gray-600 mt-2">
                You will get a free-trial admin dashboard so you can test all the functionality for one month.
              </p>
            </div>
            <div class="timeline-point bg-[#692CF3] w-6 h-6 rounded-full border-4 border-white shadow-lg"></div>
          </div>
        </div>

        <!-- Timeline Item 2 -->
        <div
          class="timeline-item opacity-0 transform translate-y-8 transition duration-700 ease-out"
          ref="timelineItems"
        >
          <div class="timeline-content flex items-center">
            <div class="timeline-point bg-[#692CF3] w-6 h-6 rounded-full border-4 border-white shadow-lg"></div>
            <div class="w-1/2 pl-8 text-left">
              
              <h3 class="text-2xl font-semibold text-gray-800">
                Start to create professors
              </h3>
              <p class="text-gray-600 mt-2">
                Created professors and assigned each to a class and course so they can evaluate only their own students, not students from other classes.
              </p>
            </div>
          </div>
        </div>

        <!-- Timeline Item 3 -->
        <div
          class="timeline-item opacity-0 transform translate-y-8 transition duration-700 ease-out"
          ref="timelineItems"
        >
          <div class="timeline-content flex items-center">
            <div class="w-1/2 pr-8 text-right">
              <h3 class="text-2xl font-semibold text-gray-800">
                Assign Students to  their Classes
              </h3>
              <p class="text-gray-600 mt-2">
                Created students and assigned each to a class and field so professors can assign them to a project and evaluate their team on that same project, not outside.
              </p>
            </div>
            <div class="timeline-point bg-[#692CF3] w-6 h-6 rounded-full border-4 border-white shadow-lg"></div>
          </div>
        </div>

        <!-- Timeline Item 4 -->
        <div
          class="timeline-item opacity-0 transform translate-y-8 transition duration-700 ease-out"
          ref="timelineItems"
        >
          <div class="timeline-content flex items-center">
            <div class="timeline-point bg-[#692CF3] w-6 h-6 rounded-full border-4 border-white shadow-lg"></div>
            <div class="w-1/2 pl-8 text-left">
              <h3 class="text-2xl font-semibold text-gray-800">
                Start the Evaluation Journey
              </h3>
              <p class="text-gray-600 mt-2">
                An email and password will be send to them so they can access their account and start the evaluation journey with project and class restrictions.
              </p>
            </div>
          </div>
        </div>

        <!-- Timeline Item 5 -->
        <div
          class="timeline-item opacity-0 transform translate-y-8 transition duration-700 ease-out"
          ref="timelineItems"
        >
          <div class="timeline-content flex items-center">
            <div class="w-1/2 pr-8 text-right">
              <h3 class="text-2xl font-semibold text-gray-800">
                Monthly Platform Activity Statistics
              </h3>
              <p class="text-gray-600 mt-2">
                Generated monthly meaningful statistics for professors, admins, and students to reflect platform activity.
              </p>
            </div>
            <div class="timeline-point bg-[#692CF3] w-6 h-6 rounded-full border-4 border-white shadow-lg"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ -->
    <section class="bg-[#EDE6FF] py-5 px-6">
      <div class="text-center mb-12">
        <h2 class="text-6xl font-bold text-gray-900">
          Got Questions? We’ve Got Answers
        </h2>
        <p class="text-[20px] font-normal text-[#000000] font-inter mt-4">
          Practical Solutions To Elevate Your Soft Skills And Teaching Experience
        </p>
      </div>
      <div class="max-w-6xl mx-auto px-4 py-5 space-y-16">
        <!-- FAQ Item 1 (from-left) -->
        <div
          class="faq-item from-left flex flex-col md:flex-row items-center gap-0"
        >
          <img
            src="@/assets/featt1.png"
            alt="FAQ 1"
            class="w-80 h-80 object-contain ml-25"
          />
          <div class="max-w-xl">
            <h3
              class="text-[#692CF3] font-bold text-2xl md:text-3xl lg:text-4xl mb-4 leading-snug"
            >
              How Can I Track My Soft Skills Without Spending Hours On Evaluations?
            </h3>
            <p class="text-gray-800 text-base md:text-lg">
              GrowTrack offers quick self-assessment quizzes that take just minutes to complete. Your progress is automatically updated on a personal dashboard, so you can see your improvement at a glance.
            </p>
          </div>
        </div>

        <!-- FAQ Item 2 (from-right) -->
        <div
          class="faq-item from-right flex flex-col md:flex-row-reverse items-center gap-12"
        >
          <img
            src="@/assets/featt2.png"
            alt="FAQ 2"
            class="w-80 h-80 object-contain mr-20"
          />
          <div class="max-w-xl">
            <h3
              class="text-[#692CF3] font-bold text-2xl md:text-3xl lg:text-4xl mb-4 leading-snug"
            >
              How does GrowTrack ensure anonymity when delivering signals?.What Can I Do?
            </h3>
            <p class="text-gray-800 text-base md:text-lg">
            Our platform’s 360° co-evaluation strips all identifying information from each signal and routes feedback through an anonymization layer. So partners receive honest signals without ever knowing who sent them.  
            </p>
          </div>
        </div>

        <!-- FAQ Item 3 (from-left) -->
        <div
          class="faq-item from-left flex flex-col md:flex-row items-center gap-12"
        >
          <img
            src="@/assets/featt3.png"
            alt="FAQ 3"
            class="w-80 h-80 object-contain ml-25"
          />
          <div class="max-w-xl">
            <h3
              class="text-[#692CF3] font-bold text-2xl md:text-3xl lg:text-4xl mb-4 leading-snug"
            >
              As a professor, how can I view my student’s history?
            </h3>
            <p class="text-gray-800 text-base md:text-lg">
           Our platform allows you to upload a PDF for each student you teach, containing their complete history of marks over time and all signal records.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Institutions testimonials -->
    <section class="bg-white py-33 px-6">
      <div class="max-w-6xl mx-auto text-center relative">
        <h2 class="text-6xl font-bold text-gray-900">
          What Our Institutions Say
        </h2>
        <p class="text-[20px] font-normal text-[#000000] font-inter mt-4">
          Real Feedback From Universities And Schools Using GrowTrack To Empower
          Student Success.
        </p>

        <!-- Carousel wrapper -->
        <div class="mt-20 relative overflow-hidden carousel-wrapper">
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
            <!-- Slide 1 -->
            <div
              v-for="(item, idx) in testimonials"
              :key="idx"
              class="flex-shrink-0 w-[calc(50%-0.5rem)]"
            >
              <div class="flex flex-col items-center text-center px-6">
                <div class="flex justify-center mb-3 text-orange-500 text-xl">
                  <span>★</span><span>★</span><span>★</span><span>★</span><span :class="idx === 0 ? 'text-gray-400' : ''">★</span>
                </div>
                <p class="text-[20px] font-medium text-[#424242] font-inter mb-6 w-[300px] italic">
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

    <!-- Footer -->
    <Footer />

    <!-- ===================== Scroll Indicator (NEW) ===================== -->
    <div ref="scrollIndicator" class="scroll-indicator">
      <div ref="scrollDot" class="indicator-dot"></div>
    </div>
  </div>
</template>

<script>
import spons1Img from '@/assets/spons1.png'
import spons2Img from '@/assets/sponss6.png'
import spons3Img from '@/assets/sponss7.png'
import spons4Img from '@/assets/spons2.png'
import spons5Img from '@/assets/sponso3.png'
import spons6Img from '@/assets/sponso4.png'
import spons7Img from '@/assets/sponso5.png'


import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import HeaderPage from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'

export default {
  name: 'LoadingPage',
  components: { HeaderPage, Footer },
  data() {
    return {
      // Typing animation state
      fullText: 'Master Your Soft Skills with GrowTrack. Your Future Begins Today ',
      typedText: '',

      // Marquee speed in px/frame
      marqueeSpeed: 1,

      // Carousel data
      testimonials: [
        {
          quote:
            "GrowTrack has transformed our soft skills evaluations. Clear dashboards and diverse feedback keep our students motivated and agile, essential for today's workplace.",
          img: spons1Img,
          name: 'Abdelmalek Essaâdi'
        },
        {
          quote:
            "Using GrowTrack, our institution has seen a 30% increase in student engagement. Real-time insights help us personalize support.",
          img: spons3Img ,
          name: 'University Cadi Ayyad'
        },
        {
          quote:
            " Using GrowTrack’s Rating and Peer Feedback, our institution identified 25% more at‐risk students early. Real‐time flags allow us to intervene promptly.",
          img: spons5Img,
          name: 'University Moulay Ismaïl'
        },
        {
          quote:
            "The dashboard visuals encourage our staff to mentor students proactively. GrowTrack’s feedback loop is invaluable.",
          img: spons6Img,
          name: 'University Ibn Zohr'
        }
      ],
      currentIndex: 0,
      slideWidth: 0,
      gap: 16, // corresponds to space-x-4 (1rem = 16px)
      intervalId: null,
      featuresObserver: null,
      faqObserver: null,

      // (NEW) refs for scroll-indicator track & dot
      scrollIndicatorRef: null,
      scrollDotRef: null
    }
  },
  methods: {
    // Typing effect
    typeWriter() {
      let idx = 0
      const speed = 50  // milliseconds between each character
      const typeInterval = setInterval(() => {
        if (idx < this.fullText.length) {
          this.typedText += this.fullText.charAt(idx)
          idx++
        } else {
          clearInterval(typeInterval)
        }
      }, speed)
    },

    // ===== Carousel methods =====
    nextSlide() {
      this.currentIndex =
        this.currentIndex < this.testimonials.length - 2
          ? this.currentIndex + 1
          : 0
    },
    prevSlide() {
      this.currentIndex =
        this.currentIndex > 0
          ? this.currentIndex - 1
          : this.testimonials.length - 2
    },
    startAutoScroll() {
      this.intervalId = setInterval(() => {
        this.nextSlide()
      }, 3000)
    },
    stopAutoScroll() {
      clearInterval(this.intervalId)
      this.intervalId = null
    },
    calculateSlideWidth() {
      const container = this.$refs.carousel
      if (container && container.children.length > 0) {
        const firstSlide = container.children[0]
        this.slideWidth = firstSlide.offsetWidth
      }
    },

    // ===== Marquee & FAQ & Features & Timeline methods =====
    animateMarqueeLoop() {
      const marquee = this.$refs.marquee
      const resetPoint = marquee.scrollWidth / 2
      let pos = -resetPoint

      const animateMarquee = () => {
        pos += this.marqueeSpeed
        if (pos >= 0) pos = -resetPoint
        marquee.style.transform = `translateX(${pos}px)`
        requestAnimationFrame(animateMarquee)
      }
      animateMarquee()
    },
    setupFAQObserver() {
      const faqItems = Array.from(this.$el.querySelectorAll('.faq-item'))
      const observerOptions = { threshold: 0.2 }
      this.faqObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('show')
            this.faqObserver.unobserve(entry.target)
          }
        })
      }, observerOptions)

      faqItems.forEach((el, index) => {
        el.style.transitionDelay = `${index * 0.2}s`
        this.faqObserver.observe(el)
      })
    },
    setupFeaturesObserver() {
      const featureItems = Array.from(this.$el.querySelectorAll('.feature-item'))
      const observerOptions = { threshold: 0.2 }
      this.featuresObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('show')
            this.featuresObserver.unobserve(entry.target)
          }
        })
      }, observerOptions)

      featureItems.forEach((el, index) => {
        el.style.transitionDelay = `${index * 0.15}s`
        this.featuresObserver.observe(el)
      })
    },
    setupTimelineObserver() {
      const items = Array.from(this.$el.querySelectorAll('.timeline-item'))
      const observerOptions = { threshold: 0.2 }
      const tlObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('show')
            tlObserver.unobserve(entry.target)
          }
        })
      }, observerOptions)

      items.forEach((el, index) => {
        el.style.transitionDelay = `${index * 0.2}s`
        tlObserver.observe(el)
      })
    },

    // ===== SCROLL-INDICATOR methods =====
    updateScrollDot() {
      const indicatorEl = this.$refs.scrollIndicator
      const dotEl = this.$refs.scrollDot
      if (!indicatorEl || !dotEl) return

      const scrollTop = window.scrollY || window.pageYOffset
      const docHeight = document.documentElement.scrollHeight
      const winHeight = window.innerHeight
      const scrollable = docHeight - winHeight
      if (scrollable <= 0) {
        dotEl.style.top = '0px'
        return
      }

      // Height of the indicator track (between top:100px and bottom above footer) minus dot’s height
      const trackHeight = indicatorEl.clientHeight
      const dotHeight = dotEl.clientHeight
      const maxDotTop = trackHeight - dotHeight

      const scrollPerc = scrollTop / scrollable
      const newTop = scrollPerc * maxDotTop
      dotEl.style.top = `${newTop}px`
    },
    updateIndicatorBottom() {
      const indicatorEl = this.$refs.scrollIndicator
      if (!indicatorEl) return

      // Find the <footer> element
      const footerEl = document.querySelector('footer')
      if (!footerEl) {
        // fallback if no <footer> found
        indicatorEl.style.bottom = '20px'
        return
      }

      const footerHeight = footerEl.offsetHeight
      indicatorEl.style.bottom = `${footerHeight + 20}px`
    }
  },
  mounted() {
    // Start typing animation on mount
    this.typeWriter()

    // ===== Marquee (sponsors slider) =====
    const marquee = this.$refs.marquee
    const originals = Array.from(marquee.children)
    const clones = originals.map(el => el.cloneNode(true))
    clones.reverse().forEach(clone => marquee.insertBefore(clone, marquee.firstChild))
    this.animateMarqueeLoop()

    // ===== FAQ intersection observer =====
    this.setupFAQObserver()

    // ===== Features intersection observer =====
    this.setupFeaturesObserver()

    // ===== Timeline intersection observer =====
    this.setupTimelineObserver()

    // ===== Carousel setup =====
    nextTick(() => {
      this.calculateSlideWidth()
      window.addEventListener('resize', this.calculateSlideWidth)
      this.startAutoScroll()
    })

    // ===== SCROLL-INDICATOR setup =====
    nextTick(() => {
      // Position bottom above footer
      this.updateIndicatorBottom()
      // Position dot based on current scroll
      this.updateScrollDot()

      window.addEventListener('resize', this.updateIndicatorBottom)
      window.addEventListener('scroll', this.updateScrollDot)
      window.addEventListener('resize', this.updateScrollDot)
    })
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.calculateSlideWidth)
    this.stopAutoScroll()

    if (this.faqObserver) {
      this.faqObserver.disconnect()
    }
    if (this.featuresObserver) {
      this.featuresObserver.disconnect()
    }

    // Cleanup scroll/resize listeners for indicator
    window.removeEventListener('scroll', this.updateScrollDot)
    window.removeEventListener('resize', this.updateScrollDot)
    window.removeEventListener('resize', this.updateIndicatorBottom)
  }
}
</script>

<style scoped>
/* ========== Typing Cursor Styling ========== */
@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}
.cursor {
  display: inline-block;
  width: 2px;
  background-color: currentColor;
  animation: blink 1s step-start infinite;
  margin-left: 2px;
}

/* ========== General Styling ========== */
/* Adjust spacing between marquee logos */
.marquee-item + .marquee-item {
  margin-left: 3rem;
}

/* FAQ items: fade-in and slide from left/right */
.faq-item {
  opacity: 0;
  transition: transform 0.6s ease-in-out, opacity 0.6s ease-in-out;
}
.from-left {
  transform: translateX(-100px);
}
.from-right {
  transform: translateX(100px);
}
.faq-item.show {
  opacity: 1;
  transform: translateX(0);
}

/* Features fade-in & slide-up */
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

/* Carousel overflow */
.carousel-wrapper {
  overflow: hidden;
}

/* ========== Timeline Styling ========== */
.timeline-section {
  position: relative;
}
.timeline-container {
  position: relative;
  padding-top: 2rem;
  padding-bottom: 2rem;
}
.timeline-container::before {
  content: '';
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 3px;
  height: 100%;
  background-color: rgba(105, 44, 243, 0.2);
  z-index: 1;
}
.timeline-item {
  position: relative;
  width: 100%;
  margin-bottom: 3rem;
}
.timeline-content {
  display: flex;
  align-items: flex-start;
  position: relative;
  z-index: 2;
}
.timeline-point {
  position: absolute;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
  top: 0.5rem;
  z-index: 3;
}
.timeline-item:nth-child(odd) .timeline-content {
  flex-direction: row-reverse;
}
.timeline-item:nth-child(odd) .timeline-content > div:first-child {
  text-align: right;
  padding-right: 2rem;
}
.timeline-item:nth-child(even) .timeline-content > div:last-child {
  text-align: left;
  padding-left: 2rem;
}
/* Text blocks */
.timeline-item p {
  margin-top: 0.25rem;
  color: #4B5563; /* gray-600 */
}
.timeline-item h3 {
  color: #1F2937; /* gray-800 */
}

/* Fade-in animation */
.timeline-item {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.6s ease-out, transform 0.6s ease-out;
}
.timeline-item.show {
  opacity: 1;
  transform: translateY(0);
}

/* ========== Scroll Indicator Styling ========== */
.scroll-indicator {
  position: fixed;
  top: 100px; /* start below header */
  right: 20px;
  width: 4px;
  background: rgba(105, 44, 243, 0.2);
  border-radius: 2px;
  bottom: 20px; /* fallback, overridden by JS */
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
  top: 0; /* overridden by JS */
  transition: top 0.1s ease-out;
}
</style>

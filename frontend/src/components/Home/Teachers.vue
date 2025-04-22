<template>
    <HeaderPage />
    <div class="items-center w-10/12 grid-cols-2 mx-auto overflow-x-hidden lg:grid md:py-14 lg:py-24 xl:py-14 lg:mt-3 xl:mt-5" data-aos="fade-right" data-aos-duration="800">
       <div class="pr-2 md:mb-14 py-14 md:py-0">
         <h1 style="font-weight: bold; font-size: 60px; color: #212121; font-family: 'Inter', sans-serif;">
            <span class="block w-full">Empower Your Teaching </span> 
            Journey
         </h1>
          <p class="text-[20px] font-normal text-[#231B00] font-inter py-4 2xl:py-8 md:py-6 2xl:pr-5">
            Innovative tools and actionable insights designed to elevate student performance and revolutionize your educational environment. 
            Leverage state of the art resources that empower educators to personalize learning experiences, 
            track progress in real time, and implement data-driven strategies.       
         </p>

  <div class="mt-4">
    <router-link to="/Login" 
      class="inline-block px-8 py-4 text-white text-base text-xl font-semibold rounded-full"
      style="background: linear-gradient(to right, #692CF3, #F97316);">
      Start Now
    </router-link>
  </div>


</div>
  
  <div class="pb-0 overflow-hidden md:p-10 lg:p-0 sm:pb-0">
    <img id="heroImg1" class="transition-all duration-300 ease-in-out hover:scale-105 lg:w-5/6 sm:mx-auto sm:w-5/6 sm:pb-12 lg:pb-0" src="@/assets/students.jpg" alt="Awesome hero page image" width="500" height="888"/>
  </div>
</div>


<section style="background-color: #FDC096" class="py-16">
  <div>
    
    <!-- Titre centré -->
    <div class="text-center">
      <h2 class="text-6xl font-bold text-gray-900">
        Start From Scratch, Build Your Future
      </h2>
      <p class="text-[20px] font-normal text-[#000000] font-inter  mt-4">
        With GrowTrack, You Can Kick-Start Your Journey By
      </p>
    </div>

    <!-- Contenu grille -->
    <div class="w-10/12 mx-auto overflow-x-hidden grid grid-cols-1 lg:grid-cols-2 gap-12 items-center" data-aos="fade-right" data-aos-duration="800">

      <!-- Liste des fonctionnalités -->
      <div class="space-y-8">
        <!-- Bloc 1 -->
        <div class="flex items-start gap-4">
          <img src="@/assets/strengh.jpg" alt="Strength Icon" class="w-20 h-20 mt-1" />
          <div>
            <h3 class="text-3xl font-semibold text-gray-800 mb-1">
                Pinpointing Student Strengths
            </h3>
            <p class="text-xl text-gray-600 text-sm">
                Assess your students’ soft skills to identify where each individual excels or needs support. Tailor lesson plans to guide them toward meaningful growth.            </p>
          </div>
        </div>

        <!-- Bloc 2 -->
        <div class="flex items-start gap-4">
          <img src="@/assets/gathering.jpg" alt="Feedback Icon" class="w-20 h-20 mt-1" />
          <div>
            <h3 class="text-3xl font-semibold text-gray-800 mb-1">
                Gathering Comprehensive Feedback
            </h3>
            <p class=" text-xl text-gray-600 text-sm">
                Collect insights from colleagues, administrators, and the students themselves. This multi-source feedback highlights what’s working and reveals areas to improve.            </p>
          </div>
        </div>

        <!-- Bloc 3 -->
        <div class="flex items-start gap-4">
          <img src="@/assets/cahier.jpg" alt="Progress Icon" class="w-20 h-20 mt-1" />
          <div>
            <h3 class="text-3xl text-3xl font-semibold text-gray-800 mb-1">
                Tracking Classroom Progress            </h3>
            <p class="text-xl text-gray-600 text-sm">
                Use real-time dashboards to monitor overall performance and spot emerging patterns. Respond quickly and effectively to keep your students on the right track.            </p>
          </div>
        </div>

        <!-- Bloc 4 -->
        <div class="flex items-start gap-4">
          <img src="@/assets/person.jpg" alt="Recognition Icon" class="w-20 h-20 mt-1" />
          <div>
            <h3 class="text-3xl font-semibold text-gray-800 mb-1">
                Celebrating Milestones            </h3>
            <p class="text-xl text-gray-600 text-sm">
Acknowledge achievements at individual and group levels. By spotlighting progress, you cultivate a classroom culture that inspires and motivates everyone to aim higher.            </p>
          </div>
        </div>
      </div>

      <!-- Illustration (dans la même grille) -->
      <div class="flex justify-center">
        <img src="@/assets/Professor-pana.svg" alt="Success Illustration" class="w-11/12 " />
      </div>

    </div>
  </div>
</section>




        <section class="bg-white py-33 px-6">
  <div class="max-w-6xl mx-auto text-center">
    <!-- Title -->
    <h2 class="text-6xl font-bold text-gray-900">
      What Our Professors Say
    </h2>
    <p class="text-[20px] font-normal text-[#000000] font-inter  mt-4">
      Real Feedback From Professors Using GrowTrack To Empower Student Success.    </p>

    <!-- Testimonials container -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-1 items-center mt-20">

      <!-- Testimonial 1 -->
      <div class="flex flex-col items-center text-center px-6">
        <!-- Stars -->
        <div class="flex justify-center mb-3 text-orange-500 text-xl">
          <span>★</span><span>★</span><span>★</span><span>★</span><span class="text-gray-400">★</span>
        </div>

        <!-- Quote -->
        <p class=" class=text-[20px] font-medium text-[#424242] font-inter mb-6 w-[300px] italic">
          "GrowTrack is an excellent tool for evaluating students' soft skills. It allows clear tracking of skills that are often difficult to measure. I especially appreciate the quality of the feedback and how it encourages student autonomy. Some small visual improvements could make the platform even smoother to use!”
        </p>

        <!-- Logo + name -->
        <img src="@/assets/prof1.png" alt="photo1" class="w-12 h-12 object-contain mb-2">
        <p class="text-sm text-gray-700 font-medium">Mr.John</p>
      </div>

      <!-- Testimonial 2 -->
      <div class="flex flex-col items-center text-center px-6">
        <!-- Stars -->
        <div class="flex justify-center mb-3 text-orange-500 text-xl">
          <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
        </div>

        <!-- Quote -->
        <p class=" class=text-[20px] font-medium text-[#424242] font-inter mb-6 w-[300px] italic">
          "GrowTrack has greatly helped me guide my students in developing their soft skills. The assessments are well-structured, the dashboards are clear, and the personalized feedback is highly valuable. It’s a complete and motivating platform, both for teachers and for students!"
        </p>

        <!-- Logo + name -->
        <img src="@/assets/prof3.jpg" alt="photo2" class="w-12 h-12 object-contain mb-2">
        <p class="text-sm text-gray-700 font-medium">Ms.Sara</p>
      </div>
    </div>

    
  </div>
</section>
<footer class="bg-gradient-to-r from-[#692CF3] to-[#F97316] text-white py-6 px-4">
  <div class="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
    
    <!-- Logo -->
    <div class="flex items-center space-x-2">
      <img src="@/assets/logo3.jpg" alt="Logo" class="w-50 h-10 object-contain" />

    </div>

    
    <div class="flex space-x-8 justify-center gap-4 text-lg font-medium">
      <span>© Copyright 2025 GrowTrack</span>
      <router-link to="/AboutUs" class="hover:underline">About Us</router-link>
      <router-link to="/ContactUs" class="hover:underline">Contact Us</router-link>
      <router-link to="/Teachers" class="hover:underline">Teachers</router-link>
      <router-link to="/Students" class="hover:underline">Students</router-link>
      <router-link to="/" class="hover:underline">Home</router-link>
    </div>

    
    <div class="flex space-x-4">
      <a href="https://x.com/i/flow/login"><img src="@/assets/twitter.png" alt="Twitter" class="w-6 h-6" /></a>
      <a href="https://fr-fr.facebook.com/login/web/"><img src="@/assets/facebook.png" alt="Facebook" class="w-6 h-6" /></a>
      <a href="https://www.instagram.com/?flo=true"><img src="@/assets/instagram.png" alt="Instagram" class="w-6 h-6" /></a>
    </div>

  </div>
</footer>
</template>

<script>

import axios from 'axios';
import HeaderPage from "@/components/Header.vue";

export default{
  name : 'Teachers',
  components :{
        HeaderPage
    }
}
</script>

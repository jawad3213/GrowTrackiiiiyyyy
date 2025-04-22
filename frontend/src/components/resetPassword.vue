//resetPassword
<template>
  <!-- Fond dégradé -->
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-700 via-pink-500 to-orange-400 px-4">

    <!-- Contenu central -->
    <div class="bg-white rounded-xl shadow-lg max-w-md w-full p-8 sm:p-10 text-center">
      
      <!-- Titre -->
      <h1 class="text-2xl font-bold text-gray-800 mb-2">Create new password</h1>

      <!-- Sous-titre -->
      <p class="text-gray-600 text-sm mb-6">
        Your new password must be different from previously used passwords
      </p>
      <div v-if="store.load" class="text-gray-500 text-sm">
        Loading...
      </div>
      <!-- Formulaire -->
      <form>
        <div class="grid gap-y-4 text-left">

          <!-- Nouveau mot de passe -->
          <div>
            <label class="block text-sm font-bold mb-1 text-gray-800">Password</label>
            <input
              v-model="newpassword"
              type="password"
              placeholder="Must be at least 8 characters"
              class="w-full py-3 px-4 border-2 border-gray-200 rounded-md text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-300 outline-none"
              required
            />
          </div>

          <!-- Confirmation mot de passe -->
          <div>
            <label class="block text-sm font-bold mb-1 text-gray-800">Confirm Password</label>
            <input
              v-model="confirmpasssword"
              type="password"
              placeholder="Both passwords must match"
              class="w-full py-3 px-4 border-2 border-gray-200 rounded-md text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-300 outline-none"
              required
            />
            <!-- Erreur store -->
            <p v-if="!!store.errorMsg" class="text-red-600 text-sm mt-2">
              {{store.errorMsg}}
            </p>
          </div>
          <!-- Bouton -->
          <button
            @click.prevent="resetPass"
            type="submit"
            class="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-md transition duration-300"
          >
            Reset password
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref , onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const store = useAuthStore()
const newpassword = ref('')
const confirmpasssword = ref('')
const router = useRouter()
function match(){
  return newpassword.value === confirmpasssword.value;
}


  async function resetPass() {
  if (!match()) {
    store.errorMsg = "Passwords do not match"
    confirmpasssword.value = ''
    return
  }
  await store.resetPassword(newpassword.value)
  if (!store.errorMsg) {
    router.push('/login')
  }
}

onMounted(() => {
    if(store.isAuthenticated){ //à répeter
        router.push('/');
    }
    store.Clearstatus();
});

</script>

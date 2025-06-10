import { defineStore, storeToRefs } from "pinia";
import { ref, computed } from "vue";
import api from "@/services/api";

export const useAuthStore = defineStore("auth", () => {
  // State
  const user = ref(null);
  const error = ref(null);
  const loading = ref(false);
  const role = ref(null);
  const id = ref(null);
  const valide = ref(false);

  // Cookies check
  const CookiesAccepted = computed(() => {
    return (
      localStorage.getItem("cookiesAccepted") ||
      document.cookie.includes("cookiesAccepted")
    );
  });

  const rememberMe = localStorage.getItem("remember_me");

  // Actions
  async function Login(email, password, RememberMe) {
    loading.value = true;
    try {
      const response = await api.post(
        "/api/auth/login",
        { email, password, RememberMe },
        {
          headers: {
            "use-cookies": CookiesAccepted.value,
          },
        }
      );
      user.value = response.data?.user;
      role.value = response.data?.role;
      error.value = null;

      localStorage.setItem("username", response.data?.fullname);
      localStorage.setItem("remember_me", RememberMe);

      if (CookiesAccepted.value) {
        const storeToken = RememberMe ? localStorage : sessionStorage;
        storeToken.setItem("access_token", response.data?.access_token);
      }
    } catch (err) {
      console.log(err);
      error.value = err.response?.data?.message || "Email or password incorrect"; // Verify API message structure
      user.value = null;
    } finally {
      loading.value = false;
    }
  }

  async function forgotPassword(email) {
    loading.value = true;
    try {
      await api.post("/api/auth/reset-password", { email });
      error.value = null;
    } catch (err) {
      error.value = err.response?.data?.message || "Invalid email"; // Verify API message structure
    } finally {
      loading.value = false;
    }
  }

  async function resetPassword(password, token) {
    loading.value = true;
    try {
      await api.post(`/api/resetpass?token=${token}`, { password });
      error.value = null;
    } catch (err) {
      error.value = err.response?.data?.message || "Reset password failed"; // Verify API message structure
    } finally {
      loading.value = false;
    }
  }

  async function checkAuth() {
    loading.value = true;
    try {
      const response = await api.get("/api/auth/check");
      role.value = response?.data?.role;
      id.value = response?.data?.id;
      user.value = response?.status === 200;
      error.value = null;
      return true;
    } catch {
      return false;
    } finally {
      loading.value = false;
    }
  }

  async function CheckResetToken(token) {
    loading.value = true;
    try {
      await api.get(`/api/validate-reset-token?token=${token}`);
      error.value = null;
      valide.value = true;
    } catch (err) {
      valide.value = false;
      error.value =
        err.response?.data?.message || "The link is invalid, please request a new one"; // Verify API message structure
    } finally {
      loading.value = false;
    }
  }

  async function logout() {
    loading.value = true;
    try {
      await api.post("/api/auth/logout");
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.removeItem("access_token");
      storage.removeItem("refresh_token");

      // Reset state after logout
      user.value = null;
      error.value = null;
    } catch (err) {
      error.value = err.response?.data?.message || "Logout failed"; // Verify API message structure
    } finally {
      loading.value = false;
    }
  }

  function Clearstatus() {
    loading.value = false;
    error.value = null;
  }

  // Getters
  const isAuthenticated = computed(() => !!user.value);
  const errorMsg = computed(() => error.value);
  const load = computed(() => loading.value);
  const Role = computed(() => role.value);
  const ID = computed(() => id.value);
  const validtoken = computed(() => valide.value);

  // User info computed properties
  const Email = computed(() => user.value?.email);
  const Fullname = computed(() => user.value?.full_name);
  const CIN = computed(() => user.value?.cin);
  const Phone = computed(() => user.value?.phone);
  const ProfilePicture = computed(() => user.value?.profile_picture);
  const Description = computed(() => user.value?.description);
  const DateAdd = computed(() => user.value?.date_add);

  return {
    // State
    user,
    error,
    loading,
    role,
    id,
    valide,

    // Getters
    isAuthenticated,
    errorMsg,
    load,
    Role,
    ID,
    validtoken,

    // Computed user info
    Email,
    Fullname,
    CIN,
    Phone,
    ProfilePicture,
    Description,
    DateAdd,

    // Actions
    Login,
    logout,
    forgotPassword,
    resetPassword,
    checkAuth,
    CheckResetToken,
    Clearstatus,
  };
});

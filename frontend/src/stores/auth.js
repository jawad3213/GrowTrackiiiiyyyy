// auth.js
import { defineStore } from "pinia";
import { ref, computed } from 'vue';
import api from '@/services/api';

export const useAuthStore = defineStore('auth', () => {
    // State
    const user = ref(null);
    const error = ref(null);
    const loading = ref(false);
    const role = ref(null);
    const id = ref(null);
    const valide = ref(false);
    const CookiesAccepted = localStorage.getItem("cookiesAccepted") || document.cookie.includes('cookiesAccepted') || '';

    // Actions
    async function Login(email, password, RememberMe) {
        loading.value = true;
        try {
            const response = await api.post('/api/auth/login', { email, password, RememberMe }, {
                headers: {
                    'use-cookies': CookiesAccepted
                }
            });

            
            user.value = {
                id_member: response.data?.id,
                full_name: response.data?.fullname,
                email: response.data?.email,
                cin: response.data?.cin,
                phone: response.data?.phone,
                profile_picture: response.data?.profile_picture,
                description: response.data?.description,
                date_add: response.data?.date_add,
                role: response.data?.role,
            };

            
            role.value = response.data?.role;
            id.value = response.data?.id;

            localStorage.setItem('username', response.data?.fullname);
            localStorage.setItem('email', response.data?.email);
            localStorage.setItem('role', response.data?.role);
        
            localStorage.setItem('access_token', response.data?.access_token);
            localStorage.setItem('refresh_token', response.data?.refresh_token);
            error.value = null;
        } catch (err) {
            error.value = err.response?.data?.message || 'Email or password incorrect';
            user.value = null;
        } finally {
            loading.value = false;
        }
    }

    async function forgotPassword(email) {
        loading.value = true;
        try {
            await api.post('/api/auth/reset-password', { email });
            error.value = null;
        } catch (err) {
            error.value = err.response?.data?.message || 'Invalid email';
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
            error.value = err.response?.data?.message || 'Reset password failed';
        } finally {
            loading.value = false;
        }
    }

    async function checkAuth() {
        loading.value = true;
        try {
            const response = await api.get('/api/auth/check');
            role.value = response?.data?.role;
            id.value = response?.data?.id;
            user.value = response?.status == 200;
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
            error.value = err.response?.data?.message || 'The link is invalid, please request a new one';
        } finally {
            loading.value = false;
        }
    }

    async function logout() {
        loading.value = true;
        try {
            await api.post('/api/auth/logout');
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            user.value = null;
            error.value = null;
        } catch (err) {
            error.value = err.response?.data?.message || 'Logout failed';
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

    // ajouter
    const Email = computed(() => user.value?.email);
    const Fullname = computed(() => user.value?.full_name);
    const CIN = computed(() => user.value?.cin);
    const Phone = computed(() => user.value?.phone);
    const ProfilePicture = computed(() => user.value?.profile_picture);
    const Description = computed(() => user.value?.description);
    const DateAdd = computed(() => user.value?.date_add);

    return {
        // state
        user,
        error,
        loading,
        role,
        id,
        valide,

        // getters
        isAuthenticated,
        errorMsg,
        load,
        Role,
        ID,
        validtoken,

        // computed user info
        Email,
        Fullname,
        CIN,
        Phone,
        ProfilePicture,
        Description,
        DateAdd,

        // actions
        Login,
        logout,
        forgotPassword,
        resetPassword,
        checkAuth,
        CheckResetToken,
        Clearstatus
    };
});

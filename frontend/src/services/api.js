import axios from 'axios'
import {useAuthStore} from '@/stores/auth'

const api = axios.create({
  baseURL: 'http://localhost:8080', 
  withCredentials: true 
})

api.interceptors.response.use(
  (response) => {
    // If the response is OK (status 200), just return it
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const auth = useAuthStore();


    // ⿡ Check if the error is 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      console.log("Begin of interceptor")
      const errorCode = error.response.data?.errorCode;

      // ⿢ Only refresh if the errorCode is TOKEN_EXPIRED
      if (errorCode === 'TOKEN_EXPIRED' || errorCode === 'NO_TOKEN') {
        originalRequest._retry = true; // Mark that we are retrying
        try {
          // ⿣ Call the /refresh endpoint to get new tokens
          await api.post('/api/auth/refresh');
          // the new token is stored and sent automatically in the cookies
          // ⿤ Retry the original request automatically
          return api(originalRequest);
        } catch (refreshError) {
          // ⿥ If refresh also fails, force user to login
          auth.isAuthenticated = false;
          return Promise.reject(refreshError);
        }
      }
    }
    
    // ⿦ Any other error → just reject
    return Promise.reject(error);
  }
);

  export default api
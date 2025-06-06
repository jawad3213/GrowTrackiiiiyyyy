import axios from 'axios'
import {useAuthStore} from '@/stores/auth'

const api = axios.create({
  baseURL: 'http://localhost:3000', 
  withCredentials: true 
})

api.interceptors.request.use(config => {
  const token = localStorage.getItem('access_token'); // Works for both cases
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
},
  (error) => {
    return Promise.reject(error);
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
      const CookiesAccepted = localStorage.getItem("cookiesAccepted");
      // ⿢ Only refresh if the errorCode is TOKEN_EXPIRED
      if (errorCode === 'TOKEN_EXPIRED' || errorCode === 'NO_TOKEN' || errorCode === 'INVALID_TOKEN') {
        originalRequest._retry = true; // Mark that we are retrying
        try {
          const refresh_token = localStorage.getItem('refresh_token');
          if (!refresh_token) throw new Error('No refresh token');
          const data = await api.post('/api/auth/refresh', { 
          refresh_token: refresh_token }, {headers : {
                    'use-cookies': CookiesAccepted
                }});
          localStorage.setItem('access_token', data.data?.access_token);
          originalRequest.headers.authorization = `Bearer ${data.data?.access_token}`;
          return api(originalRequest);
        } catch (refreshError) {
          // ⿥ If refresh also fails, force user to login
          auth.isAuthenticated = false;
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          return Promise.reject(refreshError);
        }
      }
    }
    
    // ⿦ Any other error → just reject
    return Promise.reject(error);
  }
);

  export default api
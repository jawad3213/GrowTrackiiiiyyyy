import axios from 'axios'
import {useAuthStore} from '@/stores/auth'

const api = axios.create({
  baseURL: 'http://localhost:3000', 
  withCredentials: true 
})
function getCookie(name) {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : null;
}

api.interceptors.request.use(async config => {
  if (['post', 'put', 'patch', 'delete'].includes(config.method)) {
  await api.get('/api/csrf-token');// sets the XSRF-TOKEN cookie
  config.headers['X-XSRF-TOKEN'] = getCookie('XSRF-TOKEN');
}
  const rememberMe = localStorage.getItem("remember_me")
  const token = rememberMe ?
  localStorage.getItem('access_token')
  : sessionStorage.getItem('access_token'); 
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
    const CookiesAccepted = localStorage.getItem("cookiesAccepted");
    if(CookiesAccepted){
    const originalRequest = error.config;
    const auth = useAuthStore();

    if (error.response?.status === 401 && !originalRequest._retry) {
      console.log("Begin of interceptor")
      const errorCode = error.response.data?.errorCode;
      // ⿢ Only refresh if the errorCode is TOKEN_EXPIRED
      if (errorCode === 'TOKEN_EXPIRED' ||errorCode === "INVALID_TOKEN" ) {
        originalRequest._retry = true; // Mark that we are retrying
        try {
          await api.post('/api/auth/refresh', {headers : {
                    'use-cookies': CookiesAccepted
                }});
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
  }
);

  export default api
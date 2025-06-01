import axios from 'axios'

const api = axios.create({
  baseURL: 'https://backend-production-d327.up.railway.app', 
  withCredentials: true 
})

api.interceptors.response.use(
  (response) => {
    // If the response is OK (status 200), just return it
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // ⿡ Check if the error is 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      console.log("Begin of interceptor")
      const errorCode = error.response.data?.errorCode;

      // ⿢ Only refresh if the errorCode is TOKEN_EXPIRED
      if (errorCode === 'TOKEN_EXPIRED') {
        originalRequest._retry = true; // Mark that we are retrying
        try {
          // ⿣ Call the /refresh endpoint to get new tokens
          await api.post('/api/auth/refresh');
          // the new token is stored and sent automatically in the cookies
          console.log("After the refresh request")
          // ⿤ Retry the original request automatically
          return api(originalRequest);
        } catch (refreshError) {
          // ⿥ If refresh also fails, force user to login
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }
    }

    // ⿦ Any other error → just reject
    return Promise.reject(error);
  }
);

  export default api

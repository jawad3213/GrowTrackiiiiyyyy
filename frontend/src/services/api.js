import axios from 'axios'

const api = axios.create({
  baseURL: 'https://backend-production-d327.up.railway.app', 
  withCredentials: true 
})

export default api

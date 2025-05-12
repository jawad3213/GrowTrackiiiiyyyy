import axios from 'axios'

const api = axios.create({
  baseURL: 'https://frontend-production-665b.up.railway.app/', 
  withCredentials: true 
})

export default api

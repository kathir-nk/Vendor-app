import axios from 'axios';

const api = axios.create({
  baseURL: "https://vendor-app-2ln8.onrender.com",  // ✅ Local backend
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export default api;
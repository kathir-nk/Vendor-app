import axios from 'axios';

const api = axios.create({
  baseURL: window.location.hostname === 'localhost' 
    ? 'http://localhost:5001'
    : 'https://backend-7q98xx72n-kathirs-projects-edb7a6f7.vercel.app',  // ✅ Your backend URL
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export default api;
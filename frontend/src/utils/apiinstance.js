import axios from 'axios';

// ✅ Production URL (your Vercel backend)
const api = axios.create({
  baseURL: 'https://backend-7q98xx72n-kathirs-projects-edb7a6f7.vercel.app',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export default api;
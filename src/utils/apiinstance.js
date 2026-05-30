import axios from 'axios';

const api = axios.create({
  baseURL: 'https://vendor-backend.vercel.app', // 🔥 Vercel URL
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export default api;
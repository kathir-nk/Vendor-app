import axios from "axios";

const api = axios.create({
  baseURL: "https://vendor-app-1-6dt1.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // 30 seconds
});

export default api;
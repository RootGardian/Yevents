import axios from 'axios';

const api = axios.create({
  baseURL: 'https://backend-y4od.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

export default api;

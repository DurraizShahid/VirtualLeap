import axios from 'axios';

// Base URL for your backend server
const BASE_URL = 'https://nodejs-production-1328.up.railway.app/'; 


const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;

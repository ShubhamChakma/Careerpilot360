import axios from 'axios';
import { getCurrentUserToken } from '../firebase/auth';
import { useAuthStore } from '../store/authStore';

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ||
    'http://localhost:5000/api',
  timeout: 30000,
  withCredentials: true,
});


api.interceptors.request.use(
  async (config) => {

    const token = await getCurrentUserToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);


api.interceptors.response.use(
  (res) => res,

  (err) => {

    if (err.response?.status === 401) {
      useAuthStore.getState().clearUser();
    }

    return Promise.reject(err);
  }
);


export default api;
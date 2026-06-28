import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ||
    'http://localhost:5000',
  timeout: 30000,
  withCredentials: true,
});


api.interceptors.request.use(
  async (config) => {
    const user = useAuthStore.getState().user;

    if (user) {
      try {
        // Attempt to get a fresh Firebase ID token
        const token = await user.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
      } catch {
        // getIdToken() failed — Firebase client may not be properly configured.
        // In development the server accepts the 'dev-token' bypass header so
        // the app stays functional without real Firebase web credentials.
        if (import.meta.env.DEV) {
          config.headers.Authorization = 'Bearer dev-token';
        }
        // In production there is nothing safe to fall back to; the request
        // will go out without an auth header and the server will 401.
      }
    } else if (import.meta.env.DEV) {
      // No Firebase user at all in dev — still use the bypass so protected
      // endpoints work while the Firebase client is being configured.
      config.headers.Authorization = 'Bearer dev-token';
    }

    return config;
  },
  (error) => Promise.reject(error)
);


api.interceptors.response.use(
  (res) => res,

  (err) => {
    // ⚠️  Do NOT auto-logout on every 401.
    //
    // A 401 from a feature endpoint (resume scan, job predict, etc.) just
    // means the request wasn't authorised — it does not mean the user's
    // session has expired.  Clearing the user here caused every failed API
    // call to immediately redirect the user back to /login.
    //
    // If you later want to handle true session expiry, check a specific
    // error code returned by the server (e.g. err.response?.data?.code ===
    // 'SESSION_EXPIRED') rather than the raw status.

    return Promise.reject(err);
  }
);


export default api;
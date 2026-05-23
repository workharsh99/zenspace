import axios from 'axios';

// When running via Nginx (Docker), all APIs go through port 80
// When running locally (npm run dev), Vite proxy handles /api -> localhost:80
const BASE_URL = '';

export const userApi = axios.create({
  baseURL: `${BASE_URL}/api/users`,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

export const activityApi = axios.create({
  baseURL: `${BASE_URL}/api/activities`,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

export const sessionApi = axios.create({
  baseURL: `${BASE_URL}/api/sessions`,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

const addAuthInterceptor = (instance) => {
  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('wellness_token');
      const userStr = localStorage.getItem('wellness_user');
      if (token) config.headers.Authorization = `Bearer ${token}`;
      if (userStr) {
        try {
          const userData = JSON.parse(userStr);
          config.headers['X-User-Id'] = userData.userId || userData.id || '';
        } catch (_) {}
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        localStorage.removeItem('wellness_token');
        localStorage.removeItem('wellness_user');
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );
};

addAuthInterceptor(userApi);
addAuthInterceptor(activityApi);
addAuthInterceptor(sessionApi);

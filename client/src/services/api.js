import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Attach the JWT to every outgoing request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Surface a clear, consistent error message and handle expired sessions
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      // Network failure — likely offline. The PWA cache may still serve GETs;
      // writes will fail until connectivity returns.
      return Promise.reject({ message: 'You appear to be offline. Some actions are unavailable until you reconnect.' });
    }
    if (error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error.response.data || { message: 'Something went wrong' });
  }
);

export default api;

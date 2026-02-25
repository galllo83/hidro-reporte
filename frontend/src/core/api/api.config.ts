import axios from 'axios';

// The base URL depends on the environment. In Docker, it's typically set via VITE_API_URL
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const apiClient = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to attach JWT token
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('auth_token');
        console.log('[ApiClient] Requesting:', config.baseURL, config.url);
        console.log('[ApiClient] Token found in localStorage:', token ? `${token.substring(0, 15)}...` : 'NULL');

        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
            console.log('[ApiClient] Attached Authorization Header:', config.headers.Authorization ? 'YES' : 'NO');
        } else {
            console.warn('[ApiClient] WARNING: No token to attach or config.headers is undefined!');
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor to handle global errors (e.g., 401 Unauthorized)
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Optional: Handle token expiration globally (e.g., redirect to login)
            // localStorage.removeItem('auth_token');
            // window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

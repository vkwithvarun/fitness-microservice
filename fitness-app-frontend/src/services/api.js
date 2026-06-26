import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/';

const api = axios.create({
    baseURL: API_URL
});

// Interceptor runs before every request - attaches auth headers automatically
api.interceptors.request.use((config) => {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');

    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    if (userId) {
        config.headers['X-User-ID'] = userId;
    }
    return config;
});

export const getActivities = () => api.get('/activities');
export const addActivity = (activity) => api.post('/activities', activity);
export const getActivityById = (id) => api.get(`/activities/${id}`);
export const getActivityDetail = (id) => api.get(`/recommendations/activity/${id}`);

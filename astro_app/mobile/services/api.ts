import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const API_URL = 'https://astro360-2.onrender.com/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests
api.interceptors.request.use(async (config) => {
    const token = await SecureStore.getItemAsync('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle 401 (Unauthorized)
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            await SecureStore.deleteItemAsync('token');
            // Ideally redirect to login, but Expo Router handles this via AuthContext usually
        }
        return Promise.reject(error);
    }
);

export default api;

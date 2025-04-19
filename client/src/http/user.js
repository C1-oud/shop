import { $authHost, $host } from './index';
import { jwtDecode } from 'jwt-decode';

export const login = async (email, password) => {
    try {
        console.log('Attempting login with:', { email });
        const { data } = await $host.post('/api/login', { email, password });
        console.log('Login response:', data);
        
        if (!data.token) {
            throw new Error('Токен не получен от сервера');
        }
        
        localStorage.setItem('token', data.token);
        const decoded = jwtDecode(data.token);
        console.log('Decoded token:', decoded);
        return decoded;
    } catch (error) {
        console.error('Ошибка при попытке входа:', error);
        throw error;
    }
};

export const registration = async (email, password) => {
    try {
        console.log('Attempting registration with:', { email });
        const { data } = await $host.post('/api/registration', { email, password, role: 'USER' });
        console.log('Registration response:', data);
        
        if (!data.token) {
            throw new Error('Токен не получен от сервера');
        }
        
        localStorage.setItem('token', data.token);
        const decoded = jwtDecode(data.token);
        console.log('Decoded token:', decoded);
        return decoded;
    } catch (error) {
        console.error('Ошибка при регистрации:', error);
        throw error;
    }
};

export const verifyEmail = async (email, code) => {
    try {
        console.log('Attempting email verification with:', { email, code });
        const { data } = await $host.post('/api/verify-email', { email, code });
        console.log('Verification response:', data);
        
        if (!data.token) {
            throw new Error('Токен не получен от сервера');
        }
        
        localStorage.setItem('token', data.token);
        const decoded = jwtDecode(data.token);
        console.log('Decoded token:', decoded);
        return decoded;
    } catch (error) {
        console.error('Ошибка при верификации email:', error);
        throw error;
    }
};

export const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        console.warn('Токен не найден в localStorage');
        return null;
    }
    try {
        console.log('Checking auth with token');
        const response = await $authHost.get('/api/check');
        console.log('Auth check response:', response.data);
        
        if (!response.data) {
            throw new Error('Неверный ответ от сервера');
        }
        
        const decoded = jwtDecode(token);
        console.log('Decoded token:', decoded);
        return decoded;
    } catch (e) {
        console.error('Ошибка при проверке авторизации:', e);
        localStorage.removeItem('token');
        return null;
    }
};

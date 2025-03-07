import { $authHost, $host } from './index';
import { jwtDecode } from 'jwt-decode';


export const login = async (email, password) => {
    const { data } = await $host.post('api/user/login', { email, password });
    localStorage.setItem('token', data.token); 
    return jwtDecode(data.token); 
}

export const registration = async (email, password) => {
    const { data } = await $host.post('api/user/registration', { email, password, role: 'ADMIN' });
    localStorage.setItem('token', data.token); 
    return jwtDecode(data.token); 
}

export const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        console.log('Токен не найден');
        return null; 
    }
    try {

        await $authHost.get('api/user/check', {
            headers: {
                Authorization: `Bearer ${token}`  
            }
        });

        
        const decoded = jwtDecode(token); 
        console.log('Декодированный токен:', decoded); 

        return decoded;  
    } catch (e) {
        console.error('Ошибка при декодировании токена или запросе:', e); 
        return null;
    }
}

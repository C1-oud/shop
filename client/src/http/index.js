import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const $host = axios.create({
    baseURL: API_URL
});

const $authHost = axios.create({
    baseURL: API_URL
});

const authInterceptor = config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.authorization = `Bearer ${token}`;
    }
    return config;
};

$authHost.interceptors.request.use(authInterceptor);

// Добавляем обработчик ошибок
$host.interceptors.response.use(
    response => response,
    error => {
        console.error('Ошибка запроса:', error);
        return Promise.reject(error);
    }
);

$authHost.interceptors.response.use(
    response => response,
    error => {
        console.error('Ошибка авторизованного запроса:', error);
        return Promise.reject(error);
    }
);

export {
    $host,
    $authHost
};

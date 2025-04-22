import { makeAutoObservable, runInAction, observable, action, computed } from "mobx";
import { checkAuth } from "../http/user";
import { jwtDecode } from "jwt-decode";

export default class UserStore {
    constructor() {
        this._isAuth = false;
        this._user = {};
        this._token = null;

        // Инициализация токена и пользователя
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            try {
                const decoded = jwtDecode(storedToken);
                this._token = storedToken;
                this._user = decoded;
                this._isAuth = true;
                console.log('Токен успешно восстановлен из localStorage');
            } catch (e) {
                console.error("Ошибка при декодировании токена:", e);
                localStorage.removeItem('token');
            }
        }

        makeAutoObservable(this, {
            _isAuth: observable,
            _user: observable,
            _token: observable,
            setIsAuth: action,
            setUser: action,
            setToken: action,
            isAuth: computed,
            user: computed,
            token: computed,
            checkAuth: action,
            logout: action
        });
    }

    setIsAuth(bool) {
        this._isAuth = bool;
    }

    setUser(user) {
        this._user = user;
    }

    setToken(token) {
        if (token) {
            this._token = token;
            localStorage.setItem('token', token);
            try {
                const decoded = jwtDecode(token);
                this._user = decoded;
                this._isAuth = true;
                console.log('Токен успешно установлен');
            } catch (e) {
                console.error("Ошибка при декодировании токена:", e);
                this.logout();
            }
        } else {
            this._token = null;
            localStorage.removeItem('token');
            this._user = {};
            this._isAuth = false;
            console.log('Токен удален');
        }
    }

    get isAuth() {
        return this._isAuth;
    }

    get user() {
        return this._user;
    }

    get token() {
        return this._token;
    }

    async checkAuth() {
        try {
            if (!this._token) {
                console.log('Токен отсутствует, проверка авторизации не требуется');
                return false;
            }

            const userData = await checkAuth();
            if (userData) {
                this.setUser(userData);
                this.setIsAuth(true);
                console.log('Проверка авторизации успешна');
                return true;
            } else {
                console.log('Проверка авторизации не прошла');
                // Не разлогиниваем пользователя при временных проблемах
                return this._isAuth; // Возвращаем текущее состояние
            }
            } catch (e) {
            console.error("Ошибка при проверке авторизации:", e);
            // Не разлогиниваем при ошибках сети
            return this._isAuth; // Возвращаем текущее состояние
        }
    }
    
    logout() {
        this.setToken(null);
        console.log('Пользователь вышел из системы');
    }
}

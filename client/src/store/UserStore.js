import { makeAutoObservable } from "mobx";

export default class UserStore {
    constructor() {
        this._isAuth = false;
        this._user = {};
        makeAutoObservable(this);
    }


    setIsAuth(bool) {
        this._isAuth = bool;
    }

    setUser(user) {
        this._user = user;
    }

    get isAuth() {
        return this._isAuth;
    }

    get user() {
        return this._user;
    }

    checkAuth() {
        const token = localStorage.getItem('authToken');
        if (token) {
            try {
                const user = JSON.parse(atob(token.split('.')[1])); 
                this.setUser(user);
                this.setIsAuth(true);
            } catch (e) {
                console.error("Ошибка при декодировании токена:", e);
                this.logout();
            }
        }
    }
    
    logout() {
        localStorage.removeItem('authToken');
        this.setUser({});
        this.setIsAuth(false);
    }
}

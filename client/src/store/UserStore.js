import { makeAutoObservable, runInAction, observable, action, computed } from "mobx";
import { checkAuth } from "../http/user";

export default class UserStore {
    constructor() {
        this._isAuth = false;
        this._user = {};
        makeAutoObservable(this, {
            _isAuth: observable,
            _user: observable,
            setIsAuth: action,
            setUser: action,
            isAuth: computed,
            user: computed,
            checkAuth: action,
            logout: action
        });
    }

    setIsAuth(bool) {
        runInAction(() => {
            this._isAuth = bool;
        });
    }

    setUser(user) {
        runInAction(() => {
            this._user = user;
        });
    }

    get isAuth() {
        return this._isAuth;
    }

    get user() {
        return this._user;
    }

    async checkAuth() {
        try {
            const userData = await checkAuth();
            if (userData) {
                runInAction(() => {
                    this.setUser(userData);
                    this.setIsAuth(true);
                });
                console.log('User authenticated:', userData);
                return true;
            }
            return false;
        } catch (e) {
            console.error("Ошибка при проверке авторизации:", e);
            this.logout();
            return false;
        }
    }
    
    logout() {
        runInAction(() => {
            localStorage.removeItem('token');
            this.setUser({});
            this.setIsAuth(false);
        });
    }
}

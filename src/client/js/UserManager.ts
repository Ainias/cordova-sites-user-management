import {DataManager, Helper, NativeStoragePromise, Toast} from "cordova-sites/dist/client";

export class UserManager {

    static OFFLINE_ACCESSES: any;
    static _instance: UserManager;
    static ACCESS_CLASS_PREFIX: string;

    protected _defaultUserData: { loggedIn: boolean; online: boolean; id: null; accesses: any; email: null; username: null };
    protected _userData: { loggedIn: boolean; online: boolean; id: null; accesses: any; email: null; username: null };
    protected _lastLoginChangeCallbackId: number;
    protected _loginChangeCallbacks: {};
    private _getMePromise: any;

    constructor() {
        this._defaultUserData = {
            id: null,
            loggedIn: false,
            online: false,
            username: null,
            email: null,
            accesses: UserManager.OFFLINE_ACCESSES,
        };
        this._userData = this._defaultUserData;

        this._lastLoginChangeCallbackId = -1;
        this._loginChangeCallbacks = {};
        this._getMePromise = null;
    }

    addLoginChangeCallback(callback, callImmediately?) {
        this._lastLoginChangeCallbackId++;
        this._loginChangeCallbacks[this._lastLoginChangeCallbackId] = callback;

        if (Helper.nonNull(callImmediately, false)) {
            callback(this._userData.loggedIn, this);
        }

        return this._lastLoginChangeCallbackId;
    }

    hasAccess(access) {
        return (this._userData.accesses.indexOf(access) !== -1);
    }

    async _checkChangedLogin(before) {
        if (this._userData.loggedIn !== before.loggedIn || (this._userData.loggedIn === true && this._userData.id !== before.id)) {
            await this._callLoginChangeCallbacks();
        }
    }

    async _callLoginChangeCallbacks() {
        await Helper.asyncForEach(Object.keys(this._loginChangeCallbacks), callbackId => {
            this._loginChangeCallbacks[callbackId](this._userData.loggedIn, this);
        }, true);
    }

    getUserData() {
        return this._userData;
    }

    async getMe() {
        this._getMePromise = new Promise(async r =>{
            let before = this._userData;
            let res = await this._doGetMe();
            await this._checkChangedLogin(before);
            r(res);
        });
        return this._getMePromise;
    }

    async waitForGetMe(){
        if (this._getMePromise === null){
            this.getMe();
        }
        await this._getMePromise;
    }

    async login(email, password, saveLogin?) {
        let before = this._userData;
        let res = await this._doLogin(email, password, saveLogin);
        //do it after the result is returned
        setTimeout(() => {
            this._checkChangedLogin(before);
        }, 1);
        return res;
    }

    async logout() {
        let before = this._userData;
        let res = await this._doLogout();
        await this._checkChangedLogin(before);

        if (!this._userData.loggedIn) {
            await new Toast("goodbye").show();
        }

        return res;
    }

    async register(email, username, password) {
        let before = this._userData;
        let res = await this._doRegister(email, username, password);
        await this._checkChangedLogin(before);
        return res;
    }

    async _doGetMe(): Promise<any> {
        await UserManager.updateHeaders();
        let data = await DataManager.load("user");
        if (Helper.isSet(data, "userData")) {
            await NativeStoragePromise.setItem("user-data", data.userData);
            this._userData = data.userData;
        } else {
            this._userData = this._defaultUserData;
        }

        this._updateAccessClasses();

        if (Helper.isSet(data, "token")) {
            DataManager.setHeader("Authorization", "Bearer " + data.token);
            sessionStorage.setItem("auth-token", data.token);
            if (Helper.isNotNull(await NativeStoragePromise.getItem("auth-token"))) {
                await NativeStoragePromise.setItem("auth-token", data.token);
            }
        }
    }

    async _doLogin(email, password, saveLogin) {
        let data = await DataManager.send("user/login", {
            "email": email,
            "password": password
        });

        if (data.success) {
            DataManager.setHeader("Authorization", "Bearer " + data.token);
            sessionStorage.setItem("auth-token", data.token);
            await this._doGetMe();
            if (saveLogin) {
                await NativeStoragePromise.setItem("auth-token", data.token);
            }
            return true;
        } else {
            DataManager.setHeader("Authorization", "");
            sessionStorage.setItem("auth-token", "");
            await NativeStoragePromise.setItem("auth-token", "");
            await new Toast(data.message).show();
            return false;
        }
    }

    async _doLogout() {
        DataManager.setHeader("Authorization", "");
        sessionStorage.setItem("auth-token", "");
        await NativeStoragePromise.setItem("auth-token", "");

        await this._doGetMe();
        return true;
    }

    async _doRegister(email, username, password): Promise<any> {
        let data = await DataManager.send("user/register", {
            "email": email,
            "username": username,
            "password": password
        });

        if (data.success) {
            DataManager.setHeader("Authorization", "Bearer " + data.token);
            sessionStorage.setItem("auth-token", data.token);
            await this._doGetMe();
            return true;
        } else {
            DataManager.setHeader("Authorization", "");
            sessionStorage.setItem("auth-token", "");
            await NativeStoragePromise.setItem("auth-token", "");
            await new Toast(data.message).show();
            return false;
        }
    }

    /**
     * @returns {UserManager}
     */
    static getInstance() {
        if (!UserManager._instance) {
            UserManager._instance = new UserManager();
        }
        return UserManager._instance;
    }

    static async updateHeaders() {
        let token = Helper.nonNull(sessionStorage.getItem("auth-token"), await NativeStoragePromise.getItem("auth-token"));
        if (token) {
            DataManager.setHeader("Authorization", "Bearer " + token);
        }
    }

    _updateAccessClasses() {
        document.body.classList.forEach(cl => {
            if (cl.startsWith(UserManager.ACCESS_CLASS_PREFIX)) {
                document.body.classList.remove(cl);
            }
        });
        this._userData.accesses.forEach(access => {
            document.body.classList.add(UserManager.ACCESS_CLASS_PREFIX + access)
        })
    }

    async hasOfflineAccess(access) {
        if (this.isOnline()) {
            return false;
        }
        let offlineData = Helper.nonNull(await NativeStoragePromise.getItem("user-data"), {accesses: UserManager.OFFLINE_ACCESSES});
        return (offlineData.accesses.indexOf(access) !== -1);
    }

    async sendForgotPasswordEmail(email) {
        let data = await DataManager.send("user/forgotPW", {email: email});
        return data.success;
    }

    async resetPassword(token, password) {
        let data = await DataManager.send("user/forgotPW/2", {token: token, password: password});
        return data.success;
    }

    isOnline() {
        return this._userData.online;
    }

    isLoggedIn() {
        return this._userData.loggedIn;
    }

    static syncParamFor(model) {
        return {
            model: model,
            where: {
                user: {id: this.getInstance().getUserData().id}
            }
        }
    }
}

UserManager.ACCESS_CLASS_PREFIX = "access-";
UserManager.OFFLINE_ACCESSES = [
    "offline"
];
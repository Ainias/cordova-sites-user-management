"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserManager = void 0;
const client_1 = require("cordova-sites/dist/client");
const User_1 = require("../../shared/v1/model/User");
class UserManager {
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
    addLoginChangeCallback(callback, callImmediately) {
        this._lastLoginChangeCallbackId++;
        this._loginChangeCallbacks[this._lastLoginChangeCallbackId] = callback;
        if (client_1.Helper.nonNull(callImmediately, false)) {
            callback(this._userData.loggedIn, this);
        }
        return this._lastLoginChangeCallbackId;
    }
    hasAccess(access) {
        return (this._userData.accesses.indexOf(access) !== -1);
    }
    _checkChangedLogin(before) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._userData.loggedIn !== before.loggedIn || (this._userData.loggedIn === true && this._userData.id !== before.id)) {
                yield this._callLoginChangeCallbacks();
            }
        });
    }
    _callLoginChangeCallbacks() {
        return __awaiter(this, void 0, void 0, function* () {
            yield client_1.Helper.asyncForEach(Object.keys(this._loginChangeCallbacks), callbackId => {
                this._loginChangeCallbacks[callbackId](this._userData.loggedIn, this);
            }, true);
        });
    }
    getUserData() {
        return this._userData;
    }
    getMe() {
        return __awaiter(this, void 0, void 0, function* () {
            this._getMePromise = new Promise((r) => __awaiter(this, void 0, void 0, function* () {
                let before = this._userData;
                let res = yield this._doGetMe();
                yield this._checkChangedLogin(before);
                r(res);
            }));
            return this._getMePromise;
        });
    }
    waitForGetMe() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._getMePromise === null) {
                this.getMe();
            }
            yield this._getMePromise;
        });
    }
    login(email, password, saveLogin) {
        return __awaiter(this, void 0, void 0, function* () {
            let before = this._userData;
            let res = yield this._doLogin(email, password, saveLogin);
            //do it after the result is returned
            setTimeout(() => {
                this._checkChangedLogin(before);
            }, 1);
            return res;
        });
    }
    logout() {
        return __awaiter(this, void 0, void 0, function* () {
            let before = this._userData;
            let res = yield this._doLogout();
            yield this._checkChangedLogin(before);
            if (!this._userData.loggedIn) {
                yield new client_1.Toast("goodbye").show();
            }
            return res;
        });
    }
    register(email, username, password) {
        return __awaiter(this, void 0, void 0, function* () {
            let before = this._userData;
            let res = yield this._doRegister(email, username, password);
            //With timeout so there is time to end registration site
            setTimeout(() => {
                this._checkChangedLogin(before);
            }, 1);
            return res;
        });
    }
    _doGetMe() {
        return __awaiter(this, void 0, void 0, function* () {
            yield UserManager.updateHeaders();
            let data = yield client_1.DataManager.load("user");
            if (client_1.Helper.isSet(data, "userData")) {
                yield client_1.NativeStoragePromise.setItem("user-data", data.userData);
                this._userData = data.userData;
            }
            else {
                this._userData = this._defaultUserData;
            }
            this._updateAccessClasses();
            if (client_1.Helper.isSet(data, "token")) {
                client_1.DataManager.setHeader("Authorization", "Bearer " + data.token);
                sessionStorage.setItem("auth-token", data.token);
                if (client_1.Helper.isNotNull(yield client_1.NativeStoragePromise.getItem("auth-token"))) {
                    yield client_1.NativeStoragePromise.setItem("auth-token", data.token);
                }
            }
        });
    }
    _doLogin(email, password, saveLogin) {
        return __awaiter(this, void 0, void 0, function* () {
            let data = yield client_1.DataManager.send("user/login", {
                "email": email,
                "password": password
            });
            if (data.success) {
                client_1.DataManager.setHeader("Authorization", "Bearer " + data.token);
                sessionStorage.setItem("auth-token", data.token);
                yield this._doGetMe();
                if (saveLogin) {
                    yield client_1.NativeStoragePromise.setItem("auth-token", data.token);
                }
                return true;
            }
            else {
                client_1.DataManager.setHeader("Authorization", "");
                sessionStorage.setItem("auth-token", "");
                yield client_1.NativeStoragePromise.setItem("auth-token", "");
                yield new client_1.Toast(data.message).show();
                return false;
            }
        });
    }
    _doLogout() {
        return __awaiter(this, void 0, void 0, function* () {
            client_1.DataManager.setHeader("Authorization", "");
            sessionStorage.setItem("auth-token", "");
            yield client_1.NativeStoragePromise.setItem("auth-token", "");
            yield this._doGetMe();
            return true;
        });
    }
    _doRegister(email, username, password) {
        return __awaiter(this, void 0, void 0, function* () {
            let data = yield client_1.DataManager.send("user/register", {
                "email": email,
                "username": username,
                "password": password
            });
            if (data.success) {
                client_1.DataManager.setHeader("Authorization", "Bearer " + data.token);
                sessionStorage.setItem("auth-token", data.token);
                yield this._doGetMe();
                return true;
            }
            else {
                client_1.DataManager.setHeader("Authorization", "");
                sessionStorage.setItem("auth-token", "");
                yield client_1.NativeStoragePromise.setItem("auth-token", "");
                yield new client_1.Toast(data.message).show();
                return false;
            }
        });
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
    static updateHeaders() {
        return __awaiter(this, void 0, void 0, function* () {
            let token = client_1.Helper.nonNull(sessionStorage.getItem("auth-token"), yield client_1.NativeStoragePromise.getItem("auth-token"));
            if (token) {
                client_1.DataManager.setHeader("Authorization", "Bearer " + token);
            }
        });
    }
    _updateAccessClasses() {
        document.body.classList.forEach(cl => {
            if (cl.startsWith(UserManager.ACCESS_CLASS_PREFIX)) {
                document.body.classList.remove(cl);
            }
        });
        this._userData.accesses.forEach(access => {
            document.body.classList.add(UserManager.ACCESS_CLASS_PREFIX + access);
        });
    }
    hasOfflineAccess(access) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isOnline()) {
                return false;
            }
            let offlineData = client_1.Helper.nonNull(yield client_1.NativeStoragePromise.getItem("user-data"), { accesses: UserManager.OFFLINE_ACCESSES });
            return (offlineData.accesses.indexOf(access) !== -1);
        });
    }
    sendForgotPasswordEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            let data = yield client_1.DataManager.send("user/forgotPW", { email: email });
            return data.success;
        });
    }
    resetPassword(token, password) {
        return __awaiter(this, void 0, void 0, function* () {
            let data = yield client_1.DataManager.send("user/forgotPW/2", { token: token, password: password });
            return data.success;
        });
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
                user: { id: this.getInstance().getUserData().id }
            }
        };
    }
    static userSyncParam() {
        return {
            model: User_1.User,
            where: {
                id: this.getInstance().getUserData().id
            }
        };
    }
}
exports.UserManager = UserManager;
UserManager.ACCESS_CLASS_PREFIX = "access-";
UserManager.OFFLINE_ACCESSES = [
    "offline"
];
//# sourceMappingURL=UserManager.js.map
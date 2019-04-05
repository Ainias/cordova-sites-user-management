import {Helper, Toast} from "cordova-sites";

export class UserManager {

    constructor(){
        this._userData = {
            id: null,
            loggedIn: false,
            online: false,
            username: null,
            email: null,
            accesses: UserManager.OFFLINE_ACCESSES,
        };

        this._lastLoginChangeCallbackId = -1;
        this._loginChangeCallbacks = {};
    }

    addLoginChangeCallback(callback, callImmediately){
        this._lastLoginChangeCallbackId++;
        this._loginChangeCallbacks[this._lastLoginChangeCallbackId] = callback;

        if (Helper.nonNull(callImmediately, false)){
            callback(this._userData.loggedIn, this);
        }

        return this._lastLoginChangeCallbackId;
    }

    hasAccess(access){
        return (this._userData.accesses.indexOf(access) !== -1);
    }

    async _checkChangedLogin(before){
        if (this._userData.loggedIn !== before.loggedIn || (this._userData.loggedIn === true && this._userData.id !== before.id )){
            await this._callLoginChangeCallbacks();
        }
    }

    async _callLoginChangeCallbacks(){
        await Helper.asyncForEach(Object.keys(this._loginChangeCallbacks), callbackId => {
            this._loginChangeCallbacks[callbackId](this._userData.loggedIn, this);
        }, true);
    }

    async getMe(){
        let before = this._userData;
        let res = this._doGetMe();
        await this._checkChangedLogin(before);
        return res;
    }

    async login(email, password, saveLogin){
        let before = this._userData;
        let res = await this._doLogin(email, password, saveLogin);
        await this._checkChangedLogin(before);
        return res;
    }

    async logout(){
        let before = this._userData;
        let res = await this._doLogout();
        await this._checkChangedLogin(before);

        if (!this._userData.loggedIn){
            await new Toast("goodbye").show();
        }

        return res;
    }

    async register(email, username, password){
        let before = this._userData;
        let res = await this._doRegister(email, username, password);
        await this._checkChangedLogin(before);
        return res;
    }

    async _doGetMe(){
        throw new Error("not implemented!");
    }

    async _doLogin(email, password){
        throw new Error("not implemented!");
    }

    async _doLogout(){
        throw new Error("not implemented!");
    }

    async _doRegister(email, username, password){
        throw new Error("not implemented!");
    }

    /**
     * @returns {UserManager}
     */
    static getInstance(){
        if (!UserManager._instance){
            UserManager._instance = new UserManager();
        }
        return UserManager._instance;
    }
}
UserManager._instance = null;
UserManager.OFFLINE_ACCESSES = [
    "offline"
];
export class UserManager {

    constructor(){
        this._userData = {
            id: null,
            loggedIn: false,
            online: false,
            username: null,
            email: null,
            accesses: UserManager.OFFLINE_ACCESSES,
        }
    }

    hasAccess(access){
        return (this._userData.accesses.indexOf(access) !== -1);
    }

    async getMe(){
        throw new Error("not implemented!");
    }

    async login(email, password){
        throw new Error("not implemented!");
    }

    async logout(){
        throw new Error("not implemented!");
    }

    async register(email, username, password){
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
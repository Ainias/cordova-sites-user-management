import { User } from "../../shared/v1/model/User";
export declare class UserManager {
    static OFFLINE_ACCESSES: any;
    static _instance: UserManager;
    static ACCESS_CLASS_PREFIX: string;
    protected _defaultUserData: {
        loggedIn: boolean;
        online: boolean;
        id: null;
        accesses: any;
        email: null;
        username: null;
    };
    protected _userData: {
        loggedIn: boolean;
        online: boolean;
        id: null;
        accesses: any;
        email: null;
        username: null;
    };
    protected _lastLoginChangeCallbackId: number;
    protected _loginChangeCallbacks: {};
    private _getMePromise;
    constructor();
    addLoginChangeCallback(callback: any, callImmediately?: any): number;
    hasAccess(access: any): boolean;
    private _checkChangedLogin;
    _callLoginChangeCallbacks(): Promise<void>;
    getUserData(): {
        loggedIn: boolean;
        online: boolean;
        id: null;
        accesses: any;
        email: null;
        username: null;
    };
    getMe(): Promise<any>;
    waitForGetMe(): Promise<void>;
    login(email: any, password: any, saveLogin?: any): Promise<boolean>;
    logout(): Promise<boolean>;
    register(email: any, username: any, password: any): Promise<any>;
    _doGetMe(): Promise<any>;
    _doLogin(email: any, password: any, saveLogin: any): Promise<boolean>;
    _doLogout(): Promise<boolean>;
    _doRegister(email: any, username: any, password: any): Promise<any>;
    /**
     * @returns {UserManager}
     */
    static getInstance(): UserManager;
    static updateHeaders(): Promise<void>;
    _updateAccessClasses(): void;
    hasOfflineAccess(access: any): Promise<boolean>;
    sendForgotPasswordEmail(email: any): Promise<any>;
    resetPassword(token: any, password: any): Promise<any>;
    isOnline(): boolean;
    isLoggedIn(): boolean;
    static syncParamFor(model: any): {
        model: any;
        where: {
            user: {
                id: null;
            };
        };
    };
    static userSyncParam(): {
        model: typeof User;
        where: {
            id: null;
        };
    };
}

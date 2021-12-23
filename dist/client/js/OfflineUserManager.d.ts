import { UserManager } from './UserManager';
export declare class OfflineUserManager extends UserManager {
    static LOGGED_OUT_ACCESSES: any;
    static DEFAULT_ROLES: any;
    static _lastId: number;
    constructor();
    _doGetMe(): Promise<{
        loggedIn: boolean;
        online: boolean;
        id: null;
        accesses: any;
        email: null;
        username: null;
    }>;
    _handleLoginFromUser(user: any): Promise<void>;
    _doLogin(email: any, password: any, saveLogin: any): Promise<boolean>;
    _doLogout(): Promise<boolean>;
    _getAccessesFromRole(role: any): Promise<any>;
    _doRegister(email: any, username: any, password: any): Promise<{}>;
    static _getNewId(): Promise<number>;
    _hashPassword(pw: any): any;
}

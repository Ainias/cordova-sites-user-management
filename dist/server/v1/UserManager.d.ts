import { User } from '../../shared/v1/model/User';
export declare class UserManager {
    static SALT_LENGTH: number;
    static RENEW_AFTER: number;
    static PEPPER: string;
    static REGISTRATION_SEND_EMAIL: boolean;
    static LOGIN_NEED_TO_BE_ACTIVATED: boolean;
    static REGISTRATION_CAN_REGISTER: boolean;
    static REGISTRATION_USERNAME_IS_CASE_SENSITIVE: boolean;
    static REGISTRATION_IS_ACTIVATED: boolean;
    static REGISTRATION_DEFAULT_ROLE_IDS: any;
    static EXPIRES_IN: any;
    static getUserFromToken(token: any): Promise<[User, any]>;
    static setUserFromToken(req: any, res: any, next: any): void;
    static needToken(req: any, res: any, next: any): void;
    static checkAccess(accessName: any): (req: any, res: any, next: any) => void;
    static _hashPassword(user: any, password: any): any;
    static login(email: any, password: any): Promise<{
        user: any;
        token: any;
    }>;
    static register(email: any, username: any, password: any): Promise<User>;
    static sendPasswordResetEmail(user: any, language: any): Promise<any>;
    static resetPasswordWithToken(token: any, newPw: any): Promise<unknown>;
    static _generateToken(user: any): any;
    static findAccessesForUser(user: any): Promise<any[]>;
    static findAccessesForRole(role: any): Promise<any>;
    static updateCachedAccessesForUser(user: any): Promise<void>;
    static loadCachedAccessesForUser(user?: any): Promise<any>;
    static hasAccess(user: any, access: any): Promise<boolean>;
    static _generateSalt(): any;
}

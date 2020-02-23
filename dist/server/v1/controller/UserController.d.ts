export declare class UserController {
    static login(req: any, res: any): Promise<void>;
    static register(req: any, res: any): Promise<void>;
    static getMe(req: any, res: any): Promise<void>;
    static sendPasswordResetMail(req: any, res: any): Promise<void>;
    static resetPassword(req: any, res: any): Promise<void>;
    static getUserDataForRoles(req: any, res: any): Promise<any>;
    static updateRoleForUser(req: any, res: any): Promise<any>;
}

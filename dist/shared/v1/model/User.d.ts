import { EasySyncBaseModel } from "cordova-sites-easy-sync/dist/shared";
export declare class User extends EasySyncBaseModel {
    username: string;
    email: string;
    password: string;
    roles: any;
    activated: boolean;
    blocked: boolean;
    salt: string;
    constructor();
    toJSON(): {
        id: number;
        username: string;
    };
    static getColumnDefinitions(): Record<string, string | import("cordova-sites-database/dist/BDColumnType").BDColumnType>;
    static getRelationDefinitions(): Record<string, import("cordova-sites-database/dist/BDRelationshipType").BDRelationshipType>;
    static prepareSync(entities: any): any[];
}

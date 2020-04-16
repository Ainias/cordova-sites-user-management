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
    static getColumnDefinitions(): {
        id: {
            primary: boolean;
            type: any;
            generated: boolean;
        };
    };
    static getRelationDefinitions(): {};
    static prepareSync(entities: any): any[];
}

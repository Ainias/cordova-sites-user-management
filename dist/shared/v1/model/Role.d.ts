import { EasySyncBaseModel } from "cordova-sites-easy-sync/dist/shared";
export declare class Role extends EasySyncBaseModel {
    name: string;
    description: string;
    accesses: any;
    parents: any;
    children: any;
    constructor();
    static getColumnDefinitions(): {
        id: {
            primary: boolean;
            type: any;
            generated: boolean;
        };
    };
    static getRelationDefinitions(): {};
}

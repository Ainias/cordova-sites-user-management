import { EasySyncBaseModel } from "cordova-sites-easy-sync/dist/shared";
export declare class Role extends EasySyncBaseModel {
    name: string;
    description: string;
    accesses: any;
    parents: any;
    children: any;
    constructor();
    static getColumnDefinitions(): Record<string, string | import("cordova-sites-database/dist/BDColumnType").BDColumnType>;
    static getRelationDefinitions(): Record<string, import("cordova-sites-database/dist/BDRelationshipType").BDRelationshipType>;
}

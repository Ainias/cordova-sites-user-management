import { BaseModel } from "cordova-sites-database/dist/cordova-sites-database";
export declare class UserAccess extends BaseModel {
    user: any;
    access: any;
    constructor();
    static getRelationDefinitions(): Record<string, import("cordova-sites-database/dist/BDRelationshipType").BDRelationshipType>;
}

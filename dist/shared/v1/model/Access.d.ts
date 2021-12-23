import { EasySyncBaseModel } from "cordova-sites-easy-sync/dist/shared";
export declare class Access extends EasySyncBaseModel {
    name: string;
    description: string;
    constructor();
    static getColumnDefinitions(): Record<string, string | import("cordova-sites-database/dist/BDColumnType").BDColumnType>;
}

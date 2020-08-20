"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Access = void 0;
const shared_1 = require("cordova-sites-easy-sync/dist/shared");
const cordova_sites_database_1 = require("cordova-sites-database/dist/cordova-sites-database");
class Access extends shared_1.EasySyncBaseModel {
    constructor() {
        super();
        this.name = null;
        this.description = null;
    }
    static getColumnDefinitions() {
        let columns = super.getColumnDefinitions();
        columns["name"] = { type: cordova_sites_database_1.BaseDatabase.TYPES.STRING, unique: true };
        columns["description"] = { type: cordova_sites_database_1.BaseDatabase.TYPES.STRING };
        return columns;
    }
}
exports.Access = Access;
Access.CAN_BE_SYNCED = false;
cordova_sites_database_1.BaseDatabase.addModel(Access);
//# sourceMappingURL=Access.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cordova_sites_database_1 = require("cordova-sites-database/dist/cordova-sites-database");
const Access_1 = require("../../../shared/v1/model/Access");
const User_1 = require("../../../shared/v1/model/User");
class UserAccess extends cordova_sites_database_1.BaseModel {
    constructor() {
        super();
        this.user = null;
        this.access = null;
    }
    static getRelationDefinitions() {
        let relations = super.getRelationDefinitions();
        relations["access"] = {
            target: Access_1.Access.getSchemaName(),
            type: "many-to-one",
            cascade: true
        };
        relations["user"] = {
            target: User_1.User.getSchemaName(),
            type: "many-to-one",
            cascade: true
        };
        return relations;
    }
}
exports.UserAccess = UserAccess;
cordova_sites_database_1.BaseDatabase.addModel(UserAccess);
//# sourceMappingURL=UserAccess.js.map
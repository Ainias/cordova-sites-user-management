"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const shared_1 = require("cordova-sites-easy-sync/dist/shared");
const cordova_sites_database_1 = require("cordova-sites-database/dist/cordova-sites-database");
const Role_1 = require("./Role");
class User extends shared_1.EasySyncBaseModel {
    constructor() {
        super();
        this.username = null;
        this.email = null;
        this.password = null;
        this.roles = null;
        this.activated = false;
        this.blocked = false;
        this.salt = null;
    }
    toJSON() {
        return {
            id: this.id,
            username: this.username,
        };
    }
    static getColumnDefinitions() {
        let columns = super.getColumnDefinitions();
        columns["username"] = { type: cordova_sites_database_1.BaseDatabase.TYPES.STRING, unique: true };
        columns["email"] = { type: cordova_sites_database_1.BaseDatabase.TYPES.STRING, unique: true };
        columns["password"] = { type: cordova_sites_database_1.BaseDatabase.TYPES.STRING };
        columns["activated"] = cordova_sites_database_1.BaseDatabase.TYPES.BOOLEAN;
        columns["blocked"] = cordova_sites_database_1.BaseDatabase.TYPES.BOOLEAN;
        columns["salt"] = { type: cordova_sites_database_1.BaseDatabase.TYPES.STRING };
        return columns;
    }
    static getRelationDefinitions() {
        let relations = super.getRelationDefinitions();
        relations["roles"] = {
            target: Role_1.Role.getSchemaName(),
            type: "many-to-many",
            joinTable: {
                name: "userRole"
            },
            cascade: false
        };
        return relations;
    }
    static prepareSync(entities) {
        let jsonEntities = [];
        entities.forEach(entity => {
            let jsonEntity = {};
            jsonEntity.id = entity.id;
            jsonEntity.createdAt = new Date();
            jsonEntity.updatedAt = new Date();
            jsonEntity.username = "";
            jsonEntity.email = "";
            jsonEntity.password = "";
            jsonEntity.salt = "";
            jsonEntity.activated = 1;
            jsonEntity.blocked = 1;
            jsonEntity.version = 1;
            jsonEntity.deleted = 0;
            jsonEntities.push(jsonEntity);
        });
        return jsonEntities;
    }
}
exports.User = User;
cordova_sites_database_1.BaseDatabase.addModel(User);
//# sourceMappingURL=User.js.map
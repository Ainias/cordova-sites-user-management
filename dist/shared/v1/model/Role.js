"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const shared_1 = require("cordova-sites-easy-sync/dist/shared");
const cordova_sites_database_1 = require("cordova-sites-database/dist/cordova-sites-database");
const Access_1 = require("./Access");
class Role extends shared_1.EasySyncBaseModel {
    constructor() {
        super();
        this.name = null;
        this.description = null;
        this.accesses = null;
        this.parents = null;
        this.children = null;
    }
    static getColumnDefinitions() {
        let columns = super.getColumnDefinitions();
        columns["name"] = { type: cordova_sites_database_1.BaseDatabase.TYPES.STRING };
        columns["description"] = { type: cordova_sites_database_1.BaseDatabase.TYPES.STRING };
        return columns;
    }
    static getRelationDefinitions() {
        let relations = super.getRelationDefinitions();
        relations["accesses"] = {
            target: Access_1.Access.getSchemaName(),
            type: "many-to-many",
            joinTable: {
                name: "roleAccess"
            },
            cascade: false
        };
        relations["parents"] = {
            target: Role.getSchemaName(),
            type: "many-to-many",
            joinTable: {
                name: "roleChildren",
                joinColumn: {
                    name: "childId",
                    referencedColumnName: "id"
                },
                inverseJoinColumn: {
                    name: "parentId",
                    referencedColumnName: "id"
                }
            },
            cascade: false
        };
        relations["children"] = {
            target: Role.getSchemaName(),
            type: "many-to-many",
            joinTable: {
                name: "roleChildren",
                joinColumn: {
                    name: "parentId",
                    referencedColumnName: "id"
                },
                inverseJoinColumn: {
                    name: "childId",
                    referencedColumnName: "id"
                }
            },
            cascade: false
        };
        return relations;
    }
}
exports.Role = Role;
cordova_sites_database_1.BaseDatabase.addModel(Role);
//# sourceMappingURL=Role.js.map
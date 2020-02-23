import {EasySyncBaseModel} from "cordova-sites-easy-sync/dist/shared";
import {BaseDatabase} from "cordova-sites-database/dist/cordova-sites-database";
import {Access} from "./Access";

export class Role extends EasySyncBaseModel{

    name: string;
    description: string;
    accesses;
    parents;
    children;

    constructor() {
        super();
        this.name = null;
        this.description = null;
        this.accesses = null;
        this.parents = null;
        this.children = null;
    }

    static getColumnDefinitions(){
        let columns = super.getColumnDefinitions();
        columns["name"] = {type: BaseDatabase.TYPES.STRING};
        columns["description"] = {type: BaseDatabase.TYPES.STRING};
        return columns;
    }

    static getRelationDefinitions(){
        let relations = super.getRelationDefinitions();
        relations["accesses"] = {
            target: Access.getSchemaName(),
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
Role.CAN_BE_SYNCED = false;
BaseDatabase.addModel(Role);
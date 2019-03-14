import {EasySyncBaseModel} from "cordova-sites-easy-sync/model";
import {BaseDatabase} from "cordova-sites-database";
import {Access} from "./Access";

export class Role extends EasySyncBaseModel{
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
            cascade: true
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
            cascade: true
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
            cascade: true
        };
        return relations;
    }
}
BaseDatabase.addModel(Role);
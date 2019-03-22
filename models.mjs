import { EasySyncBaseModel } from 'cordova-sites-easy-sync/model';
import { BaseDatabase } from 'cordova-sites-database';

// import {Role} from "./Role";

class Access extends EasySyncBaseModel{
    constructor() {
        super();
        this.name = null;
        this.description = null;
    }

    static getColumnDefinitions(){
        let columns = super.getColumnDefinitions();
        columns["name"] = {type: BaseDatabase.TYPES.STRING, unique: true};
        columns["description"] = {type: BaseDatabase.TYPES.STRING};
        return columns;
    }
}
BaseDatabase.addModel(Access);

class Role extends EasySyncBaseModel{
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
BaseDatabase.addModel(Role);

class User extends EasySyncBaseModel{
    constructor() {
        super();
        this.username = null;
        this.email = null;
        this.password = null;
        this.roles = null;
    }

    toJSON(){
        return {
            "id": this.id,
            "username": this.username
        };
    }

    static getColumnDefinitions(){
        let columns = super.getColumnDefinitions();
        columns["username"] = {type: BaseDatabase.TYPES.STRING, unique: true};
        columns["email"] = {type: BaseDatabase.TYPES.STRING, unique: true};
        columns["password"] = {type: BaseDatabase.TYPES.STRING};
        return columns;
    }

    static getRelationDefinitions(){
        let relations = super.getRelationDefinitions();
        relations["roles"] = {
            target: Role.getSchemaName(),
            type: "many-to-many",
            joinTable: {
                name: "userRole"
            },
            cascade: false
        };
        return relations;
    }
}
BaseDatabase.addModel(User);

export { Access, Role, User };

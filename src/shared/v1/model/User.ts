import {EasySyncBaseModel} from "cordova-sites-easy-sync/model";
import {BaseDatabase} from "cordova-sites-database/dist/cordova-sites-database";
import {Role} from "./Role";

export class User extends EasySyncBaseModel{

    username: string;
    email: string;
    password: string;
    roles;
    activated: boolean;
    blocked: boolean;
    salt: string;

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
        columns["activated"] = BaseDatabase.TYPES.BOOLEAN;
        columns["blocked"] = BaseDatabase.TYPES.BOOLEAN;
        columns["salt"] = {type: BaseDatabase.TYPES.STRING};
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
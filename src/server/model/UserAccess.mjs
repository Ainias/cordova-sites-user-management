import {BaseModel} from "cordova-sites-database";
import {BaseDatabase} from "cordova-sites-database";
import {Access} from "../../shared/model/Access";
import {User} from "../../shared/model/User";
// import {Role} from "./Role";

export class UserAccess extends BaseModel{
    constructor() {
        super();
        this.user = null;
        this.access = null;
    }

    static getRelationDefinitions(){
        let relations = super.getRelationDefinitions();
        relations["access"] = {
            target: Access.getSchemaName(),
            type: "many-to-one",
            cascade: true
        };
        relations["user"] = {
            target: User.getSchemaName(),
            type: "many-to-one",
            cascade: true
        };
        return relations;
    }
}
BaseDatabase.addModel(UserAccess );
import {BaseDatabase, BaseModel} from "cordova-sites-database/dist/cordova-sites-database";
import {Access} from "../../../shared/v1/model/Access";
import {User} from "../../../shared/v1/model/User";

export class UserAccess extends BaseModel{

    user;
    access;

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
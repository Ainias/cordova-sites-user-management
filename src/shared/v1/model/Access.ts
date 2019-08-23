import {EasySyncBaseModel} from "cordova-sites-easy-sync/model";
import {BaseDatabase} from "cordova-sites-database/dist/cordova-sites-database";
// import {Role} from "./Role";

export class Access extends EasySyncBaseModel{

    name: string;
    description: string;

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
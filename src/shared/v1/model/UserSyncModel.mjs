import {AccessEasySyncModel} from "./AccessEasySyncModel";
import {BaseDatabase} from "cordova-sites-database";
import {User} from "./User";

export class UserSyncModel extends AccessEasySyncModel {

    // static getColumnDefinitions() {
    //     let columns = super.getColumnDefinitions();
    //     columns["userId"] = {
    //         type: BaseDatabase.TYPES.INTEGER,
    //         nullable: true
    //     };
    //     return columns;
    // }

    static getRelationDefinitions() {
        let relations = super.getRelationDefinitions();
        relations["user"] = {
            target: User.getSchemaName(),
            type: "many-to-one",
            // joinColumn: {
            //     name: "userId"
            // },
            cascade: false,
            nullable: !this.NEED_USER
        };

        return relations;
    }
}
UserSyncModel.NEED_USER = false;
import {AccessEasySyncModel} from "./AccessEasySyncModel";
import {EasySyncPartialModel} from "cordova-sites-easy-sync/model"
import {User} from "./User";

export class UserSyncPartialModel extends EasySyncPartialModel {

    static NEED_USER: boolean;

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
UserSyncPartialModel.NEED_USER = false;
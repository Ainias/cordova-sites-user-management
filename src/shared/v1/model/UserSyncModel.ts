import {AccessEasySyncModel} from "./AccessEasySyncModel";
import {User} from "./User";

export class UserSyncModel extends AccessEasySyncModel {

    static NEED_USER: boolean;

    user: User;

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
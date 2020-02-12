"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const shared_1 = require("cordova-sites-easy-sync/dist/shared");
const User_1 = require("./User");
class UserSyncPartialModel extends shared_1.EasySyncPartialModel {
    static getRelationDefinitions() {
        let relations = super.getRelationDefinitions();
        relations["user"] = {
            target: User_1.User.getSchemaName(),
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
exports.UserSyncPartialModel = UserSyncPartialModel;
UserSyncPartialModel.NEED_USER = false;
//# sourceMappingURL=UserSyncPartialModel.js.map
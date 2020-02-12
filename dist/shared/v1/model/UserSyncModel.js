"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AccessEasySyncModel_1 = require("./AccessEasySyncModel");
const User_1 = require("./User");
class UserSyncModel extends AccessEasySyncModel_1.AccessEasySyncModel {
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
exports.UserSyncModel = UserSyncModel;
UserSyncModel.NEED_USER = false;
//# sourceMappingURL=UserSyncModel.js.map
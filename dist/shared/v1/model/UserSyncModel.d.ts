import { AccessEasySyncModel } from "./AccessEasySyncModel";
import { User } from "./User";
export declare class UserSyncModel extends AccessEasySyncModel {
    static NEED_USER: boolean;
    user: User;
    static getRelationDefinitions(): {};
}

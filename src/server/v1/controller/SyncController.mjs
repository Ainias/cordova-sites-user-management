import {EasySyncController} from "cordova-sites-easy-sync/src/server/EasySyncController";
import {AccessEasySyncModel} from "../../../shared/model/AccessEasySyncModel";
import {UserManager} from "../UserManager";

export class SyncController extends EasySyncController{

    static async _syncModel(model, lastSynced, offset, where, req) {
        if (model.prototype instanceof AccessEasySyncModel){
            let user = req.user;
            if (model.ACCESS_READ === false || (model.ACCESS_READ !== true && (!user || !UserManager.hasAccess(user, model.ACCESS_READ)))){
                throw new Error("user "+(user?user.id:"null")+" tried to sync model " + model.getSchemaName()+ " without permission");
            }
        }
        else if (model.CAN_BE_SYNCED === false) {
            throw new Error("tried to sync unsyncable model " + model.getSchemaName());
        }
        return this._doSyncModel(model, lastSynced, offset, where);
    }
}
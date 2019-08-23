import {EasySyncBaseModel} from "cordova-sites-easy-sync/model";

export class AccessEasySyncModel extends EasySyncBaseModel{
    static ACCESS_READ: string|boolean;
    static ACCESS_MODIFY: string|boolean;

}
AccessEasySyncModel.ACCESS_READ=true;
AccessEasySyncModel.ACCESS_MODIFY=false;
AccessEasySyncModel.CAN_BE_SYNCED = false;
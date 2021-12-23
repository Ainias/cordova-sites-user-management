import { EasySyncBaseModel } from 'cordova-sites-easy-sync/dist/shared';

export class AccessEasySyncModel extends EasySyncBaseModel {
    static ACCESS_READ: string | boolean;
    static ACCESS_MODIFY: string | boolean;
}

AccessEasySyncModel.ACCESS_READ = true;
AccessEasySyncModel.ACCESS_MODIFY = false;
AccessEasySyncModel.CAN_BE_SYNCED = false;

export function isAccessEasySyncModel(modelClass: typeof EasySyncBaseModel): modelClass is typeof AccessEasySyncModel {
    return modelClass.prototype instanceof AccessEasySyncModel;
}

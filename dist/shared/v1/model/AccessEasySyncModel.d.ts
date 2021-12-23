import { EasySyncBaseModel } from 'cordova-sites-easy-sync/dist/shared';
export declare class AccessEasySyncModel extends EasySyncBaseModel {
    static ACCESS_READ: string | boolean;
    static ACCESS_MODIFY: string | boolean;
}
export declare function isAccessEasySyncModel(modelClass: typeof EasySyncBaseModel): modelClass is typeof AccessEasySyncModel;

import { EasySyncController } from 'cordova-sites-easy-sync/dist/server/EasySyncController';
export declare class SyncController extends EasySyncController {
    static syncModel(model: any, lastSynced: any, offset: any, where: any, req: any, order?: any): Promise<{
        model: any;
        newLastSynced: number;
        entities: any;
        nextOffset: any;
        shouldAskAgain: boolean;
    }>;
    static modifyModel(req: any, res: any): Promise<any>;
    static deleteModel(req: any, res: any): Promise<any>;
}

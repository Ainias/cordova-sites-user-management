import { EasySyncController } from 'cordova-sites-easy-sync/dist/server/EasySyncController';
import { isAccessEasySyncModel } from '../../../shared/v1/model/AccessEasySyncModel';
import { UserManager } from '../UserManager';
import { EasySyncServerDb } from 'cordova-sites-easy-sync/dist/server/EasySyncServerDb';

export class SyncController extends EasySyncController {
    static async syncModel(model, lastSynced, offset, where, req, order?) {
        if (isAccessEasySyncModel(model)) {
            let user = req.user;
            if (
                model.ACCESS_READ === false ||
                (model.ACCESS_READ !== true && (!user || !(await UserManager.hasAccess(user, model.ACCESS_READ))))
            ) {
                throw new Error(
                    'user ' +
                        (user ? user.id : 'null') +
                        ' tried to sync model ' +
                        model.getSchemaName() +
                        ' without permission'
                );
            }
        } else if (model.CAN_BE_SYNCED === false) {
            throw new Error('tried to sync unsyncable model ' + model.getSchemaName());
        }

        return this.doSyncModel(model, lastSynced, offset, where, order);
    }

    static async modifyModel(req, res) {
        let modelName = req.body.model;
        let modelData = req.body.values;

        let model = EasySyncServerDb.getModel(modelName);

        if (isAccessEasySyncModel(model)) {
            let user = req.user;
            if (
                model.ACCESS_MODIFY === false ||
                (model.ACCESS_MODIFY !== true && (!user || !(await UserManager.hasAccess(user, model.ACCESS_MODIFY))))
            ) {
                throw new Error(
                    'user ' +
                        (user ? user.id : 'null') +
                        ' tried to modify model ' +
                        model.getSchemaName() +
                        ' without permission!'
                );
            }
        } else if (model.CAN_BE_SYNCED === false) {
            throw new Error('tried to sync unsyncable model ' + model.getSchemaName());
        }
        return res.json(await this.doModifyModel(model, modelData));
    }

    static async deleteModel(req, res) {
        let modelName = req.body.model;
        let modelIds = req.body.id;

        let model = EasySyncServerDb.getModel(modelName);

        if (isAccessEasySyncModel(model)) {
            let user = req.user;
            if (
                model.ACCESS_MODIFY === false ||
                (model.ACCESS_MODIFY !== true && (!user || !(await UserManager.hasAccess(user, model.ACCESS_MODIFY))))
            ) {
                throw new Error(
                    'user ' +
                        (user ? user.id : 'null') +
                        ' tried to delete model ' +
                        model.getSchemaName() +
                        ' (' +
                        modelIds +
                        ') without permission'
                );
            }
        } else if (model.CAN_BE_SYNCED === false) {
            throw new Error('tried to sync unsyncable model ' + model.getSchemaName());
        }

        await this.doDeleteModel(model, modelIds);

        return res.json({});
    }
}

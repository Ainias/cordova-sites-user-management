"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyncController = void 0;
const EasySyncController_1 = require("cordova-sites-easy-sync/dist/server/EasySyncController");
const AccessEasySyncModel_1 = require("../../../shared/v1/model/AccessEasySyncModel");
const UserManager_1 = require("../UserManager");
const EasySyncServerDb_1 = require("cordova-sites-easy-sync/dist/server/EasySyncServerDb");
class SyncController extends EasySyncController_1.EasySyncController {
    static _syncModel(model, lastSynced, offset, where, req, order) {
        return __awaiter(this, void 0, void 0, function* () {
            if (model.prototype instanceof AccessEasySyncModel_1.AccessEasySyncModel) {
                let user = req.user;
                if (model.ACCESS_READ === false || (model.ACCESS_READ !== true && (!user || !(yield UserManager_1.UserManager.hasAccess(user, model.ACCESS_READ))))) {
                    throw new Error("user " + (user ? user.id : "null") + " tried to sync model " + model.getSchemaName() + " without permission");
                }
            }
            else if (model.CAN_BE_SYNCED === false) {
                throw new Error("tried to sync unsyncable model " + model.getSchemaName());
            }
            return this._doSyncModel(model, lastSynced, offset, where, order);
        });
    }
    static modifyModel(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let modelName = req.body.model;
            let modelData = req.body.values;
            let model = EasySyncServerDb_1.EasySyncServerDb.getModel(modelName);
            if (model.prototype instanceof AccessEasySyncModel_1.AccessEasySyncModel) {
                let user = req.user;
                if (model.ACCESS_MODIFY === false || (model.ACCESS_MODIFY !== true && (!user || !(yield UserManager_1.UserManager.hasAccess(user, model.ACCESS_MODIFY))))) {
                    throw new Error("user " + (user ? user.id : "null") + " tried to modify model " + model.getSchemaName() + " without permission!");
                }
            }
            else if (model.CAN_BE_SYNCED === false) {
                throw new Error("tried to sync unsyncable model " + model.getSchemaName());
            }
            return res.json(yield this._doModifyModel(model, modelData));
        });
    }
    static deleteModel(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let modelName = req.body.model;
            let modelIds = req.body.id;
            let model = EasySyncServerDb_1.EasySyncServerDb.getModel(modelName);
            if (model.prototype instanceof AccessEasySyncModel_1.AccessEasySyncModel) {
                let user = req.user;
                if (model.ACCESS_MODIFY === false || (model.ACCESS_MODIFY !== true && (!user || !(yield UserManager_1.UserManager.hasAccess(user, model.ACCESS_MODIFY))))) {
                    throw new Error("user " + (user ? user.id : "null") + " tried to delete model " + model.getSchemaName() + " (" + modelIds + ") without permission");
                }
            }
            else if (model.CAN_BE_SYNCED === false) {
                throw new Error("tried to sync unsyncable model " + model.getSchemaName());
            }
            yield this._doDeleteModel(model, modelIds);
            return res.json({});
        });
    }
}
exports.SyncController = SyncController;
//# sourceMappingURL=SyncController.js.map
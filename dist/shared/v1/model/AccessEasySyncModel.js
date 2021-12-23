"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAccessEasySyncModel = exports.AccessEasySyncModel = void 0;
const shared_1 = require("cordova-sites-easy-sync/dist/shared");
class AccessEasySyncModel extends shared_1.EasySyncBaseModel {
}
exports.AccessEasySyncModel = AccessEasySyncModel;
AccessEasySyncModel.ACCESS_READ = true;
AccessEasySyncModel.ACCESS_MODIFY = false;
AccessEasySyncModel.CAN_BE_SYNCED = false;
function isAccessEasySyncModel(modelClass) {
    return modelClass.prototype instanceof AccessEasySyncModel;
}
exports.isAccessEasySyncModel = isAccessEasySyncModel;
//# sourceMappingURL=AccessEasySyncModel.js.map
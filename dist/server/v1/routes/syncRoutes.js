"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const SyncController_1 = require("../controller/SyncController");
const UserManager_1 = require("../UserManager");
const syncRoutes = express.Router();
exports.syncRoutes = syncRoutes;
const errorHandler = (fn, context) => {
    return (req, res, next) => {
        const resPromise = fn.call(context, req, res, next);
        if (resPromise && resPromise.catch) {
            resPromise.catch(err => next(err));
        }
    };
};
syncRoutes.get("", errorHandler(UserManager_1.UserManager.setUserFromToken, UserManager_1.UserManager), errorHandler(SyncController_1.SyncController.sync, SyncController_1.SyncController));
syncRoutes.post("", errorHandler(UserManager_1.UserManager.setUserFromToken, UserManager_1.UserManager), errorHandler(SyncController_1.SyncController.modifyModel, SyncController_1.SyncController));
syncRoutes.post("/delete", errorHandler(UserManager_1.UserManager.setUserFromToken, UserManager_1.UserManager), errorHandler(SyncController_1.SyncController.deleteModel, SyncController_1.SyncController));
//# sourceMappingURL=syncRoutes.js.map
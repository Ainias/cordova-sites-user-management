import express from 'express';
import {SyncController} from "../controller/SyncController";
import {UserManager} from "../UserManager";

const syncRoutes = express.Router();

const errorHandler = (fn, context) => {
    return (req, res, next) => {
        const resPromise = fn.call(context, req,res,next);
        if (resPromise && resPromise.catch){
            resPromise.catch(err => next(err));
        }
    }
};

syncRoutes.get("", errorHandler(UserManager.setUserFromToken, UserManager), errorHandler(SyncController.sync, SyncController));
syncRoutes.post("", errorHandler(UserManager.setUserFromToken, UserManager), errorHandler(SyncController.modifyModel, SyncController));
syncRoutes.post("/delete", errorHandler(UserManager.setUserFromToken, UserManager), errorHandler(SyncController.deleteModel, SyncController));

export {syncRoutes};
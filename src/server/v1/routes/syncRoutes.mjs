import express from 'express';
import {SyncController} from "../controller/SyncController";

const syncRoutes = express.Router();

const errorHandler = (fn, context) => {
    return (req, res, next) => {
        const resPromise = fn.call(context, req,res,next);
        if (resPromise && resPromise.catch){
            resPromise.catch(err => next(err));
        }
    }
};

syncRoutes.get("", errorHandler(SyncController.sync, SyncController));
syncRoutes.post("", errorHandler(SyncController.modifyModel, SyncController));

export {syncRoutes};
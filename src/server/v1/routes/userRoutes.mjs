import express from 'express';
import {UserController} from "../controller/UserController";
import {UserManager} from "../UserManager";

const userRoutes = express.Router();

const errorHandler = (fn) => {
    return (req, res, next) => {
        const resPromise = fn(req,res,next);
        if (resPromise && resPromise.catch){
            resPromise.catch(err => next(err));
        }
    }
};

userRoutes.post("/login", errorHandler(UserController.login));
userRoutes.post("/register", errorHandler(UserController.register));
userRoutes.get("", errorHandler(UserManager.setUserFromToken), errorHandler(UserController.getMe));

export {userRoutes};
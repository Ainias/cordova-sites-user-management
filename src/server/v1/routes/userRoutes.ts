import * as express from 'express';
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
userRoutes.post("/forgotPW", errorHandler(UserController.sendPasswordResetMail));
userRoutes.post("/forgotPW/2", errorHandler(UserController.resetPassword));

export {userRoutes};
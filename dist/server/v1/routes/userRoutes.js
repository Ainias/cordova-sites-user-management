"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const UserController_1 = require("../controller/UserController");
const UserManager_1 = require("../UserManager");
const userRoutes = express.Router();
exports.userRoutes = userRoutes;
const errorHandler = (fn) => {
    return (req, res, next) => {
        const resPromise = fn(req, res, next);
        if (resPromise && resPromise.catch) {
            resPromise.catch(err => next(err));
        }
    };
};
userRoutes.post("/login", errorHandler(UserController_1.UserController.login));
userRoutes.post("/register", errorHandler(UserController_1.UserController.register));
userRoutes.get("", errorHandler(UserManager_1.UserManager.setUserFromToken), errorHandler(UserController_1.UserController.getMe));
userRoutes.post("/forgotPW", errorHandler(UserController_1.UserController.sendPasswordResetMail));
userRoutes.post("/forgotPW/2", errorHandler(UserController_1.UserController.resetPassword));
//# sourceMappingURL=userRoutes.js.map
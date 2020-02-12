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
const UserManager_1 = require("../UserManager");
const User_1 = require("../../../shared/v1/model/User");
class UserController {
    static login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let userData = yield UserManager_1.UserManager.login(req.body.email, req.body.password);
            if (userData) {
                res.json({
                    success: true,
                    token: userData.token,
                    user: userData.user
                });
            }
            else {
                res.status(403);
                res.json({
                    success: false,
                    message: "wrong email or password"
                });
            }
        });
    }
    static register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let user = yield UserManager_1.UserManager.register(req.body.email, req.body.username, req.body.password);
                res.json({
                    success: true,
                    token: UserManager_1.UserManager._generateToken(user),
                    user: user
                });
            }
            catch (e) {
                console.error(e);
                res.status(400);
                res.json({
                    success: false,
                    message: e.message
                });
            }
        });
    }
    static getMe(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = req.user;
            if (user) {
                let accesses = yield UserManager_1.UserManager.loadCachedAccessesForUser(user);
                let accessNames = [];
                accesses.forEach(access => accessNames.push(access.name));
                let result = {
                    "userData": {
                        "id": user.id,
                        "loggedIn": true,
                        "online": true,
                        "username": user.username,
                        "email": user.email,
                        "accesses": accessNames
                    }
                };
                if (new Date((req.tokenData.iat + UserManager_1.UserManager.RENEW_AFTER) * 1000).getTime() < new Date().getTime()) {
                    result["token"] = UserManager_1.UserManager._generateToken(user);
                }
                res.json(result);
            }
            else {
                res.json({
                    "userData": {
                        "id": null,
                        "loggedIn": false,
                        "online": true,
                        "username": null,
                        "email": null,
                        "accesses": [
                            "loggedOut",
                            "online",
                            "default"
                        ]
                    }
                });
            }
        });
    }
    static sendPasswordResetMail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let email = req.body.email;
            let user = yield User_1.User.findOne({ email: email });
            if (user) {
                let info = yield UserManager_1.UserManager.sendPasswordResetEmail(user, req.lang);
                let success = (info.accepted.indexOf(email) !== -1);
                yield res.json({ success: success });
            }
            else {
                yield res.json({ success: false, message: "User not found!" });
            }
        });
    }
    static resetPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let token = req.body.token;
            let password = req.body.password;
            if (yield UserManager_1.UserManager.resetPasswordWithToken(token, password)) {
                console.log("success");
                yield res.json({ success: true });
            }
            else {
                console.log("no success");
                yield res.json({ success: false });
            }
        });
    }
}
exports.UserController = UserController;
//# sourceMappingURL=UserController.js.map
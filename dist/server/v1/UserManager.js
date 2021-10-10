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
exports.UserManager = void 0;
const jwt = require("jsonwebtoken");
const User_1 = require("../../shared/v1/model/User");
const Role_1 = require("../../shared/v1/model/Role");
const EasySyncServerDb_1 = require("cordova-sites-easy-sync/dist/server/EasySyncServerDb");
const shared_1 = require("js-helper/dist/shared");
const UserAccess_1 = require("./model/UserAccess");
// import * as crypto from "crypto";
const nodemailer = require("nodemailer");
const _typeorm = require("typeorm");
const server_1 = require("cordova-sites/dist/server");
const crypto = require('crypto');
let typeorm = _typeorm;
class UserManager {
    static getUserFromToken(token) {
        const result = new shared_1.PromiseWithHandlers();
        if (token) {
            jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => __awaiter(this, void 0, void 0, function* () {
                try {
                    if (!err) {
                        let where = {
                            id: decoded.userId,
                            password: decoded.passwordHash,
                            blocked: false,
                        };
                        if (UserManager.LOGIN_NEED_TO_BE_ACTIVATED) {
                            where['activated'] = true;
                        }
                        let user = yield User_1.User.findOne(where);
                        result.resolve([user, decoded]);
                    }
                    else {
                        result.reject(err);
                    }
                }
                catch (e) {
                    result.reject(e);
                }
            }));
        }
        else {
            result.resolve([null, null]);
        }
        return result;
    }
    static setUserFromToken(req, res, next) {
        let token = req.headers['x-access-token'] || req.headers['authorization']; // Express headers are auto converted to lowercase
        if (token && token.startsWith('Bearer ')) {
            // Remove Bearer from string
            token = token.slice(7, token.length);
        }
        if (token) {
            UserManager.getUserFromToken(token)
                .then(([user, decodedToken]) => {
                if (user) {
                    req.tokenData = decodedToken;
                    req.user = user;
                }
                else {
                    console.log('user with id ' + decodedToken.userId + ' for token not found');
                }
                next();
            })
                .catch((e) => {
                console.error(e);
                next();
            });
        }
        else {
            next();
        }
    }
    static needToken(req, res, next) {
        UserManager.setUserFromToken(req, res, () => {
            if (!req.user) {
                return res.json({
                    success: false,
                    message: 'User is not valid',
                });
            }
            else {
                next();
            }
        });
    }
    static checkAccess(accessName) {
        return (req, res, next) => {
            UserManager.needToken(req, res, () => {
                UserManager.hasAccess(req.user, accessName).then((hasAccess) => {
                    if (!hasAccess) {
                        return res.json({
                            success: false,
                            message: 'Wrong Access!',
                        });
                    }
                    else {
                        next();
                    }
                });
            });
        };
    }
    static _hashPassword(user, password) {
        if (!user.salt) {
            user.salt = UserManager._generateSalt();
        }
        let hash = crypto.createHmac('sha512', user.salt + UserManager.PEPPER);
        hash.update(password);
        return hash.digest('hex');
    }
    static login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = yield User_1.User.findOne({ email: email.toLowerCase(), activated: true, blocked: false });
            if (user) {
                if (this._hashPassword(user, password) === user.password) {
                    let token = UserManager._generateToken(user);
                    return { user: user, token: token };
                }
                else {
                    return null;
                }
            }
            else {
                return null;
            }
        });
    }
    static register(email, username, password) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!UserManager.REGISTRATION_CAN_REGISTER) {
                throw new Error('Cannot register new user, since user registration is not activated!');
            }
            email = email.toLowerCase();
            if (!UserManager.REGISTRATION_USERNAME_IS_CASE_SENSITIVE) {
                username = username.toLowerCase();
            }
            let otherUsers = yield Promise.all([
                User_1.User.findOne({ email: email }),
                User_1.User.findOne({ username: typeorm.Equal(username) }),
            ]);
            if (otherUsers[0]) {
                throw new Error('A user with the email-address exists already!');
            }
            if (otherUsers[1]) {
                throw new Error('A user with the username exists already!');
            }
            let user = new User_1.User();
            user.username = username;
            user.email = email;
            user.password = UserManager._hashPassword(user, password);
            user.activated = UserManager.REGISTRATION_IS_ACTIVATED;
            user.blocked = false;
            user.roles = yield Role_1.Role.findByIds(UserManager.REGISTRATION_DEFAULT_ROLE_IDS);
            yield user.save();
            yield UserManager.updateCachedAccessesForUser(user);
            //TODO email senden
            return user;
        });
    }
    static sendPasswordResetEmail(user, language) {
        return __awaiter(this, void 0, void 0, function* () {
            let token = jwt.sign({ userId: user.id, version: user.version, action: 'pw-reset' }, process.env.JWT_SECRET, {
                expiresIn: UserManager.EXPIRES_IN,
            });
            let transporter = nodemailer.createTransport({
                host: process.env.EMAIL_HOST,
                port: process.env.EMAIL_PORT,
                secure: shared_1.Helper.nonNull(process.env.EMAIL_SECURE, '1') !== '0',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASSWORD,
                },
                tls: {
                    ciphers: 'SSLv3',
                },
            });
            let serverTranslator = new server_1.ServerTranslator(language);
            let mailOptions = {
                from: process.env.EMAIL_FROM,
                to: user.email,
                subject: serverTranslator.translate('email-header-usermanager-password-forgotten'),
                text: serverTranslator.translate('email-usermanager-password-forgotten', [
                    user.username,
                    process.env.PW_FORGOTTEN_LINK + token,
                ]),
            };
            return new Promise((resolve, reject) => {
                transporter.sendMail(mailOptions, (err, info) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(info);
                    }
                });
            });
        });
    }
    static resetPasswordWithToken(token, newPw) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => __awaiter(this, void 0, void 0, function* () {
                    if (!err) {
                        if (decoded.action === 'pw-reset') {
                            let where = {
                                id: decoded.userId,
                                version: decoded.version,
                                blocked: false,
                            };
                            let user = yield User_1.User.findOne(where);
                            if (user) {
                                user.password = UserManager._hashPassword(user, newPw);
                                yield user.save();
                                resolve(true);
                            }
                            else {
                                console.log('user with id ' + decoded.userId + ' for token not found while resetting password');
                                resolve(false);
                            }
                        }
                        else {
                            resolve(false);
                        }
                    }
                    else {
                        console.error(err);
                        reject(err);
                    }
                }));
            });
        });
    }
    static _generateToken(user) {
        return jwt.sign({ userId: user.id, passwordHash: user.password }, process.env.JWT_SECRET, {
            expiresIn: UserManager.EXPIRES_IN,
        });
    }
    static findAccessesForUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            let accesses = [];
            let roles = user.roles;
            let roleIds = [];
            roles.forEach((role) => {
                roleIds.push(role.id);
            });
            //Reload roles with accesses
            roles = yield Role_1.Role.findByIds(roleIds, ['accesses']);
            yield shared_1.Helper.asyncForEach(roles, (role) => __awaiter(this, void 0, void 0, function* () {
                accesses.push(...(yield this.findAccessesForRole(role)));
            }));
            return accesses;
        });
    }
    static findAccessesForRole(role) {
        return __awaiter(this, void 0, void 0, function* () {
            let accesses = role.accesses;
            let repo = yield EasySyncServerDb_1.EasySyncServerDb.getInstance()._getRepository(Role_1.Role.getSchemaName());
            let parents = yield repo
                .createQueryBuilder(Role_1.Role.getSchemaName())
                .leftJoinAndSelect(Role_1.Role.getSchemaName() + '.accesses', 'access')
                .leftJoinAndSelect(Role_1.Role.getSchemaName() + '.children', 'child')
                .where('child.id = :id', { id: role.id })
                .getMany();
            yield shared_1.Helper.asyncForEach(parents, (role) => __awaiter(this, void 0, void 0, function* () {
                let otherAccesses = yield this.findAccessesForRole(role);
                accesses.push(...otherAccesses);
            }));
            return accesses;
        });
    }
    static updateCachedAccessesForUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const users = (yield UserAccess_1.UserAccess.find({ user: { id: user.id } }, null, null, null, UserAccess_1.UserAccess.getRelations()));
            const oldUserAccesses = shared_1.Helper.arrayToObject(users, (oldAccess) => oldAccess.access.id);
            let oldAccessesIds = Object.keys(oldUserAccesses);
            let oldAccessesStillActive = [];
            let newUserAccesses = [];
            let accesses = yield UserManager.findAccessesForUser(user);
            accesses.forEach((access) => {
                if (oldAccessesIds.indexOf('' + access.id) === -1) {
                    let userAccess = new UserAccess_1.UserAccess();
                    userAccess.user = user;
                    userAccess.access = access;
                    newUserAccesses.push(userAccess);
                }
                else {
                    oldAccessesStillActive.push(access.id);
                }
            });
            let deleteIds = oldAccessesIds.filter((id) => oldAccessesStillActive.indexOf(parseInt(id)) === -1);
            let deleteUserAccesses = [];
            deleteIds.forEach((id) => {
                if (oldUserAccesses[id]) {
                    deleteUserAccesses.push(oldUserAccesses[id]);
                }
            });
            yield Promise.all([UserAccess_1.UserAccess.saveMany(newUserAccesses), UserAccess_1.UserAccess.deleteMany(deleteUserAccesses)]);
        });
    }
    static loadCachedAccessesForUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            if (user._cachedAccesses) {
                return user._cachedAccesses;
            }
            let repo = yield EasySyncServerDb_1.EasySyncServerDb.getInstance()._getRepository(UserAccess_1.UserAccess.getSchemaName());
            let userAccesses = yield repo
                .createQueryBuilder(UserAccess_1.UserAccess.getSchemaName())
                .leftJoinAndSelect(UserAccess_1.UserAccess.getSchemaName() + '.user', 'user')
                .leftJoinAndSelect(UserAccess_1.UserAccess.getSchemaName() + '.access', 'access')
                .where('user.id = :id', { id: user.id })
                .getMany();
            let accesses = [];
            userAccesses.forEach((userAccess) => accesses.push(userAccess.access));
            user._cachedAccesses = accesses;
            return accesses;
        });
    }
    static hasAccess(user, access) {
        return __awaiter(this, void 0, void 0, function* () {
            let accesses = yield UserManager.loadCachedAccessesForUser(user);
            let accessNames = [];
            accesses.forEach((access) => accessNames.push(access.name));
            return accessNames.indexOf(access) !== -1;
        });
    }
    static _generateSalt() {
        let length = UserManager.SALT_LENGTH;
        return crypto
            .randomBytes(Math.ceil(length / 2))
            .toString('hex')
            .slice(0, length);
    }
}
exports.UserManager = UserManager;
UserManager.RENEW_AFTER = 60 * 60 * 24;
UserManager.REGISTRATION_SEND_EMAIL = true;
UserManager.SALT_LENGTH = 12;
UserManager.EXPIRES_IN = '7d';
UserManager.RENEW_AFTER = 60 * 60 * 24;
UserManager.PEPPER = '';
UserManager.LOGIN_NEED_TO_BE_ACTIVATED = true;
//Registration-Settings
UserManager.REGISTRATION_SEND_EMAIL = true;
UserManager.REGISTRATION_IS_ACTIVATED = false;
UserManager.REGISTRATION_DEFAULT_ROLE_IDS = [];
UserManager.REGISTRATION_USERNAME_IS_CASE_SENSITIVE = true;
UserManager.REGISTRATION_CAN_REGISTER = true;
//# sourceMappingURL=UserManager.js.map
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
exports.OfflineUserManager = void 0;
const client_1 = require("cordova-sites-easy-sync/dist/client");
const client_2 = require("cordova-sites/dist/client");
const UserManager_1 = require("./UserManager");
const Role_1 = require("../../shared/v1/model/Role");
const User_1 = require("../../shared/v1/model/User");
const Helper_1 = require("js-helper/dist/shared/Helper");
class OfflineUserManager extends UserManager_1.UserManager {
    constructor() {
        super();
        this._userData = {
            id: null,
            loggedIn: false,
            online: true,
            username: null,
            email: null,
            accesses: OfflineUserManager.LOGGED_OUT_ACCESSES,
        };
    }
    _doGetMe() {
        return __awaiter(this, void 0, void 0, function* () {
            let userId = yield client_2.NativeStoragePromise.getItem('user-manager-user-id');
            if (Helper_1.Helper.isNotNull(userId)) {
                let user = yield User_1.User.findById(userId, User_1.User.getRelations());
                if (Helper_1.Helper.isNotNull(user) && user.activated && !user.blocked) {
                    yield this._handleLoginFromUser(user);
                }
            }
            return this._userData;
        });
    }
    _handleLoginFromUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            let accesses = [];
            let roles = user.roles;
            let roleIds = [];
            roles.forEach((role) => {
                roleIds.push(role.id);
            });
            roles = yield Role_1.Role.findByIds(roleIds, ['accesses']);
            yield Helper_1.Helper.asyncForEach(roles, (role) => __awaiter(this, void 0, void 0, function* () {
                accesses.push(...(yield this._getAccessesFromRole(role)));
            }));
            let accessNames = [];
            accesses.forEach((access) => {
                accessNames.push(access.name);
            });
            this._userData = {
                id: user.id,
                loggedIn: true,
                online: true,
                username: user.username,
                email: user.email,
                accesses: accessNames,
            };
        });
    }
    _doLogin(email, password, saveLogin) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = yield User_1.User.findOne({
                email: email,
                password: this._hashPassword(password),
                activated: true,
                blocked: false,
            }, undefined, undefined, User_1.User.getRelations());
            if (user) {
                yield this._handleLoginFromUser(user);
                if (saveLogin) {
                    yield client_2.NativeStoragePromise.setItem('user-manager-user-id', user.id);
                }
                return true;
            }
            return false;
        });
    }
    _doLogout() {
        return __awaiter(this, void 0, void 0, function* () {
            this._userData = {
                id: null,
                loggedIn: false,
                online: true,
                username: null,
                email: null,
                accesses: OfflineUserManager.LOGGED_OUT_ACCESSES,
            };
            yield client_2.NativeStoragePromise.remove('user-manager-user-id');
            return false;
        });
    }
    _getAccessesFromRole(role) {
        return __awaiter(this, void 0, void 0, function* () {
            let accesses = role.accesses;
            let repo = yield client_1.EasySyncClientDb.getInstance().getRepository(Role_1.Role);
            let parents = yield repo
                .createQueryBuilder(Role_1.Role.getSchemaName())
                .leftJoinAndSelect(Role_1.Role.getSchemaName() + '.accesses', 'access')
                .leftJoinAndSelect(Role_1.Role.getSchemaName() + '.children', 'child')
                .where('child.id = :id', { id: role.id })
                .getMany();
            yield Helper_1.Helper.asyncForEach(parents, (role) => __awaiter(this, void 0, void 0, function* () {
                let otherAccesses = yield this._getAccessesFromRole(role);
                accesses.push(...otherAccesses);
            }));
            return accesses;
        });
    }
    _doRegister(email, username, password) {
        return __awaiter(this, void 0, void 0, function* () {
            let errors = {};
            let users = yield Promise.all([User_1.User.findOne({ email: email }), User_1.User.findOne({ username: username })]);
            if (Helper_1.Helper.isNotNull(users[0])) {
                errors['email'] = 'email is already in use.';
            }
            if (Helper_1.Helper.isNotNull(users[1])) {
                errors['username'] = 'username is already in use.';
            }
            if (Object.keys(errors).length > 0) {
                return errors;
            }
            let user = new User_1.User();
            user.id = yield OfflineUserManager._getNewId();
            user.email = email;
            user.password = this._hashPassword(password);
            user.username = username;
            user.roles = OfflineUserManager.DEFAULT_ROLES;
            user.activated = true;
            yield user.save();
            // user.roles
            yield this.login(email, password);
            return user;
        });
    }
    static _getNewId() {
        return __awaiter(this, void 0, void 0, function* () {
            if (Helper_1.Helper.isNull(OfflineUserManager._lastId)) {
                let user = yield User_1.User.findOne(undefined, { id: 'DESC' });
                OfflineUserManager._lastId = user.id;
            }
            OfflineUserManager._lastId++;
            return OfflineUserManager._lastId;
        });
    }
    _hashPassword(pw) {
        return pw;
    }
}
exports.OfflineUserManager = OfflineUserManager;
OfflineUserManager.LOGGED_OUT_ACCESSES = UserManager_1.UserManager.OFFLINE_ACCESSES;
OfflineUserManager.DEFAULT_ROLES = [];
OfflineUserManager._lastId = null;
//# sourceMappingURL=OfflineUserManager.js.map
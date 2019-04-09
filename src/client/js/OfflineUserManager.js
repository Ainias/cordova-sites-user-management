import {EasySyncClientDb} from "cordova-sites-easy-sync/client";
import {Helper, NativeStoragePromise} from "cordova-sites";
import {UserManager} from "./UserManager";
import {Role, User} from "../../../models";

export class OfflineUserManager extends UserManager {

    constructor() {
        super();
        this._userData = {
            id: null,
            loggedIn: false,
            online: true,
            username: null,
            email: null,
            accesses: OfflineUserManager.LOGGED_OUT_ACCESSES,
        }
    }

    async _doGetMe() {
        let userId = await NativeStoragePromise.getItem("user-manager-user-id");
        if (Helper.isNotNull(userId)) {
            let user = await User.findById(userId, User.getRelations());

            if (Helper.isNotNull(user) && user.activated && !user.blocked) {
                await this._handleLoginFromUser(user);
            }
        }
        return this._userData;
    }

    async _handleLoginFromUser(user) {
        let accesses = [];

        let roles = user.roles;
        let roleIds = [];
        roles.forEach(role => {
            roleIds.push(role.id);
        });

        roles = await Role.findByIds(roleIds, ["accesses"]);

        await Helper.asyncForEach(roles, async role => {
            accesses.push(...await this._getAccessesFromRole(role))
        });
        let accessNames = [];
        accesses.forEach(access => {
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
    }

    async _doLogin(email, password, saveLogin) {

        let user = await User.findOne({
            "email": email,
            "password": this._hashPassword(password),
            "activated": true,
            "blocked": false,
        }, undefined, undefined, User.getRelations());

        if (user) {
            await this._handleLoginFromUser(user);

            if (saveLogin){
                await NativeStoragePromise.setItem("user-manager-user-id", user.id);
            }

            return true;
        }
        return false;
    }

    async _doLogout() {
        this._userData = {
            id: null,
            loggedIn: false,
            online: true,
            username: null,
            email: null,
            accesses: OfflineUserManager.LOGGED_OUT_ACCESSES,
        };

        await NativeStoragePromise.remove("user-manager-user-id");
        return false;
    }

    async _getAccessesFromRole(role) {
        let accesses = role.accesses;

        let repo = await EasySyncClientDb.getInstance()._getRepository(Role.getSchemaName());
        let parents = await repo.createQueryBuilder(Role.getSchemaName())
            .leftJoinAndSelect(Role.getSchemaName() + '.accesses', "access")
            .leftJoinAndSelect(Role.getSchemaName() + '.children', "child")
            .where('child.id = :id', {id: role.id})
            .getMany();

        await Helper.asyncForEach(parents, async role => {
            let otherAccesses = await this._getAccessesFromRole(role);
            accesses.push(...otherAccesses);
        });
        return accesses;
    }

    async _doRegister(email, username, password) {
        let errors = {};
        let users = await Promise.all([
            User.findOne({"email": email}),
            User.findOne({"username": username}),
        ]);
        if (Helper.isNotNull(users[0])){
            errors["email"] = "email is already in use."
        }
        if (Helper.isNotNull(users[1])){
            errors["username"] = "username is already in use."
        }

        if (Object.keys(errors).length > 0){
            return errors;
        }

        let user = new User();
        user.id = await OfflineUserManager._getNewId();
        user.email = email;
        user.password = this._hashPassword(password);
        user.username = username;
        user.roles = OfflineUserManager.DEFAULT_ROLES;
        user.activated = true;
        await user.save();
        // user.roles

        await this.login(email, password);

        return user;
    }

    static async _getNewId(){
        if (Helper.isNull(OfflineUserManager._lastId)){
            let user = await User.findOne(undefined, {"id":  "DESC"});
            OfflineUserManager._lastId = user.id;
        }
        OfflineUserManager._lastId++;
        return OfflineUserManager._lastId;
    }

    _hashPassword(pw) {
        return pw;
    }
}

OfflineUserManager.LOGGED_OUT_ACCESSES = UserManager.OFFLINE_ACCESSES;
OfflineUserManager.DEFAULT_ROLES = [];
OfflineUserManager._lastId = null;
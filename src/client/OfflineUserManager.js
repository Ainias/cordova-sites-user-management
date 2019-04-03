import {EasySyncClientDb} from "cordova-sites-easy-sync/client";
import {Helper} from "cordova-sites";
import {UserManager} from "./UserManager";

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

    async getMe() {
        return this._userData;
    }

    async login(email, password) {

        let user = await OfflineUserManager._userModel.findOne({
            "email": email,
            "password": this._hashPassword(password)
        }, undefined, undefined, OfflineUserManager._userModel.getRelations());

        console.log(user);

        if (user && user.roles.length > 0) {
            let accesses = [];

            let roles = user.roles;
            let roleIds = [];
            roles.forEach(role => {
                roleIds.push(role.id);
            });

            roles = await roles[0].constructor.findByIds(roleIds, ["accesses"]);

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
            return true;
        }
        return false;
    }

    async logout() {
        this._userData = {
            id: null,
            loggedIn: false,
            online: true,
            username: null,
            email: null,
            accesses: OfflineUserManager.LOGGED_OUT_ACCESSES,
        };
        return false;
    }

    async _getAccessesFromRole(role) {
        let accesses = role.accesses;

        let repo = await EasySyncClientDb.getInstance()._getRepository(role.constructor.getSchemaName());
        let parents = await repo.createQueryBuilder(role.constructor.getSchemaName())
            .leftJoinAndSelect(role.constructor.getSchemaName() + '.accesses', "access")
            .leftJoinAndSelect(role.constructor.getSchemaName() + '.children', "child")
            .where('child.id = :id', {id: role.id})
            .getMany();

        await Helper.asyncForEach(parents, async role => {
            let otherAccesses = await this._getAccessesFromRole(role);
            accesses.push(...otherAccesses);
        });
        return accesses;
    }

    _hashPassword(pw) {
        return pw;
    }
}

OfflineUserManager._userModel = null;
OfflineUserManager.LOGGED_OUT_ACCESSES = UserManager.OFFLINE_ACCESSES;
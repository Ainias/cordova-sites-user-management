import { DelegateSite, Toast, Helper } from 'cordova-sites';
import { EasySyncClientDb } from 'cordova-sites-easy-sync/client';

class UserManager {

    constructor(){
        this._userData = {
            id: null,
            loggedIn: false,
            online: false,
            username: null,
            email: null,
            accesses: UserManager.OFFLINE_ACCESSES,
        };
    }

    hasAccess(access){
        return (this._userData.accesses.indexOf(access) !== -1);
    }

    async getMe(){
        throw new Error("not implemented!");
    }

    async login(email, password){
        throw new Error("not implemented!");
    }

    async logout(){
        throw new Error("not implemented!");
    }

    async register(email, username, password){
        throw new Error("not implemented!");
    }

    /**
     * @returns {UserManager}
     */
    static getInstance(){
        if (!UserManager._instance){
            UserManager._instance = new UserManager();
        }
        return UserManager._instance;
    }
}
UserManager._instance = null;
UserManager.OFFLINE_ACCESSES = [
    "offline"
];

class UserSite extends DelegateSite {

    constructor(site, access) {
        super(site);
        this._access = access;
    }

    async onConstruct(constructParameters) {
        if (UserManager.getInstance().hasAccess(this._access)) {
            await super.onConstruct(constructParameters);
        } else {
            await new Toast("wrong rights").show();
            await this.finish();
        }
    }


    // async onViewLoaded(...args) {
    //     if (UserManager.getInstance().hasAccess(this._access)) {
    //         await super.onViewLoaded(...args);
    //     } else {
    //         await new Toast("wrong rights").show();
    //         this.finish();
    //     }
    // }
    //
    // async onStart(...args) {
    //     if (UserManager.getInstance().hasAccess(this._access)) {
    //         await super.onStart(...args);
    //     } else {
    //         await new Toast("wrong rights").show();
    //         this.finish();
    //     }
    // }
}

class OfflineUserManager extends UserManager {

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
                accesses.push(...await this._getAccessesFromRole(role));
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

export { OfflineUserManager, UserManager, UserSite };

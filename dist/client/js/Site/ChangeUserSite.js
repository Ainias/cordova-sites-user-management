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
exports.ChangeUserSite = void 0;
const MenuSite_1 = require("cordova-sites/dist/client/js/Context/MenuSite");
const UserSite_1 = require("../Context/UserSite");
const Helper_1 = require("js-helper/dist/shared/Helper");
const DataManager_1 = require("cordova-sites/dist/client/js/DataManager");
const client_1 = require("cordova-sites/dist/client");
const ViewHelper_1 = require("js-helper/dist/client/ViewHelper");
const UserMenuAction_1 = require("../MenuAction/UserMenuAction");
const LoginSite_1 = require("./LoginSite");
const SelectUserDialog_1 = require("../Dialog/SelectUserDialog");
const view = require("./../../html/sites/changeUserSite.html");
class ChangeUserSite extends MenuSite_1.MenuSite {
    constructor(siteManager) {
        super(siteManager, view);
        this.addDelegate(new UserSite_1.UserSite(this, ChangeUserSite.ACCESS));
    }
    onConstruct(constructParameters) {
        const _super = Object.create(null, {
            onConstruct: { get: () => super.onConstruct }
        });
        return __awaiter(this, void 0, void 0, function* () {
            let res = _super.onConstruct.call(this, constructParameters);
            let data;
            if (Helper_1.Helper.isSet(constructParameters, "id")) {
                data = yield DataManager_1.DataManager.load(ChangeUserSite.LOAD_USER_INFOS_URL + DataManager_1.DataManager.buildQuery({ id: constructParameters["id"] }));
            }
            if (!data || data.success !== true) {
                new client_1.Toast(data.message).show();
                this.finish();
            }
            this._roles = data.roles;
            this._userData = data.userData;
            return res;
        });
    }
    onViewLoaded() {
        const _super = Object.create(null, {
            onViewLoaded: { get: () => super.onViewLoaded }
        });
        return __awaiter(this, void 0, void 0, function* () {
            let res = _super.onViewLoaded.call(this);
            this.findBy("#username").innerText = this._userData.username;
            this._hasRoleContainer = this.findBy("#has-role-container");
            this._availableRoleContainer = this.findBy("#available-role-container");
            this._hasRoleTemplate = this.findBy("#has-role-template");
            this._availableRoleTemplate = this.findBy("#available-role-template");
            this._hasRoleTemplate.removeAttribute("id");
            this._availableRoleTemplate.removeAttribute("id");
            this._hasRoleTemplate.remove();
            this._availableRoleTemplate.remove();
            this.updateRoles();
            return res;
        });
    }
    updateRoles() {
        let userRoles = [];
        let availableRoles = [];
        this._roles.forEach(role => {
            if (this._userData.roleIds.indexOf(role.id) !== -1) {
                userRoles.push(role);
            }
            else {
                availableRoles.push(role);
            }
        });
        ViewHelper_1.ViewHelper.removeAllChildren(this._hasRoleContainer);
        userRoles.forEach((role, i) => {
            let elem = this._hasRoleTemplate.cloneNode(true);
            elem.querySelector(".role-name").innerText = role.name;
            elem.querySelector(".remove-role").addEventListener("click", () => __awaiter(this, void 0, void 0, function* () {
                this.showLoadingSymbol();
                let res = yield DataManager_1.DataManager.send(ChangeUserSite.CHANGE_USER_ROLE_URL, {
                    id: this._userData.id,
                    roleId: role.id,
                    addRole: false
                });
                if (res.success) {
                    this._userData.roleIds.splice(this._userData.roleIds.indexOf(role.id), 1);
                    this.updateRoles();
                }
                this.removeLoadingSymbol();
            }));
            this._hasRoleContainer.appendChild(elem);
        });
        ViewHelper_1.ViewHelper.removeAllChildren(this._availableRoleContainer);
        availableRoles.forEach(role => {
            let elem = this._availableRoleTemplate.cloneNode(true);
            elem.querySelector(".role-name").innerText = role.name;
            elem.querySelector(".add-role").addEventListener("click", () => __awaiter(this, void 0, void 0, function* () {
                this.showLoadingSymbol();
                let res = yield DataManager_1.DataManager.send(ChangeUserSite.CHANGE_USER_ROLE_URL, {
                    id: this._userData.id,
                    roleId: role.id,
                    addRole: true
                });
                if (res.success) {
                    this._userData.roleIds.push(role.id);
                    this.updateRoles();
                }
                this.removeLoadingSymbol();
            }));
            this._availableRoleContainer.appendChild(elem);
        });
    }
}
exports.ChangeUserSite = ChangeUserSite;
ChangeUserSite.ACCESS = "admin";
ChangeUserSite.LOAD_USER_INFOS_URL = "/user/userRoles";
ChangeUserSite.CHANGE_USER_ROLE_URL = "/user/changeUserRole";
ChangeUserSite.ADD_CHANGE_USER_ACTION = true;
client_1.App.addInitialization(app => {
    if (ChangeUserSite.ADD_CHANGE_USER_ACTION) {
        client_1.NavbarFragment.defaultActions.push(new UserMenuAction_1.UserMenuAction("change user", ChangeUserSite.ACCESS, () => __awaiter(void 0, void 0, void 0, function* () {
            let user = yield new SelectUserDialog_1.SelectUserDialog().show();
            yield app.startSite(ChangeUserSite, { "id": user["id"] });
        })));
    }
    app.addDeepLink("login", LoginSite_1.LoginSite);
});
//# sourceMappingURL=ChangeUserSite.js.map
import {MenuSite} from "cordova-sites/dist/client/js/Context/MenuSite";
import {UserSite} from "../Context/UserSite";
import {Helper} from "js-helper/dist/shared/Helper";
import {DataManager} from "cordova-sites/dist/client/js/DataManager";
import {Toast} from "cordova-sites/dist/client";
import {ViewHelper} from "js-helper/dist/client/ViewHelper";

const view = require( "./../../html/sites/changeUserSite.html");

export class ChangeUserSite extends MenuSite{

    static ACCESS: string = "admin";
    static LOAD_USER_INFOS_URL = "/user/userRoles";
    static CHANGE_USER_ROLE_URL = "/user/changeUserRole";
    private _hasRoleContainer: any;
    private _availableRoleContainer: any;
    private _hasRoleTemplate: any;
    private _availableRoleTemplate: any;
    private _roles: Object[] | any[];
    private _userData: any;

    constructor(siteManager) {
        super(siteManager, view);
        this.addDelegate(new UserSite(this, ChangeUserSite.ACCESS));
    }

    async onConstruct(constructParameters: any): Promise<any[]> {
        let res = super.onConstruct(constructParameters);

        let data;
        if (Helper.isSet(constructParameters, "id"))
        {
            data = await DataManager.load(ChangeUserSite.LOAD_USER_INFOS_URL+DataManager.buildQuery({id: constructParameters["id"]}));
        }
        if (!data || data.success !== true){
            new Toast(data.message).show();
            this.finish();
        }

        this._roles = data.roles;
        this._userData = data.userData;

        return res;
    }

    async onViewLoaded(): Promise<any[]> {
        let res = super.onViewLoaded();

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
    }

    updateRoles(){
        let userRoles = [];
        let availableRoles = [];

        this._roles.forEach(role => {
            if (this._userData.roleIds.indexOf(role.id) !== -1){
                userRoles.push(role);
            }
            else {
                availableRoles.push(role);
            }
        });

        ViewHelper.removeAllChildren(this._hasRoleContainer);
        userRoles.forEach((role, i) => {
            let elem = this._hasRoleTemplate.cloneNode(true);
            elem.querySelector(".role-name").innerText = role.name;
            elem.querySelector(".remove-role").addEventListener("click", async () => {
                this.showLoadingSymbol();
                let res = await DataManager.send(ChangeUserSite.CHANGE_USER_ROLE_URL, {id: this._userData.id, roleId: role.id, addRole: false});
                this._userData.roleIds.splice(this._userData.roleIds.indexOf(role.id), 1);
                this.updateRoles();
                console.log(res);
                this.removeLoadingSymbol();
            });

            this._hasRoleContainer.appendChild(elem);
        });

        ViewHelper.removeAllChildren(this._availableRoleContainer);
        availableRoles.forEach(role => {
            let elem = this._availableRoleTemplate.cloneNode(true);
            elem.querySelector(".role-name").innerText = role.name;
            elem.querySelector(".add-role").addEventListener("click", async () => {
                this.showLoadingSymbol();
                let res = await DataManager.send(ChangeUserSite.CHANGE_USER_ROLE_URL, {id: this._userData.id, roleId: role.id, addRole: true});
                this._userData.roleIds.push(role.id);
                this.updateRoles();
                console.log(res);
                this.removeLoadingSymbol();
            });

            this._availableRoleContainer.appendChild(elem);
        })
    }
}
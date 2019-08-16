import {Helper} from "js-helper/dist/shared"
import {DelegateSite, Toast} from "cordova-sites";
import {UserManager} from "../UserManager";
import {LoginSite} from "../Site/LoginSite";

export class UserSite extends DelegateSite {

    constructor(site, access, allowOfflineAccess) {
        super(site);
        this._access = access;
        this._allowOfflineAccess = Helper.nonNull(allowOfflineAccess, false);
    }

    async onConstruct(constructParameters) {
        if (await this._checkRights()) {
            await super.onConstruct(constructParameters);
        }
    }

    async _checkRights() {
        if (!(UserManager.getInstance().hasAccess(this._access) || (this._allowOfflineAccess && await UserManager.getInstance().hasOfflineAccess(this._access)))) {
            await new Toast("wrong rights").show();
            if (UserManager.getInstance().isOnline() && !UserManager.getInstance().isLoggedIn() && !(this._site instanceof LoginSite)){
                this.startSite(LoginSite, {deepLink: this._site._siteManager.getDeepLinkFor(this._site), args: this._site.getParameters()});
            }
            await this.finish();
            return false;
        }
        return true;
    }

    async onStart(...args) {
        if (await this._checkRights()) {
            await super.onStart(...args);
        }
    }
}
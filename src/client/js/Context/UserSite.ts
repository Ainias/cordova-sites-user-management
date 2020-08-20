import {Helper} from "js-helper/dist/shared"
import {DelegateSite, Toast} from "cordova-sites/dist/client";
import {UserManager} from "../UserManager";
import {LoginSite} from "../Site/LoginSite";
import {NotAllowedSite} from "../Site/NotAllowedSite";

export class UserSite extends DelegateSite {
    private _access: any;
    private _allowOfflineAccess: boolean;

    constructor(site, access, allowOfflineAccess?) {
        super(site);
        this._access = access;
        this._allowOfflineAccess = Helper.nonNull(allowOfflineAccess, false);
    }

    async onConstruct(constructParameters) {
        await UserManager.getInstance().waitForGetMe();
        if (await this._checkRights()) {
            let res = await super.onConstruct(constructParameters);
            UserManager.getInstance().addLoginChangeCallback(async () => {
                await this._checkRights();
            }, false);
            return res;
        }
    }

    async _checkRights() {
        if (!(UserManager.getInstance().hasAccess(this._access) || (this._allowOfflineAccess && await UserManager.getInstance().hasOfflineAccess(this._access)))) {
            // if (this.isShowing() && !this.isDestroying()) {
            //     await this.startSite(NotAllowedSite);
            // }
            if (UserManager.getInstance().isOnline() && !UserManager.getInstance().isLoggedIn() && !(this._site instanceof LoginSite)) {
                this.startSite(LoginSite, {
                    deepLink: this._site._siteManager.getDeepLinkFor(this._site),
                    args: this._site.getParameters()
                });
            } else if (this._site._siteManager.getCurrentSite() === this._site && !this.isDestroying()) {
                new Toast("wrong rights").show();
                await this.startSite(NotAllowedSite);
            }
            if (!this.isDestroying()) {
                await this.finish();
            }
            return false;
        }
        return true;
    }

    async onStart(args) {
        if (await this._checkRights()) {
            await super.onStart(args);
        }
    }
}
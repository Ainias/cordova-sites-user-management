import {DelegateSite, Toast} from "cordova-sites";
import {UserManager} from "../UserManager";

export class UserSite extends DelegateSite {

    constructor(site, access) {
        super(site);
        this._access = access;
    }

    // async onConstruct(constructParameters) {
    //     if (UserManager.getInstance().hasAccess(this._access)) {
    //         await super.onConstruct(constructParameters);
    //     } else {
    //         await new Toast("wrong rights").show();
    //         await this.finish();
    //     }
    // }


    async onViewLoaded() {
        if (UserManager.getInstance().hasAccess(this._access)) {
            await super.onViewLoaded();
        } else {
            await new Toast("wrong rights").show();
            this.finish();
        }
    }
}
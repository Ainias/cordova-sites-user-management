import {UserSite} from "../Context/UserSite";
import {App, Form, MenuSite, NavbarFragment} from "cordova-sites";

import view from "./../../html/sites/loginSite.html"
import {StartUserSiteMenuAction} from "../MenuAction/StartUserSiteMenuAction";
import {UserManager} from "../UserManager";
import {UserMenuAction} from "../MenuAction/UserMenuAction";

export class LoginSite extends MenuSite {
    constructor(siteManager) {
        super(siteManager, view);
        this.addDelegate(new UserSite(this, LoginSite.ACCESS));
    }

    async onViewLoaded() {
        let res = super.onViewLoaded();
        let form = new Form(this.findBy("#login-form"), async data => {
            // await this.showLoadingSymbol();
            if (await UserManager.getInstance().login(data["email"], data["password"])){
                this.finish();
            }
            else {
            // await this.removeLoadingSymbol();
            }
        });
        return res;
    }
}
LoginSite.ACCESS = "loggedOut";
LoginSite.LOGOUT_ACCESS = "loggedIn";
LoginSite.ADD_LOGIN_ACTION = true;
LoginSite.ADD_LOGOUT_ACTION = true;

App.addInitialization(() => {
    if (LoginSite.ADD_LOGIN_ACTION){
        NavbarFragment.defaultActions.push(new StartUserSiteMenuAction("login", LoginSite.ACCESS, LoginSite));
    }
    if (LoginSite.ADD_LOGOUT_ACTION){
        NavbarFragment.defaultActions.push(new UserMenuAction("logout", LoginSite.LOGOUT_ACCESS , async () => {
            await UserManager.getInstance().logout();
        }));
    }
});
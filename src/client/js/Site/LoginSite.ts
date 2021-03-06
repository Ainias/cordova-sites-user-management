import {UserSite} from "../Context/UserSite";
import {App, Form, Helper, MenuSite, NavbarFragment, Toast} from "cordova-sites/dist/client";

const defaultView = require("./../../html/sites/loginSite.html");
import {StartUserSiteMenuAction} from "../MenuAction/StartUserSiteMenuAction";
import {UserManager} from "../UserManager";
import {UserMenuAction} from "../MenuAction/UserMenuAction";
import {ForgotPasswordSite} from "./ForgotPasswordSite";

export class LoginSite extends MenuSite {

    static ACCESS: string;
    static LOGOUT_ACCESS: string;
    static ADD_LOGIN_ACTION: boolean;
    static ADD_LOGOUT_ACTION: boolean;
    static ADD_DEEP_LINK: boolean;

    protected forgotPasswordSiteClass = ForgotPasswordSite;

    constructor(siteManager, view?) {
        super(siteManager, Helper.nonNull(view, defaultView));
        this.addDelegate(new UserSite(this, LoginSite.ACCESS));
    }

    async onViewLoaded() {
        let res = super.onViewLoaded();
        let form = new Form(this.findBy("#login-form"), async data => {
            // await this.showLoadingSymbol();
            if (await UserManager.getInstance().login(data["email"], data["password"], Helper.isNotNull(data["saveLogin"]))) {
                new Toast("welcome back").show();
                await this.finish();
            } else {
                //super-nervig

                // form.setErrors({
                //     "email": "email or password is wrong"
                // });
                // await this.removeLoadingSymbol();
            }
        });

        let listener = () => form.clearErrors();
        this.findBy("#login-form [name=email]")?.addEventListener("keydown", listener);
        this.findBy("#login-form [name=password]")?.addEventListener("keydown", listener);

        this.findBy("#forgot-pw")?.addEventListener("click", async () => this.startSite(this.forgotPasswordSiteClass));

        return res;
    }
}

LoginSite.ACCESS = "loggedOut";
LoginSite.LOGOUT_ACCESS = "loggedIn";
LoginSite.ADD_LOGIN_ACTION = true;
LoginSite.ADD_LOGOUT_ACTION = true;
LoginSite.ADD_DEEP_LINK = true;

App.addInitialization(app => {
    if (LoginSite.ADD_LOGIN_ACTION) {
        NavbarFragment.defaultActions.push(new StartUserSiteMenuAction("login", LoginSite.ACCESS, LoginSite));
    }
    if (LoginSite.ADD_LOGOUT_ACTION) {
        NavbarFragment.defaultActions.push(new UserMenuAction("logout", LoginSite.LOGOUT_ACCESS, async () => {
            await UserManager.getInstance().logout();
        }));
    }
    if (LoginSite.ADD_DEEP_LINK) {
        app.addDeepLink("login", LoginSite);
    }
});

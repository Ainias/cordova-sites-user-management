import {App, Form, MenuSite, NavbarFragment, Toast} from "cordova-sites/dist/cordova-sites";

const view = require("./../../html/sites/registrationSite.html");
import {UserSite} from "../Context/UserSite";
import {StartUserSiteMenuAction} from "../MenuAction/StartUserSiteMenuAction";
import {UserManager} from "../UserManager";
import {User} from "../../../shared/v1/model/User";


export class RegistrationSite extends MenuSite{
    static ACCESS: string;
    static ADD_REGISTRATION_ACTION: boolean;

    constructor(siteManager) {
        super(siteManager, view);
        this.addDelegate(new UserSite(this, RegistrationSite.ACCESS));
    }

    async onViewLoaded() {
        let res = super.onViewLoaded();
        let form = new Form(this.findBy("#registration-form"), async data => {
            let result = await UserManager.getInstance().register(data["email"], data["username"], data["password"]);
            if ((result instanceof User) || result === true){
                await new Toast("registration successful").show();
                await this.finish();
            }
            else {
                await form.setErrors(result);
            }
        });

        form.addValidator(data => {
            if (data["password"] !== data["password2"]){
                return {
                    "password2":"the passwords do not match."
                }
            }
            return true;
        });

        // let listener = () => form.clearErrors();
        // this.findBy("#login-form [name=email]").addEventListener("keydown", listener);
        // this.findBy("#login-form [name=password]").addEventListener("keydown", listener);

        return res;
    }
}

RegistrationSite.ACCESS = "loggedOut";
RegistrationSite.ADD_REGISTRATION_ACTION = true;

App.addInitialization(app => {
    if (RegistrationSite.ADD_REGISTRATION_ACTION){
        NavbarFragment.defaultActions.push(new StartUserSiteMenuAction("registration", RegistrationSite.ACCESS, RegistrationSite));
    }
    app.addDeepLink("registration", RegistrationSite);
});
import {UserSite} from "../Context/UserSite";
import {App, Form, Helper, MenuSite, Toast} from "cordova-sites";

import view from "./../../html/sites/forgotPasswordSite.html"
import {UserManager} from "../UserManager";
import {LoginSite} from "./LoginSite";

export class ForgotPasswordSite extends MenuSite {
    constructor(siteManager) {
        super(siteManager, view);
        this.addDelegate(new UserSite(this, LoginSite.ACCESS));
    }

    async onConstruct(constructParameters) {
        let res = super.onConstruct(constructParameters);
        if (Helper.isSet(constructParameters["t"])){
            this._token = constructParameters["t"];
        }
        return res;
    }

    async onViewLoaded() {
        let res = super.onViewLoaded();
        let form = new Form(this.findBy("#forgot-password-form"), async data => {
            if (await UserManager.getInstance().sendForgotPasswordEmail(data["email"])){
                await new Toast("forgot-password-mail sent").show();
                await this.finish();
            }
            else {
                form.setErrors({
                    "email":"email is not in our database"
                });
            }
        });

        let resetForm = new Form(this.findBy("#reset-password-form"), async data => {
            if (UserManager.getInstance().resetPassword(this._token, data["password1"])){
                await new Toast("password resetted").show();
                await this.finish();
            }
            else {
                await new Toast("token is not valid!").show();
            }
        });

        resetForm.addValidator(data => {
            let errors = {};
            let hasErrors = false;
            if (data["password1"].trim() === ""){
                hasErrors = true;
                errors["password1"] = "no password set";
            }
            if (data["password1"] !== data["password2"]){
                hasErrors = true;
                errors["password2"] = "not equal to password1";
            }

            if (hasErrors){
                return errors;
            }
            else {
                return true;
            }
        });

        if (this._token){
            this.findBy("#reset-password").classList.remove("hidden");
            this.findBy("#forgot-password").classList.add("hidden");
        }

        return res;
    }
}
App.addInitialization(app => {
    app.addDeepLink("forgotPW", ForgotPasswordSite);
});
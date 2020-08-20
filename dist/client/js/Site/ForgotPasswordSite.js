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
exports.ForgotPasswordSite = void 0;
const UserSite_1 = require("../Context/UserSite");
const client_1 = require("cordova-sites/dist/client");
const view = require("./../../html/sites/forgotPasswordSite.html");
const UserManager_1 = require("../UserManager");
const LoginSite_1 = require("./LoginSite");
class ForgotPasswordSite extends client_1.MenuSite {
    constructor(siteManager) {
        super(siteManager, view);
        this.addDelegate(new UserSite_1.UserSite(this, LoginSite_1.LoginSite.ACCESS));
    }
    onConstruct(constructParameters) {
        const _super = Object.create(null, {
            onConstruct: { get: () => super.onConstruct }
        });
        return __awaiter(this, void 0, void 0, function* () {
            let res = _super.onConstruct.call(this, constructParameters);
            if (client_1.Helper.isSet(constructParameters["t"])) {
                this._token = constructParameters["t"];
            }
            return res;
        });
    }
    onViewLoaded() {
        const _super = Object.create(null, {
            onViewLoaded: { get: () => super.onViewLoaded }
        });
        return __awaiter(this, void 0, void 0, function* () {
            let res = _super.onViewLoaded.call(this);
            let form = new client_1.Form(this.findBy("#forgot-password-form"), (data) => __awaiter(this, void 0, void 0, function* () {
                if (yield UserManager_1.UserManager.getInstance().sendForgotPasswordEmail(data["email"])) {
                    new client_1.Toast("forgot-password-mail sent").show();
                    yield this.finish();
                }
                else {
                    form.setErrors({
                        "email": "email is not in our database"
                    });
                }
            }));
            let resetForm = new client_1.Form(this.findBy("#reset-password-form"), (data) => __awaiter(this, void 0, void 0, function* () {
                if (yield UserManager_1.UserManager.getInstance().resetPassword(this._token, data["password1"])) {
                    new client_1.Toast("password resetted").show();
                    yield this.finish();
                }
                else {
                    yield new client_1.Toast("token is not valid!").show();
                }
            }));
            resetForm.addValidator(data => {
                let errors = {};
                let hasErrors = false;
                if (data["password1"].trim() === "") {
                    hasErrors = true;
                    errors["password1"] = "no password set";
                }
                if (data["password1"] !== data["password2"]) {
                    hasErrors = true;
                    errors["password2"] = "not equal to password1";
                }
                if (hasErrors) {
                    return errors;
                }
                else {
                    return true;
                }
            });
            if (this._token) {
                this.findBy("#reset-password").classList.remove("hidden");
                this.findBy("#forgot-password").classList.add("hidden");
            }
            return res;
        });
    }
}
exports.ForgotPasswordSite = ForgotPasswordSite;
client_1.App.addInitialization(app => {
    app.addDeepLink("forgotPW", ForgotPasswordSite);
});
//# sourceMappingURL=ForgotPasswordSite.js.map
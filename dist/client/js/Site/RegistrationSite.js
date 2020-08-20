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
exports.RegistrationSite = void 0;
const client_1 = require("cordova-sites/dist/client");
const view = require("./../../html/sites/registrationSite.html");
const UserSite_1 = require("../Context/UserSite");
const StartUserSiteMenuAction_1 = require("../MenuAction/StartUserSiteMenuAction");
const UserManager_1 = require("../UserManager");
const User_1 = require("../../../shared/v1/model/User");
class RegistrationSite extends client_1.MenuSite {
    constructor(siteManager) {
        super(siteManager, view);
        this.addDelegate(new UserSite_1.UserSite(this, RegistrationSite.ACCESS));
    }
    onViewLoaded() {
        const _super = Object.create(null, {
            onViewLoaded: { get: () => super.onViewLoaded }
        });
        return __awaiter(this, void 0, void 0, function* () {
            let res = _super.onViewLoaded.call(this);
            let form = new client_1.Form(this.findBy("#registration-form"), (data) => __awaiter(this, void 0, void 0, function* () {
                let result = yield UserManager_1.UserManager.getInstance().register(data["email"], data["username"], data["password"]);
                if ((result instanceof User_1.User) || result === true) {
                    yield new client_1.Toast("registration successful").show();
                    yield this.finish();
                }
                else {
                    yield form.setErrors(result);
                }
            }));
            form.addValidator(data => {
                if (data["password"] !== data["password2"]) {
                    return {
                        "password2": "the passwords do not match."
                    };
                }
                return true;
            });
            // let listener = () => form.clearErrors();
            // this.findBy("#login-form [name=email]").addEventListener("keydown", listener);
            // this.findBy("#login-form [name=password]").addEventListener("keydown", listener);
            return res;
        });
    }
}
exports.RegistrationSite = RegistrationSite;
RegistrationSite.ACCESS = "loggedOut";
RegistrationSite.ADD_REGISTRATION_ACTION = true;
client_1.App.addInitialization(app => {
    if (RegistrationSite.ADD_REGISTRATION_ACTION) {
        client_1.NavbarFragment.defaultActions.push(new StartUserSiteMenuAction_1.StartUserSiteMenuAction("registration", RegistrationSite.ACCESS, RegistrationSite));
    }
    app.addDeepLink("registration", RegistrationSite);
});
//# sourceMappingURL=RegistrationSite.js.map
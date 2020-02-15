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
const UserSite_1 = require("../Context/UserSite");
const client_1 = require("cordova-sites/dist/client");
const view = require("./../../html/sites/loginSite.html");
const StartUserSiteMenuAction_1 = require("../MenuAction/StartUserSiteMenuAction");
const UserManager_1 = require("../UserManager");
const UserMenuAction_1 = require("../MenuAction/UserMenuAction");
const ForgotPasswordSite_1 = require("./ForgotPasswordSite");
class LoginSite extends client_1.MenuSite {
    constructor(siteManager) {
        super(siteManager, view);
        this.addDelegate(new UserSite_1.UserSite(this, LoginSite.ACCESS));
    }
    onViewLoaded() {
        const _super = Object.create(null, {
            onViewLoaded: { get: () => super.onViewLoaded }
        });
        return __awaiter(this, void 0, void 0, function* () {
            console.log("userSite");
            let res = _super.onViewLoaded.call(this);
            let form = new client_1.Form(this.findBy("#login-form"), (data) => __awaiter(this, void 0, void 0, function* () {
                // await this.showLoadingSymbol();
                if (yield UserManager_1.UserManager.getInstance().login(data["email"], data["password"], client_1.Helper.isNotNull(data["saveLogin"]))) {
                    new client_1.Toast("welcome back").show();
                    yield this.finish();
                }
                else {
                    form.setErrors({
                        "email": "email or password is wrong"
                    });
                    // await this.removeLoadingSymbol();
                }
            }));
            let listener = () => form.clearErrors();
            this.findBy("#login-form [name=email]").addEventListener("keydown", listener);
            this.findBy("#login-form [name=password]").addEventListener("keydown", listener);
            this.findBy("#forgot-pw").addEventListener("click", () => __awaiter(this, void 0, void 0, function* () {
                this.startSite(ForgotPasswordSite_1.ForgotPasswordSite);
            }));
            return res;
        });
    }
}
exports.LoginSite = LoginSite;
LoginSite.ACCESS = "loggedOut";
LoginSite.LOGOUT_ACCESS = "loggedIn";
LoginSite.ADD_LOGIN_ACTION = true;
LoginSite.ADD_LOGOUT_ACTION = true;
client_1.App.addInitialization(app => {
    if (LoginSite.ADD_LOGIN_ACTION) {
        client_1.NavbarFragment.defaultActions.push(new StartUserSiteMenuAction_1.StartUserSiteMenuAction("login", LoginSite.ACCESS, LoginSite));
    }
    if (LoginSite.ADD_LOGOUT_ACTION) {
        client_1.NavbarFragment.defaultActions.push(new UserMenuAction_1.UserMenuAction("logout", LoginSite.LOGOUT_ACCESS, () => __awaiter(void 0, void 0, void 0, function* () {
            yield UserManager_1.UserManager.getInstance().logout();
        })));
    }
    app.addDeepLink("login", LoginSite);
});
//# sourceMappingURL=LoginSite.js.map
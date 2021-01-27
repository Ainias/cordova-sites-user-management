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
exports.LoginSite = void 0;
const UserSite_1 = require("../Context/UserSite");
const client_1 = require("cordova-sites/dist/client");
const defaultView = require("./../../html/sites/loginSite.html");
const StartUserSiteMenuAction_1 = require("../MenuAction/StartUserSiteMenuAction");
const UserManager_1 = require("../UserManager");
const UserMenuAction_1 = require("../MenuAction/UserMenuAction");
const ForgotPasswordSite_1 = require("./ForgotPasswordSite");
class LoginSite extends client_1.MenuSite {
    constructor(siteManager, view) {
        super(siteManager, client_1.Helper.nonNull(view, defaultView));
        this.forgotPasswordSiteClass = ForgotPasswordSite_1.ForgotPasswordSite;
        this.addDelegate(new UserSite_1.UserSite(this, LoginSite.ACCESS));
    }
    onViewLoaded() {
        const _super = Object.create(null, {
            onViewLoaded: { get: () => super.onViewLoaded }
        });
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            let res = _super.onViewLoaded.call(this);
            let form = new client_1.Form(this.findBy("#login-form"), (data) => __awaiter(this, void 0, void 0, function* () {
                // await this.showLoadingSymbol();
                if (yield UserManager_1.UserManager.getInstance().login(data["email"], data["password"], client_1.Helper.isNotNull(data["saveLogin"]))) {
                    new client_1.Toast("welcome back").show();
                    yield this.finish();
                }
                else {
                    //super-nervig
                    // form.setErrors({
                    //     "email": "email or password is wrong"
                    // });
                    // await this.removeLoadingSymbol();
                }
            }));
            let listener = () => form.clearErrors();
            (_a = this.findBy("#login-form [name=email]")) === null || _a === void 0 ? void 0 : _a.addEventListener("keydown", listener);
            (_b = this.findBy("#login-form [name=password]")) === null || _b === void 0 ? void 0 : _b.addEventListener("keydown", listener);
            (_c = this.findBy("#forgot-pw")) === null || _c === void 0 ? void 0 : _c.addEventListener("click", () => __awaiter(this, void 0, void 0, function* () { return this.startSite(this.forgotPasswordSiteClass); }));
            return res;
        });
    }
}
exports.LoginSite = LoginSite;
LoginSite.ACCESS = "loggedOut";
LoginSite.LOGOUT_ACCESS = "loggedIn";
LoginSite.ADD_LOGIN_ACTION = true;
LoginSite.ADD_LOGOUT_ACTION = true;
LoginSite.ADD_DEEP_LINK = true;
client_1.App.addInitialization(app => {
    if (LoginSite.ADD_LOGIN_ACTION) {
        client_1.NavbarFragment.defaultActions.push(new StartUserSiteMenuAction_1.StartUserSiteMenuAction("login", LoginSite.ACCESS, LoginSite));
    }
    if (LoginSite.ADD_LOGOUT_ACTION) {
        client_1.NavbarFragment.defaultActions.push(new UserMenuAction_1.UserMenuAction("logout", LoginSite.LOGOUT_ACCESS, () => __awaiter(void 0, void 0, void 0, function* () {
            yield UserManager_1.UserManager.getInstance().logout();
        })));
    }
    if (LoginSite.ADD_DEEP_LINK) {
        app.addDeepLink("login", LoginSite);
    }
});
//# sourceMappingURL=LoginSite.js.map
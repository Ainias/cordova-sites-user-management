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
exports.UserSite = void 0;
const shared_1 = require("js-helper/dist/shared");
const client_1 = require("cordova-sites/dist/client");
const UserManager_1 = require("../UserManager");
const LoginSite_1 = require("../Site/LoginSite");
const NotAllowedSite_1 = require("../Site/NotAllowedSite");
class UserSite extends client_1.DelegateSite {
    constructor(site, access, allowOfflineAccess) {
        super(site);
        this._access = access;
        this._allowOfflineAccess = shared_1.Helper.nonNull(allowOfflineAccess, false);
    }
    onConstruct(constructParameters) {
        const _super = Object.create(null, {
            onConstruct: { get: () => super.onConstruct }
        });
        return __awaiter(this, void 0, void 0, function* () {
            yield UserManager_1.UserManager.getInstance().waitForGetMe();
            if (yield this._checkRights()) {
                let res = yield _super.onConstruct.call(this, constructParameters);
                UserManager_1.UserManager.getInstance().addLoginChangeCallback(() => __awaiter(this, void 0, void 0, function* () {
                    yield this._checkRights();
                }), false);
                return res;
            }
        });
    }
    _checkRights() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(UserManager_1.UserManager.getInstance().hasAccess(this._access) || (this._allowOfflineAccess && (yield UserManager_1.UserManager.getInstance().hasOfflineAccess(this._access))))) {
                if (UserManager_1.UserManager.getInstance().isOnline() && !UserManager_1.UserManager.getInstance().isLoggedIn() && !(this._site instanceof LoginSite_1.LoginSite)) {
                    this.startSite(LoginSite_1.LoginSite, {
                        deepLink: this._site._siteManager.getDeepLinkFor(this._site),
                        args: this._site.getParameters()
                    });
                }
                else if (this._site._siteManager.getCurrentSite() === this._site && !this.isDestroying()) {
                    new client_1.Toast("wrong rights").show();
                    yield this.startSite(NotAllowedSite_1.NotAllowedSite);
                }
                if (!this.isDestroying()) {
                    yield this.finish();
                }
                return false;
            }
            return true;
        });
    }
    onStart(args) {
        const _super = Object.create(null, {
            onStart: { get: () => super.onStart }
        });
        return __awaiter(this, void 0, void 0, function* () {
            if (yield this._checkRights()) {
                yield _super.onStart.call(this, args);
            }
        });
    }
}
exports.UserSite = UserSite;
//# sourceMappingURL=UserSite.js.map
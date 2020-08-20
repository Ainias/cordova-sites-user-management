"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserMenuAction = void 0;
const client_1 = require("cordova-sites/dist/client");
const UserManager_1 = require("../UserManager");
const Helper_1 = require("js-helper/dist/shared/Helper");
class UserMenuAction extends client_1.MenuAction {
    constructor(name, access, action, showFor, order, icon) {
        super(name, action, showFor, order, icon);
        this._access = access;
        this._loginChangedCallbackId = UserManager_1.UserManager.getInstance().addLoginChangeCallback(() => {
            this.redraw();
        });
    }
    isVisible() {
        return (super.isVisible() && UserManager_1.UserManager.getInstance().hasAccess(this._access));
    }
    isActivated() {
        return (super.isActivated() && UserManager_1.UserManager.getInstance().hasAccess(this._access));
    }
    copy(action) {
        let copiedAction = Helper_1.Helper.nonNull(action, new UserMenuAction());
        copiedAction._access = this._access;
        return super.copy(copiedAction);
    }
}
exports.UserMenuAction = UserMenuAction;
//# sourceMappingURL=UserMenuAction.js.map
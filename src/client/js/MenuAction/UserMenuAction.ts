import {MenuAction} from "cordova-sites/dist/client";
import {UserManager} from "../UserManager";
import {Helper} from "js-helper/dist/shared/Helper";

export class UserMenuAction extends MenuAction{
    private _access: any;
    private _loginChangedCallbackId: number;

    constructor(name?, access?, action?, showFor?, order?, icon?) {
        super(name, action, showFor, order, icon);
        this._access = access;
        this._loginChangedCallbackId = UserManager.getInstance().addLoginChangeCallback(() => {
            this.redraw();
        })
    }

    isVisible() {
        return (super.isVisible() && UserManager.getInstance().hasAccess(this._access));
    }

    isActivated() {
        return (super.isActivated() && UserManager.getInstance().hasAccess(this._access));
    }

    copy(action) {
        let copiedAction = Helper.nonNull(action, new UserMenuAction());
        copiedAction._access = this._access;
        return super.copy(copiedAction);
    }
}
import {Helper, MenuAction} from "cordova-sites";
import {UserManager} from "../UserManager";

export class UserMenuAction extends MenuAction{
    constructor(name, access, action, showFor, order, icon) {
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
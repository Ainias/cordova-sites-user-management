import { MenuAction } from "cordova-sites/dist/client";
export declare class UserMenuAction extends MenuAction {
    private _access;
    private _loginChangedCallbackId;
    constructor(name?: any, access?: any, action?: any, showFor?: any, order?: any, icon?: any);
    isVisible(): boolean;
    isActivated(): boolean;
    copy(action: any): any;
}

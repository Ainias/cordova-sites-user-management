import { Dialog } from "cordova-sites/dist/client/js/Dialog/Dialog";
export declare class SelectUserDialog extends Dialog {
    private _loadUserTimeout;
    private _usernameInput;
    private _userContainer;
    private _userTemplate;
    constructor();
    _loadUsers(username?: any): Promise<void>;
}

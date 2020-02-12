import { MenuSite } from "cordova-sites/dist/client";
export declare class LoginSite extends MenuSite {
    static ACCESS: string;
    static LOGOUT_ACCESS: string;
    static ADD_LOGIN_ACTION: boolean;
    static ADD_LOGOUT_ACTION: boolean;
    constructor(siteManager: any);
    onViewLoaded(): Promise<any[]>;
}

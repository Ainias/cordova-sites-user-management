import { MenuSite } from "cordova-sites/dist/client";
import { ForgotPasswordSite } from "./ForgotPasswordSite";
export declare class LoginSite extends MenuSite {
    static ACCESS: string;
    static LOGOUT_ACCESS: string;
    static ADD_LOGIN_ACTION: boolean;
    static ADD_LOGOUT_ACTION: boolean;
    static ADD_DEEP_LINK: boolean;
    protected forgotPasswordSiteClass: typeof ForgotPasswordSite;
    constructor(siteManager: any, view?: any);
    onViewLoaded(): Promise<any[]>;
}

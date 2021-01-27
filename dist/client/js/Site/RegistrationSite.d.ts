import { MenuSite } from "cordova-sites/dist/client";
export declare class RegistrationSite extends MenuSite {
    static ACCESS: string;
    static ADD_REGISTRATION_ACTION: boolean;
    static ADD_DEEP_LINK: boolean;
    constructor(siteManager: any, view?: any);
    onViewLoaded(): Promise<any[]>;
}

import { MenuSite } from "cordova-sites/dist/client";
export declare class RegistrationSite extends MenuSite {
    static ACCESS: string;
    static ADD_REGISTRATION_ACTION: boolean;
    constructor(siteManager: any);
    onViewLoaded(): Promise<any[]>;
}

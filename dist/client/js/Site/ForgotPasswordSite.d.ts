import { MenuSite } from "cordova-sites/dist/client";
export declare class ForgotPasswordSite extends MenuSite {
    private _token;
    constructor(siteManager: any);
    onConstruct(constructParameters: any): Promise<any[]>;
    onViewLoaded(): Promise<any[]>;
}

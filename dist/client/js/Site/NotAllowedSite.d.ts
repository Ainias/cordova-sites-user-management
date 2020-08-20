import { MenuSite } from "cordova-sites/dist/client/js/Context/MenuSite";
export declare class NotAllowedSite extends MenuSite {
    constructor(siteManager: any);
    onConstruct(constructParameters: any): Promise<any[]>;
    onCreateMenu(navbar: any): void;
    onPause(): Promise<void>;
}

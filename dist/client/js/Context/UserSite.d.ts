import { DelegateSite } from "cordova-sites/dist/client";
export declare class UserSite extends DelegateSite {
    private _access;
    private _allowOfflineAccess;
    constructor(site: any, access: any, allowOfflineAccess?: any);
    onConstruct(constructParameters: any): Promise<any[]>;
    _checkRights(): Promise<boolean>;
    onStart(args: any): Promise<void>;
}

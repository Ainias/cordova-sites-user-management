import { MenuSite } from "cordova-sites/dist/client/js/Context/MenuSite";
export declare class ChangeUserSite extends MenuSite {
    static ACCESS: string;
    static LOAD_USER_INFOS_URL: string;
    static CHANGE_USER_ROLE_URL: string;
    private _hasRoleContainer;
    private _availableRoleContainer;
    private _hasRoleTemplate;
    private _availableRoleTemplate;
    private _roles;
    private _userData;
    constructor(siteManager: any);
    onConstruct(constructParameters: any): Promise<any[]>;
    onViewLoaded(): Promise<any[]>;
    updateRoles(): void;
}

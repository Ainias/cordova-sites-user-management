import {UserMenuAction} from "./UserMenuAction";
import {StartSiteMenuAction} from "cordova-sites/dist/cordova-sites";

export class StartUserSiteMenuAction extends UserMenuAction{
    constructor(name?, access?, site?, showFor?, order?, icon?) {
        super(name, access, () => {
            if (StartSiteMenuAction._app) {
                if (Array.isArray(site) && site.length >= 2) {
                    StartSiteMenuAction._app.startSite(site[0], site[1]);
                } else {
                    StartSiteMenuAction._app.startSite(site);
                }
            }
        }, showFor, order, icon);
    }
}
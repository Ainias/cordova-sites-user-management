"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UserMenuAction_1 = require("./UserMenuAction");
const client_1 = require("cordova-sites/dist/client");
class StartUserSiteMenuAction extends UserMenuAction_1.UserMenuAction {
    constructor(name, access, site, showFor, order, icon) {
        super(name, access, () => {
            if (client_1.StartSiteMenuAction._app) {
                if (Array.isArray(site) && site.length >= 2) {
                    client_1.StartSiteMenuAction._app.startSite(site[0], site[1]);
                }
                else {
                    client_1.StartSiteMenuAction._app.startSite(site);
                }
            }
        }, showFor, order, icon);
    }
}
exports.StartUserSiteMenuAction = StartUserSiteMenuAction;
//# sourceMappingURL=StartUserSiteMenuAction.js.map
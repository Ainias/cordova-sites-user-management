import {MenuSite} from "cordova-sites/dist/client/js/Context/MenuSite";

const view = require( "./../../html/sites/notAllowedSite.html");

export class NotAllowedSite extends MenuSite{

    constructor(siteManager: any) {
        super(siteManager, view);
    }

    onConstruct(constructParameters: any): Promise<any[]> {
        return super.onConstruct(constructParameters);
    }

    onCreateMenu(navbar: any) {
        return super.onCreateMenu(navbar);
    }

    async onPause(): Promise<void> {
        let res = super.onPause();
        await this.finish();
        return res;

    }
}
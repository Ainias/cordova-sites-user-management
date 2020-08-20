"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotAllowedSite = void 0;
const MenuSite_1 = require("cordova-sites/dist/client/js/Context/MenuSite");
const view = require("./../../html/sites/notAllowedSite.html");
class NotAllowedSite extends MenuSite_1.MenuSite {
    constructor(siteManager) {
        super(siteManager, view);
    }
    onConstruct(constructParameters) {
        return super.onConstruct(constructParameters);
    }
    onCreateMenu(navbar) {
        return super.onCreateMenu(navbar);
    }
    onPause() {
        const _super = Object.create(null, {
            onPause: { get: () => super.onPause }
        });
        return __awaiter(this, void 0, void 0, function* () {
            let res = _super.onPause.call(this);
            yield this.finish();
            return res;
        });
    }
}
exports.NotAllowedSite = NotAllowedSite;
//# sourceMappingURL=NotAllowedSite.js.map
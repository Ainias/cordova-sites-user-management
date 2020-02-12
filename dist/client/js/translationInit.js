"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("cordova-sites/dist/client");
const shared_1 = require("cordova-sites/dist/shared");
const deTranslations = require("../translations/de");
const enTranslations = require("../translations/en");
client_1.App.addInitialization(() => {
    shared_1.Translator.addDynamicTranslations({
        "de": deTranslations,
        "en": enTranslations
    });
});
//# sourceMappingURL=translationInit.js.map
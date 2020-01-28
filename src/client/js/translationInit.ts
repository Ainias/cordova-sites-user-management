import {App} from "cordova-sites/dist/client";
import {Translator} from "cordova-sites/dist/shared"

const deTranslations = require("../translations/de");
const enTranslations = require( "../translations/en");

App.addInitialization(() => {
    Translator.addDynamicTranslations({
        "de": deTranslations,
        "en": enTranslations
    });
});

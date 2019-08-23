import {App} from "cordova-sites/dist/cordova-sites";
import {Translator} from "cordova-sites/shared"

const deTranslations = require("../translations/de");
const enTranslations = require( "../translations/en");

App.addInitialization(() => {
    Translator.addDynamicTranslations({
        "de": deTranslations,
        "en": enTranslations
    });
});

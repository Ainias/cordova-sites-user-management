import {Translator, App} from "cordova-sites";

import deTranslations from "../translations/de";
import enTranslations from "../translations/en";

App.addInitialization(() => {
    Translator.addDynamicTranslations({
        "de": deTranslations,
        "en": enTranslations
    });
});

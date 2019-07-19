import {Helper} from "js-helper/dist/shared";

export class ServerHelper extends Helper{
    // /**
    //  * Testet, ob eine Variable null oder Undefined ist
    //  *
    //  * @param variable
    //  * @returns {boolean}
    //  */
    // static isNull(variable) {
    //     return (variable === null || variable === undefined);
    // }
    //
    // /**
    //  * Testet, ob eine Variable nicht (null oder undefined) ist
    //  *
    //  * @param variable
    //  * @returns {boolean}
    //  */
    // static isNotNull(variable) {
    //     return !ServerHelper.isNull(variable);
    // }
    //
    // /**
    //  * Gibt den ersten übergebenen Wert, der nicht (null oder undefined) ist, zurück
    //  *
    //  * @param val1
    //  * @param val2
    //  * @param args
    //  * @returns {*}
    //  */
    // static nonNull(val1, val2, ...args) {
    //     for (let i = 0; i < arguments.length; i++) {
    //         if (ServerHelper.isNotNull(arguments[i])) {
    //             return arguments[i];
    //         }
    //     }
    //     return null;
    // }
    //
    // static async asyncForEach(array, callback, runAsyncronous) {
    //     runAsyncronous = ServerHelper.nonNull(runAsyncronous, false);
    //
    //     let validPromises = [];
    //     for (let i = 0; i < array.length; i++) {
    //         let index = i;
    //         let currentPromise = Promise.resolve(callback(array[index], index, array));
    //         if (!runAsyncronous) {
    //             await currentPromise;
    //         }
    //         validPromises.push(currentPromise);
    //     }
    //     return Promise.all(validPromises);
    // }
}
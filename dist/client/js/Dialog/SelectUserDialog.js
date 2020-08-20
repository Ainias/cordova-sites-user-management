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
exports.SelectUserDialog = void 0;
const Dialog_1 = require("cordova-sites/dist/client/js/Dialog/Dialog");
const ViewInflater_1 = require("cordova-sites/dist/client/js/ViewInflater");
const DataManager_1 = require("cordova-sites/dist/client/js/DataManager");
const ViewHelper_1 = require("js-helper/dist/client/ViewHelper");
const Helper_1 = require("js-helper/dist/shared/Helper");
const view = require("../../html/dialog/selectUserDialog.html");
class SelectUserDialog extends Dialog_1.Dialog {
    constructor() {
        super(ViewInflater_1.ViewInflater.getInstance().load(view).then((view) => __awaiter(this, void 0, void 0, function* () {
            this._loadUserTimeout = null;
            this._usernameInput =
                view.querySelector("#username-input");
            this._usernameInput.addEventListener("keydown", () => {
                clearTimeout(this._loadUserTimeout);
                this._loadUserTimeout = setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                    yield this._loadUsers(this._usernameInput.value);
                }), 500);
            });
            this._userContainer = view.querySelector("#user-container");
            this._userTemplate = view.querySelector("#user-template");
            this._userTemplate.remove();
            this._userTemplate.removeAttribute("id");
            this._loadUsers();
            return view;
        })), "select user");
    }
    _loadUsers(username) {
        return __awaiter(this, void 0, void 0, function* () {
            debugger;
            let res = yield DataManager_1.DataManager.load("user/listUsers" + DataManager_1.DataManager.buildQuery({ username: Helper_1.Helper.nonNull(username, "") }));
            if (res["success"]) {
                ViewHelper_1.ViewHelper.removeAllChildren(this._userContainer);
                let users = res["data"];
                users.forEach(user => {
                    let userElement = this._userTemplate.cloneNode(true);
                    userElement.querySelector(".name").innerText = user.username;
                    userElement.addEventListener("click", () => {
                        this._result = user;
                        this.close();
                    });
                    this._userContainer.appendChild(userElement);
                });
            }
        });
    }
}
exports.SelectUserDialog = SelectUserDialog;
//# sourceMappingURL=SelectUserDialog.js.map
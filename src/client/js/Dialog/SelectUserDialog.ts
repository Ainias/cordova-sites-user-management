import {Dialog} from "cordova-sites/dist/client/js/Dialog/Dialog";
import {ViewInflater} from "cordova-sites/dist/client/js/ViewInflater";
import {DataManager} from "cordova-sites/dist/client/js/DataManager";
import {ViewHelper} from "js-helper/dist/client/ViewHelper";
import {Helper} from "js-helper/dist/shared/Helper";

const view = require("../../html/dialog/selectUserDialog.html");

export class SelectUserDialog extends Dialog {
    private _loadUserTimeout: any;
    private _usernameInput: any;
    private _userContainer: any;
    private _userTemplate: any;

    constructor() {
        super(ViewInflater.getInstance().load(view).then(async view => {
            this._loadUserTimeout = null;

            this._usernameInput =
                view.querySelector("#username-input");

            this._usernameInput.addEventListener("keydown", () => {
                clearTimeout(this._loadUserTimeout);
                this._loadUserTimeout = setTimeout(async () => {
                    await this._loadUsers(this._usernameInput.value);
                }, 500);
            });

            this._userContainer = view.querySelector("#user-container");
            this._userTemplate = view.querySelector("#user-template");

            this._userTemplate.remove();
            this._userTemplate.removeAttribute("id");
            this._loadUsers();

            return view;
        }), "select user");
    }

    async _loadUsers(username?) {
        let res = await DataManager.load("/listUsers" + DataManager.buildQuery({username: Helper.nonNull(username, "")}));
        if (res["success"]) {
            ViewHelper.removeAllChildren(this._userContainer);
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

    }
}
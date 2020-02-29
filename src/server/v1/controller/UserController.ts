import {UserManager} from "../UserManager";
import {User} from "../../../shared/v1/model/User";
import {Role} from "../../../shared/v1/model/Role";
import {Helper} from "js-helper/dist/shared/Helper";
import {Like} from "typeorm";

export class UserController {
    static async login(req, res) {
        let userData = await UserManager.login(req.body.email, req.body.password);
        if (userData) {
            res.json({
                success: true,
                token: userData.token,
                user: userData.user
            });
        } else {
            res.status(403);
            res.json({
                success: false,
                message: "wrong email or password"
            });
        }
    }

    static async register(req, res) {
        try {
            let user = await UserManager.register(req.body.email, req.body.username, req.body.password);
            res.json({
                success: true,
                token: UserManager._generateToken(user),
                user: user
            });
        } catch (e) {
            console.error(e);
            res.status(400);
            res.json({
                success: false,
                message: e.message
            });
        }
    }

    static async getMe(req, res) {
        let user = req.user;
        if (user) {
            let accesses = await UserManager.loadCachedAccessesForUser(user);
            let accessNames = [];
            accesses.forEach(access => accessNames.push(access.name));

            let result = {
                "userData": {
                    "id": user.id,
                    "loggedIn": true,
                    "online": true,
                    "username": user.username,
                    "email": user.email,
                    "accesses": accessNames
                }
            };
            if (new Date((req.tokenData.iat + UserManager.RENEW_AFTER) * 1000).getTime() < new Date().getTime()) {
                result["token"] = UserManager._generateToken(user);
            }

            res.json(result);
        } else {
            res.json({
                "userData": {
                    "id": null,
                    "loggedIn": false,
                    "online": true,
                    "username": null,
                    "email": null,
                    "accesses": [
                        "loggedOut",
                        "online",
                        "default"
                    ]
                }
            });
        }
    }

    static async sendPasswordResetMail(req, res) {
        let email = req.body.email;
        let user = await User.findOne({email: email});
        if (user) {
            let info = await UserManager.sendPasswordResetEmail(user, req.lang);
            let success = (info.accepted.indexOf(email) !== -1);
            await res.json({success: success});
        } else {
            await res.json({success: false, message: "User not found!"})
        }
    }

    static async resetPassword(req, res) {
        let token = req.body.token;
        let password = req.body.password;

        if (await UserManager.resetPasswordWithToken(token, password)) {
            await res.json({success: true});
        } else {
            await res.json({success: false});
        }
    }

    static async getUserDataForRoles(req, res) {
        let user;
        if (req.query.id) {
            user = await User.findById(req.query.id, User.getRelations());
        }

        if (!user) {
            return res.json({success: false, message: "user not found"});
        }

        let userRoles = [];
        user.roles.forEach(role => userRoles.push(role.id));

        let roles = await Role.find();
        let rolesJson = [];
        roles.forEach(role => rolesJson.push({id: role.id, name: role.name}));

        let accesses = await UserManager.loadCachedAccessesForUser(user);
        let accessNames = [];
        accesses.forEach(access => accessNames.push(access.name));

        return res.json({
            success: true,
            "userData": {
                "id": user.id,
                "username": user.username,
                "accesses": accessNames,
                "roleIds": userRoles,
            },
            "roles": rolesJson,
        });
    }

    static async updateRoleForUser(req, res){
        let user;
        if (req.body.id) {
            user = await User.findById(req.body.id, User.getRelations());
        }

        if (req.body.addRole !== true && req.body.addRole !== false){
            return res.json({success: false, message: "missing parameter addRole"});
        }

        if (!user) {
            return res.json({success: false, message: "user not found"});
        }

        let role;
        if (req.body.roleId){
            role = await Role.findById(req.body.roleId);
        }
        if (!role){
            return res.json({success: false, message: "role not found"});
        }

        if (req.body.addRole){
            user.roles.push(role);
        }
        else {
            user.roles = user.roles.filter(userRole => userRole.id !== role.id);
        }

        await user.save();
        await UserManager.updateCachedAccessesForUser(user);

        let accesses = await UserManager.loadCachedAccessesForUser(user);
        let accessNames = [];
        accesses.forEach(access => accessNames.push(access.name));

        return res.json({
            "success": true,
            "accesses": accessNames
        })
    }

    static async listUsers(req, res){
        let userSearchName = Helper.nonNull(req.query.username, "");

        let users = await User.find({username: Like("%"+userSearchName+"%")});
        res.json({
            success: true,
            data: users
        });
    }
}
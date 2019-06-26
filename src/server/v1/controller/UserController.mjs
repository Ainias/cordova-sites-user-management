import {UserManager} from "../UserManager";

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
}
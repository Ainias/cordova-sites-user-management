import {UserManager} from "./UserManager";

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

    static async getMe(req, res) {
        let user = req.user;
        console.log(req.user);
        if (user) {
            res.json(user);
        } else {
            res.json({});
        }
    }
}
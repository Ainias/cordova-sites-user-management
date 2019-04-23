import jwt from "jsonwebtoken";
import {User} from "./../shared/model/User";

export class UserManager {

    static setUserFromToken(req, res, next) {
        let token = req.headers['x-access-token'] || req.headers['authorization']; // Express headers are auto converted to lowercase
        if (token && token.startsWith('Bearer ')) {
            // Remove Bearer from string
            token = token.slice(7, token.length);
        }

        console.log("token", token);

        if (token) {
            jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
                if (!err) {
                    let user = await User.findOne({id: decoded.userId, activated: true, blocked: false});
                    console.log("user", user, decoded);
                    if (user) {
                        req.user = user;
                    }
                } else {
                    console.error(err);
                }
                next();
            });
        } else {
            next();
        }
    }

    static needToken(req, res, next) {
        UserManager.setUserFromToken(req, res, () => {
            if (!req.user) {
                return res.json({
                    success: false,
                    message: 'User is not valid'
                });
            } else {
                next();
            }
        });
    }

    static _hashPassword(user, password) {
        return password;
    }

    static
    async login(email, password) {
        let user = await User.findOne({email: email, activated: true, blocked: false});

        if (user) {
            if (this._hashPassword(user, password) === user.password) {
                let token = jwt.sign({userId: user.id},
                    process.env.JWT_SECRET, {
                        expiresIn: UserManager.EXPIRES_IN
                    }
                );
                // return the JWT token for the future API calls
                return {user: user, token: token}
            } else {
                return null;
            }
        } else {
            return null;
        }
    }
}

UserManager.EXPIRES_IN = "7d";
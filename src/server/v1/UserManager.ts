import * as jwt from "jsonwebtoken";
import {User} from "../../shared/v1/model/User";
import {Role} from "../../shared/v1/model/Role";
import {EasySyncServerDb} from "cordova-sites-easy-sync/dist/server/EasySyncServerDb";
import {Helper} from "js-helper/dist/shared";
import {UserAccess} from "./model/UserAccess";
// import * as crypto from "crypto";
import * as nodemailer from "nodemailer";
import * as _typeorm from "typeorm";
import {ServerTranslator} from "cordova-sites/dist/server";

const crypto = require("crypto");

let typeorm = _typeorm;
// if (typeorm.default) {
//     typeorm = typeorm.default;
// }

export class UserManager {

    static SALT_LENGTH: number;
    static RENEW_AFTER: number = 60 * 60 * 24;
    static PEPPER: string;

    static REGISTRATION_SEND_EMAIL: boolean = true;

    static LOGIN_NEED_TO_BE_ACTIVATED: boolean;
    static REGISTRATION_CAN_REGISTER: boolean;
    static REGISTRATION_USERNAME_IS_CASE_SENSITIVE: boolean;
    static REGISTRATION_IS_ACTIVATED: boolean;
    static REGISTRATION_DEFAULT_ROLE_IDS;
    static EXPIRES_IN;

    static setUserFromToken(req, res, next) {
        let token = req.headers['x-access-token'] || req.headers['authorization']; // Express headers are auto converted to lowercase
        if (token && token.startsWith('Bearer ')) {
            // Remove Bearer from string
            token = token.slice(7, token.length);
        }

        if (token) {
            jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
                if (!err) {
                    let where = {
                        id: decoded.userId,
                        password: decoded.passwordHash,
                        blocked: false,
                    };
                    if (UserManager.LOGIN_NEED_TO_BE_ACTIVATED) {
                        where["activated"] = true;
                    }

                    let user = await User.findOne(where);

                    if (user) {
                        req.tokenData = decoded;
                        req.user = user;
                    } else {
                        console.log("user with id " + decoded.userId + " for token not found")
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

    static checkAccess(accessName) {
        return (req, res, next) => {
            UserManager.needToken(req, res, () => {
                UserManager.hasAccess(req.user, accessName).then(hasAccess => {
                    if (!hasAccess) {
                        return res.json({
                            success: false,
                            message: "Wrong Access!"
                        });
                    } else {
                        next();
                    }
                })
            });
        }
    }

    static _hashPassword(user, password) {
        if (!user.salt) {
            user.salt = UserManager._generateSalt();
        }
        let hash = crypto.createHmac("sha512", user.salt + UserManager.PEPPER);
        hash.update(password);
        return hash.digest("hex");
    }

    static async login(email, password) {
        let user = await User.findOne({email: email.toLowerCase(), activated: true, blocked: false});

        if (user) {
            if (this._hashPassword(user, password) === user.password) {
                let token = UserManager._generateToken(user);
                return {user: user, token: token}
            } else {
                return null;
            }
        } else {
            return null;
        }
    }

    static async register(email, username, password) {
        if (!UserManager.REGISTRATION_CAN_REGISTER) {
            throw new Error("Cannot register new user, since user registration is not activated!")
        }

        email = email.toLowerCase();
        if (!UserManager.REGISTRATION_USERNAME_IS_CASE_SENSITIVE) {
            username = username.toLowerCase();
        }
        let otherUsers = await Promise.all([
            User.findOne({email: email}),
            User.findOne({username: typeorm.Equal(username)}),
        ]);

        if (otherUsers[0]) {
            throw new Error("A user with the email-address exists already!")
        }
        if (otherUsers[1]) {
            throw new Error("A user with the username exists already!")
        }

        let user = new User();
        user.username = username;
        user.email = email;
        user.password = UserManager._hashPassword(user, password);
        user.activated = UserManager.REGISTRATION_IS_ACTIVATED;
        user.blocked = false;
        user.roles = await Role.findByIds(UserManager.REGISTRATION_DEFAULT_ROLE_IDS);
        await user.save();

        await UserManager.updateCachedAccessesForUser(user);

        //TODO email senden

        return user;
    }

    static async sendPasswordResetEmail(user, language): Promise<any> {
        let token = jwt.sign({userId: user.id, version: user.version, action: "pw-reset"},
            process.env.JWT_SECRET, {
                expiresIn: UserManager.EXPIRES_IN
            }
        );

        let transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: Helper.nonNull(process.env.EMAIL_SECURE, "1") !== "0",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            }
        });

        let serverTranslator = new ServerTranslator(language);

        let mailOptions = {
            from: process.env.EMAIL_FROM,
            to: user.email,
            subject: serverTranslator.translate("email-header-usermanager-password-forgotten"),
            text: serverTranslator.translate("email-usermanager-password-forgotten", [user.username, process.env.PW_FORGOTTEN_LINK + token])
        };

        return new Promise((resolve, reject) => {
            transporter.sendMail(mailOptions, (err, info) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(info);
                }
            })
        });
    }

    static async resetPasswordWithToken(token, newPw) {
        return new Promise((resolve, reject) => {
            jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
                if (!err) {
                    if (decoded.action === "pw-reset") {

                        let where = {
                            id: decoded.userId,
                            version: decoded.version,
                            blocked: false,
                        };

                        let user = await User.findOne(where);

                        if (user) {
                            user.password = UserManager._hashPassword(user, newPw);
                            await user.save();
                            resolve(true);
                        } else {
                            console.log("user with id " + decoded.userId + " for token not found while resetting password");
                            resolve(false);
                        }
                    } else {
                        resolve(false);
                    }

                } else {
                    console.error(err);
                    reject(err);
                }
            });
        });
    }

    static _generateToken(user) {
        return jwt.sign({userId: user.id, passwordHash: user.password},
            process.env.JWT_SECRET, {
                expiresIn: UserManager.EXPIRES_IN
            }
        );
    }

    static async findAccessesForUser(user) {
        let accesses = [];

        let roles = user.roles;
        let roleIds = [];
        roles.forEach(role => {
            roleIds.push(role.id);
        });

        //Reload roles with accesses
        roles = await Role.findByIds(roleIds, ["accesses"]);

        await Helper.asyncForEach(roles, async role => {
            accesses.push(...await this.findAccessesForRole(role))
        });

        return accesses;
    }

    static async findAccessesForRole(role) {
        let accesses = role.accesses;

        let repo = await EasySyncServerDb.getInstance()._getRepository(Role.getSchemaName());
        let parents = await repo.createQueryBuilder(Role.getSchemaName())
            .leftJoinAndSelect(Role.getSchemaName() + '.accesses', "access")
            .leftJoinAndSelect(Role.getSchemaName() + '.children', "child")
            .where('child.id = :id', {id: role.id})
            .getMany();

        await Helper.asyncForEach(parents, async role => {
            let otherAccesses = await this.findAccessesForRole(role);
            accesses.push(...otherAccesses);
        });
        return accesses;
    }

    static async updateCachedAccessesForUser(user) {
        let oldUserAccesses = await UserAccess.find({user: {id: user.id}}, null, null, null, UserAccess.getRelations());
        oldUserAccesses = Helper.arrayToObject(oldUserAccesses, oldAccess => oldAccess.access.id);

        let oldAccessesIds = Object.keys(oldUserAccesses);
        let oldAccessesStillActive = [];

        let newUserAccesses = [];
        let accesses = await UserManager.findAccessesForUser(user);

        accesses.forEach(access => {
            if (oldAccessesIds.indexOf(""+access.id) === -1) {
                let userAccess = new UserAccess();
                userAccess.user = user;
                userAccess.access = access;
                newUserAccesses.push(userAccess);
            } else {
                oldAccessesStillActive.push(access.id)
            }
        });

        let deleteIds = oldAccessesIds.filter(id => oldAccessesStillActive.indexOf(parseInt(id)) === -1);

        let deleteUserAccesses = [];
        deleteIds.forEach(id => {
            if (oldUserAccesses[id]) {
                deleteUserAccesses.push(oldUserAccesses[id]);
            }
        });

        await Promise.all([UserAccess.saveMany(newUserAccesses), UserAccess.deleteMany(deleteUserAccesses)]);
    }

    static async loadCachedAccessesForUser(user, reload?) {
        if (user._cachedAccesses) {
            return user._cachedAccesses;
        }

        let repo = await EasySyncServerDb.getInstance()._getRepository(UserAccess.getSchemaName());
        let userAccesses = await repo.createQueryBuilder(UserAccess.getSchemaName())
            .leftJoinAndSelect(UserAccess.getSchemaName() + '.user', "user")
            .leftJoinAndSelect(UserAccess.getSchemaName() + '.access', "access")
            .where('user.id = :id', {id: user.id})
            .getMany();

        let accesses = [];
        userAccesses.forEach(userAccess => accesses.push(userAccess.access));
        user._cachedAccesses = accesses;

        return accesses;
    }

    static async hasAccess(user, access) {
        let accesses = await UserManager.loadCachedAccessesForUser(user);
        let accessNames = [];
        accesses.forEach(access => accessNames.push(access.name));
        return (accessNames.indexOf(access) !== -1);
    }

    static _generateSalt() {
        let length = UserManager.SALT_LENGTH;
        return crypto.randomBytes(Math.ceil(length / 2)).toString("hex").slice(0, length);
    }
}

UserManager.SALT_LENGTH = 12;
UserManager.EXPIRES_IN = "7d";
UserManager.RENEW_AFTER = 60 * 60 * 24;
UserManager.PEPPER = "";

UserManager.LOGIN_NEED_TO_BE_ACTIVATED = true;

//Registration-Settings
UserManager.REGISTRATION_SEND_EMAIL = true;
UserManager.REGISTRATION_IS_ACTIVATED = false;
UserManager.REGISTRATION_DEFAULT_ROLE_IDS = [];
UserManager.REGISTRATION_USERNAME_IS_CASE_SENSITIVE = true;
UserManager.REGISTRATION_CAN_REGISTER = true;
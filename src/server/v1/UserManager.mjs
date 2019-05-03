import jwt from "jsonwebtoken";
import {User} from "../../shared/model/User";
import {Role} from "../../shared/model/Role";
import {EasySyncServerDb} from "cordova-sites-easy-sync/src/server/EasySyncServerDb";
import {ServerHelper} from "./ServerHelper";
import {UserAccess} from "./model/UserAccess";

export class UserManager {

    static setUserFromToken(req, res, next) {
        let token = req.headers['x-access-token'] || req.headers['authorization']; // Express headers are auto converted to lowercase
        if (token && token.startsWith('Bearer ')) {
            // Remove Bearer from string
            token = token.slice(7, token.length);
        }

        if (token) {
            jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
                if (!err) {
                    let user = await User.findOne({id: decoded.userId, password: decoded.passwordHash, activated: true, blocked: false});
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

    static async login(email, password) {
        let user = await User.findOne({email: email, activated: true, blocked: false});

        if (user) {
            if (this._hashPassword(user, password) === user.password) {
                let token = jwt.sign({userId: user.id, passwordHash: user.password},
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

    static async findAccessesForUser(user){
        let accesses = [];

        let roles = user.roles;
        let roleIds = [];
        roles.forEach(role => {
            roleIds.push(role.id);
        });

        //Reload roles with accesses
        roles = await Role.findByIds(roleIds, ["accesses"]);

        await ServerHelper.asyncForEach(roles, async role => {
            accesses.push(...await this.findAccessesForRole(role))
        });

      return accesses;
    }

    static async findAccessesForRole(role){
        let accesses = role.accesses;

        let repo = await EasySyncServerDb.getInstance()._getRepository(Role.getSchemaName());
        let parents = await repo.createQueryBuilder(Role.getSchemaName())
            .leftJoinAndSelect(Role.getSchemaName() + '.accesses', "access")
            .leftJoinAndSelect(Role.getSchemaName() + '.children', "child")
            .where('child.id = :id', {id: role.id})
            .getMany();

        await ServerHelper.asyncForEach(parents, async role => {
            let otherAccesses = await this.findAccessesForRole(role);
            accesses.push(...otherAccesses);
        });
        return accesses;
    }

    static async updateCachedAccessesForUser(user){
        let userAccesses = await UserManager.findAccessesForUser(user);
        await ServerHelper.asyncForEach(userAccesses, (async access => {
            let userAccess = new UserAccess();
            userAccess.user = user;
            userAccess.access = access;
            await userAccess.save();
        }), false);
    }

    static async loadCachedAccessesForUser(user){
        let repo = await EasySyncServerDb.getInstance()._getRepository(UserAccess.getSchemaName());
        let userAccesses = await repo.createQueryBuilder(UserAccess.getSchemaName())
            .leftJoinAndSelect(UserAccess.getSchemaName() + '.user', "user")
            .leftJoinAndSelect(UserAccess.getSchemaName() + '.access', "access")
            .where('user.id = :id', {id: user.id})
            .getMany();

        let accesses = [];
        userAccesses.forEach(userAccess => accesses.push(userAccess.access));
        return accesses;
    }

}

UserManager.EXPIRES_IN = "7d";
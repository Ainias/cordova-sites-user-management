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
const typeorm_1 = require("typeorm");
const cordova_sites_database_1 = require("cordova-sites-database/dist/cordova-sites-database");
class SetupUserManagement1000000001000 {
    _isServer() {
        return (typeof document !== "object");
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._addAccess(queryRunner);
            yield this._addRole(queryRunner);
            yield this._addUser(queryRunner);
            yield this._addRoleAccess(queryRunner);
            yield this._addRoleChildren(queryRunner);
            yield this._addUserRole(queryRunner);
            if (this._isServer()) {
                yield this._addUserAccess(queryRunner);
            }
        });
    }
    _addAccess(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            let accessTable = new typeorm_1.Table({
                name: "access",
                columns: [
                    {
                        name: "id",
                        isPrimary: true,
                        type: cordova_sites_database_1.BaseDatabase.TYPES.INTEGER,
                        isGenerated: this._isServer(),
                        generationStrategy: "increment"
                    },
                    {
                        name: "createdAt",
                        type: cordova_sites_database_1.BaseDatabase.TYPES.DATE,
                    },
                    {
                        name: "updatedAt",
                        type: cordova_sites_database_1.BaseDatabase.TYPES.DATE,
                    },
                    {
                        name: "version",
                        type: cordova_sites_database_1.BaseDatabase.TYPES.INTEGER,
                    },
                    {
                        name: "deleted",
                        type: cordova_sites_database_1.BaseDatabase.TYPES.BOOLEAN,
                    },
                    {
                        name: "name",
                        type: cordova_sites_database_1.BaseDatabase.TYPES.STRING,
                        isUnique: true
                    },
                    {
                        name: "description",
                        type: cordova_sites_database_1.BaseDatabase.TYPES.STRING
                    }
                ]
            });
            return yield queryRunner.createTable(accessTable, true);
        });
    }
    _addRole(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            let roleTable = new typeorm_1.Table({
                name: "role",
                columns: [
                    {
                        name: "id",
                        isPrimary: true,
                        type: cordova_sites_database_1.BaseDatabase.TYPES.INTEGER,
                        isGenerated: this._isServer(),
                        generationStrategy: "increment"
                    },
                    {
                        name: "createdAt",
                        type: cordova_sites_database_1.BaseDatabase.TYPES.DATE,
                    },
                    {
                        name: "updatedAt",
                        type: cordova_sites_database_1.BaseDatabase.TYPES.DATE,
                    },
                    {
                        name: "version",
                        type: cordova_sites_database_1.BaseDatabase.TYPES.INTEGER,
                    },
                    {
                        name: "deleted",
                        type: cordova_sites_database_1.BaseDatabase.TYPES.BOOLEAN,
                    },
                    {
                        name: "name",
                        type: cordova_sites_database_1.BaseDatabase.TYPES.STRING,
                    },
                    {
                        name: "description",
                        type: cordova_sites_database_1.BaseDatabase.TYPES.STRING
                    }
                ]
            });
            return yield queryRunner.createTable(roleTable, true);
        });
    }
    _addUser(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            let userTable = new typeorm_1.Table({
                name: "user",
                columns: [
                    {
                        name: "id",
                        isPrimary: true,
                        type: cordova_sites_database_1.BaseDatabase.TYPES.INTEGER,
                        isGenerated: this._isServer(),
                        generationStrategy: "increment"
                    },
                    {
                        name: "createdAt",
                        type: cordova_sites_database_1.BaseDatabase.TYPES.DATE,
                    },
                    {
                        name: "updatedAt",
                        type: cordova_sites_database_1.BaseDatabase.TYPES.DATE,
                    },
                    {
                        name: "version",
                        type: cordova_sites_database_1.BaseDatabase.TYPES.INTEGER,
                    },
                    {
                        name: "deleted",
                        type: cordova_sites_database_1.BaseDatabase.TYPES.BOOLEAN,
                    },
                    {
                        name: "username",
                        type: cordova_sites_database_1.BaseDatabase.TYPES.STRING,
                        isUnique: true
                    },
                    {
                        name: "email",
                        type: cordova_sites_database_1.BaseDatabase.TYPES.STRING,
                        isUnique: true
                    },
                    {
                        name: "password",
                        type: cordova_sites_database_1.BaseDatabase.TYPES.STRING,
                    },
                    {
                        name: "activated",
                        type: cordova_sites_database_1.BaseDatabase.TYPES.BOOLEAN,
                    },
                    {
                        name: "blocked",
                        type: cordova_sites_database_1.BaseDatabase.TYPES.BOOLEAN,
                    },
                    {
                        name: "salt",
                        type: cordova_sites_database_1.BaseDatabase.TYPES.STRING,
                    },
                ]
            });
            return yield queryRunner.createTable(userTable, true);
        });
    }
    _addRoleAccess(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            let roleAccessTable = new typeorm_1.Table({
                name: "roleAccess",
                columns: [
                    {
                        name: "roleId",
                        isPrimary: true,
                        type: cordova_sites_database_1.BaseDatabase.TYPES.INTEGER
                    },
                    {
                        name: "accessId",
                        isPrimary: true,
                        type: cordova_sites_database_1.BaseDatabase.TYPES.INTEGER,
                    }
                ],
                indices: [
                    {
                        name: "IDX_38300dd4683a436f8db90b42bd",
                        columnNames: ["roleId"]
                    },
                    {
                        name: "IDX_bd55fc382ad2480f75a17e33cb",
                        columnNames: ["accessId"]
                    }
                ],
                foreignKeys: [
                    {
                        name: "FK_38300dd4683a436f8db90b42bd9",
                        columnNames: ["roleId"],
                        referencedTableName: "role",
                        referencedColumnNames: ["id"],
                        onDelete: "cascade",
                    },
                    {
                        name: "FK_bd55fc382ad2480f75a17e33cb5",
                        columnNames: ["accessId"],
                        referencedTableName: "access",
                        referencedColumnNames: ["id"],
                        onDelete: "cascade",
                    },
                ]
            });
            return yield queryRunner.createTable(roleAccessTable, true);
        });
    }
    _addRoleChildren(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            let roleChildrenTable = new typeorm_1.Table({
                name: "roleChildren",
                columns: [
                    {
                        name: "childId",
                        isPrimary: true,
                        type: cordova_sites_database_1.BaseDatabase.TYPES.INTEGER
                    },
                    {
                        name: "parentId",
                        isPrimary: true,
                        type: cordova_sites_database_1.BaseDatabase.TYPES.INTEGER,
                    }
                ],
                indices: [
                    {
                        name: "IDX_030234c342756c67cefa480687",
                        columnNames: ["childId"]
                    },
                    {
                        name: "IDX_35741f2d68a65c2765047705f8",
                        columnNames: ["parentId"]
                    }
                ],
                foreignKeys: [
                    {
                        name: "FK_roleChildren_childId",
                        columnNames: ["childId"],
                        referencedTableName: "role",
                        referencedColumnNames: ["id"],
                        onDelete: "cascade",
                    },
                    {
                        name: "FK_roleChildren_parentId",
                        columnNames: ["parentId"],
                        referencedTableName: "role",
                        referencedColumnNames: ["id"],
                        onDelete: "cascade",
                    },
                ]
            });
            return yield queryRunner.createTable(roleChildrenTable, true);
        });
    }
    _addUserRole(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            let userRoleTable = new typeorm_1.Table({
                name: "userRole",
                columns: [
                    {
                        name: "userId",
                        isPrimary: true,
                        type: cordova_sites_database_1.BaseDatabase.TYPES.INTEGER
                    },
                    {
                        name: "roleId",
                        isPrimary: true,
                        type: cordova_sites_database_1.BaseDatabase.TYPES.INTEGER,
                    }
                ],
                indices: [
                    {
                        name: "IDX_userRole_userId",
                        columnNames: ["userId"]
                    },
                    {
                        name: "IDX_userRole_roleId",
                        columnNames: ["roleId"]
                    }
                ],
                foreignKeys: [
                    {
                        name: "FK_userRole_userId",
                        columnNames: ["userId"],
                        referencedTableName: "user",
                        referencedColumnNames: ["id"],
                        onDelete: "cascade",
                    },
                    {
                        name: "FK_userRole_roleId",
                        columnNames: ["roleId"],
                        referencedTableName: "role",
                        referencedColumnNames: ["id"],
                        onDelete: "cascade",
                    },
                ]
            });
            return yield queryRunner.createTable(userRoleTable, true);
        });
    }
    _addUserAccess(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            let userRoleTable = new typeorm_1.Table({
                name: "user_access",
                columns: [
                    {
                        name: "id",
                        isPrimary: true,
                        isGenerated: this._isServer(),
                        generationStrategy: "increment",
                        type: cordova_sites_database_1.BaseDatabase.TYPES.INTEGER
                    },
                    {
                        name: "userId",
                        type: cordova_sites_database_1.BaseDatabase.TYPES.INTEGER,
                        isNullable: true
                    },
                    {
                        name: "accessId",
                        type: cordova_sites_database_1.BaseDatabase.TYPES.INTEGER,
                        isNullable: true
                    }
                ],
                indices: [
                    {
                        name: "IDX_userAccess_userId",
                        columnNames: ["userId"]
                    },
                    {
                        name: "IDX_userAccess_accessId",
                        columnNames: ["accessId"]
                    }
                ],
                foreignKeys: [
                    {
                        name: "FK_userAccess_userId",
                        columnNames: ["userId"],
                        referencedTableName: "user",
                        referencedColumnNames: ["id"],
                        onDelete: "cascade",
                    },
                    {
                        name: "FK_userAccess_accessId",
                        columnNames: ["accessId"],
                        referencedTableName: "access",
                        referencedColumnNames: ["id"],
                        onDelete: "cascade",
                    },
                ]
            });
            return yield queryRunner.createTable(userRoleTable, true);
        });
    }
    down(queryRunner) {
        return undefined;
    }
}
exports.SetupUserManagement1000000001000 = SetupUserManagement1000000001000;
//# sourceMappingURL=SetupUserManagement.js.map
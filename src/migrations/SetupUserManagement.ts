import {MigrationInterface, QueryRunner, Table} from "typeorm";
import {BaseDatabase} from "cordova-sites-database/dist/cordova-sites-database";

export class SetupUserManagement1000000001000 implements MigrationInterface {

    _isServer(): boolean {
        return (typeof document !== "object")
    }

    async up(queryRunner: QueryRunner): Promise<any> {
        await this._addAccess(queryRunner);

        await this._addRole(queryRunner);

        await this._addUser(queryRunner);

        await this._addRoleAccess(queryRunner);

        await this._addRoleChildren(queryRunner);

        await this._addUserRole(queryRunner);

        if (this._isServer()) {
            await this._addUserAccess(queryRunner);
        }
    }

    async _addAccess(queryRunner: QueryRunner) {
        let accessTable = new Table({
            name: "access",
            columns: [
                {
                    name: "id",
                    isPrimary: true,
                    type: BaseDatabase.TYPES.INTEGER,
                    isGenerated: this._isServer(),
                    generationStrategy: "increment" as "increment"
                },
                {
                    name: "createdAt",
                    type: BaseDatabase.TYPES.DATE,
                },
                {
                    name: "updatedAt",
                    type: BaseDatabase.TYPES.DATE,
                },
                {
                    name: "version",
                    type: BaseDatabase.TYPES.INTEGER,
                },
                {
                    name: "deleted",
                    type: BaseDatabase.TYPES.BOOLEAN,
                },
                {
                    name: "name",
                    type: BaseDatabase.TYPES.STRING,
                    isUnique: true
                },
                {
                    name: "description",
                    type: BaseDatabase.TYPES.STRING
                }
            ]
        });
        return await queryRunner.createTable(accessTable, true)
    }

    async _addRole(queryRunner: QueryRunner) {
        let roleTable = new Table({
            name: "role",
            columns: [
                {
                    name: "id",
                    isPrimary: true,
                    type: BaseDatabase.TYPES.INTEGER,
                    isGenerated: this._isServer(),
                    generationStrategy: "increment" as "increment"
                },
                {
                    name: "createdAt",
                    type: BaseDatabase.TYPES.DATE,
                },
                {
                    name: "updatedAt",
                    type: BaseDatabase.TYPES.DATE,
                },
                {
                    name: "version",
                    type: BaseDatabase.TYPES.INTEGER,
                },
                {
                    name: "deleted",
                    type: BaseDatabase.TYPES.BOOLEAN,
                },
                {
                    name: "name",
                    type: BaseDatabase.TYPES.STRING,
                },
                {
                    name: "description",
                    type: BaseDatabase.TYPES.STRING
                }
            ]
        });
        return await queryRunner.createTable(roleTable, true)
    }

    async _addUser(queryRunner: QueryRunner) {
        let userTable = new Table({
            name: "user",
            columns: [
                {
                    name: "id",
                    isPrimary: true,
                    type: BaseDatabase.TYPES.INTEGER,
                    isGenerated: this._isServer(),
                    generationStrategy: "increment" as "increment"
                },
                {
                    name: "createdAt",
                    type: BaseDatabase.TYPES.DATE,
                },
                {
                    name: "updatedAt",
                    type: BaseDatabase.TYPES.DATE,
                },
                {
                    name: "version",
                    type: BaseDatabase.TYPES.INTEGER,
                },
                {
                    name: "deleted",
                    type: BaseDatabase.TYPES.BOOLEAN,
                },
                {
                    name: "username",
                    type: BaseDatabase.TYPES.STRING,
                    isUnique: true
                },
                {
                    name: "email",
                    type: BaseDatabase.TYPES.STRING,
                    isUnique: true
                },
                {
                    name: "password",
                    type: BaseDatabase.TYPES.STRING,
                },
                {
                    name: "activated",
                    type: BaseDatabase.TYPES.BOOLEAN,
                },
                {
                    name: "blocked",
                    type: BaseDatabase.TYPES.BOOLEAN,
                },
                {
                    name: "salt",
                    type: BaseDatabase.TYPES.STRING,
                },
            ]
        });
        return await queryRunner.createTable(userTable, true)
    }

    async _addRoleAccess(queryRunner: QueryRunner) {
        let roleAccessTable = new Table({
            name: "roleAccess",
            columns: [
                {
                    name: "roleId",
                    isPrimary: true,
                    type: BaseDatabase.TYPES.INTEGER
                },
                {
                    name: "accessId",
                    isPrimary: true,
                    type: BaseDatabase.TYPES.INTEGER,
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
        return await queryRunner.createTable(roleAccessTable, true)
    }

    async _addRoleChildren(queryRunner: QueryRunner) {
        let roleChildrenTable = new Table({
            name: "roleChildren",
            columns: [
                {
                    name: "childId",
                    isPrimary: true,
                    type: BaseDatabase.TYPES.INTEGER
                },
                {
                    name: "parentId",
                    isPrimary: true,
                    type: BaseDatabase.TYPES.INTEGER,
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
        return await queryRunner.createTable(roleChildrenTable, true)
    }

    async _addUserRole(queryRunner: QueryRunner) {
        let userRoleTable = new Table({
            name: "userRole",
            columns: [
                {
                    name: "userId",
                    isPrimary: true,
                    type: BaseDatabase.TYPES.INTEGER
                },
                {
                    name: "roleId",
                    isPrimary: true,
                    type: BaseDatabase.TYPES.INTEGER,
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
        return await queryRunner.createTable(userRoleTable, true)
    }

    async _addUserAccess(queryRunner: QueryRunner) {
        let userRoleTable = new Table({
            name: "user_access",
            columns: [
                {
                    name: "id",
                    isPrimary: true,
                    isGenerated: this._isServer(),
                    generationStrategy: "increment" as "increment",
                    type: BaseDatabase.TYPES.INTEGER
                },
                {
                    name: "userId",
                    type: BaseDatabase.TYPES.INTEGER,
                    isNullable: true
                },
                {
                    name: "accessId",
                    type: BaseDatabase.TYPES.INTEGER,
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
        return await queryRunner.createTable(userRoleTable, true)
    }

    down(queryRunner: QueryRunner): Promise<any> {
        return undefined;
    }

}
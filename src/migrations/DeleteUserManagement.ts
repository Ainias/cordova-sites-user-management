import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class DeleteUserManagement1000000000000 implements MigrationInterface {

    _isServer(): boolean {
        return (typeof document !== "object")
    }

    async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable("roleAccess", true);
        await queryRunner.dropTable("roleChildren", true);
        await queryRunner.dropTable("userRole", true);
        if (this._isServer()) {
            await queryRunner.dropTable("user_access", true);
        }

        await queryRunner.dropTable("access", true);
        await queryRunner.dropTable("role", true);
        await queryRunner.dropTable("user", true);
    }

    down(queryRunner: QueryRunner): Promise<any> {
        return undefined;
    }

}
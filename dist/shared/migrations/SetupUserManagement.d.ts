import { MigrationInterface, QueryRunner } from "typeorm";
export declare class SetupUserManagement1000000001000 implements MigrationInterface {
    _isServer(): boolean;
    up(queryRunner: QueryRunner): Promise<any>;
    _addAccess(queryRunner: QueryRunner): Promise<void>;
    _addRole(queryRunner: QueryRunner): Promise<void>;
    _addUser(queryRunner: QueryRunner): Promise<void>;
    _addRoleAccess(queryRunner: QueryRunner): Promise<void>;
    _addRoleChildren(queryRunner: QueryRunner): Promise<void>;
    _addUserRole(queryRunner: QueryRunner): Promise<void>;
    _addUserAccess(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<any>;
}

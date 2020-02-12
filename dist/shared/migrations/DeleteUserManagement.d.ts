import { MigrationInterface, QueryRunner } from "typeorm";
export declare class DeleteUserManagement1000000000000 implements MigrationInterface {
    _isServer(): boolean;
    up(queryRunner: QueryRunner): Promise<any>;
    down(queryRunner: QueryRunner): Promise<any>;
}

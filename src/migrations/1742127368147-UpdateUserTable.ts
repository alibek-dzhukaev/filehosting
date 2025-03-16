import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateUserTable1742127368147 implements MigrationInterface {
    name = 'UpdateUserTable1742127368147'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "date_of_birthday"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "date_of_birthday" date NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "date_of_birthday"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "date_of_birthday" character varying NOT NULL`);
    }

}

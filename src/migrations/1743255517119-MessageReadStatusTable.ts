import { MigrationInterface, QueryRunner } from 'typeorm';

export class MessageReadStatusTable1743255517119 implements MigrationInterface {
  name = 'MessageReadStatusTable1743255517119';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "message_read_status" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "read_at" TIMESTAMP NOT NULL DEFAULT now(), "is_delivered" boolean NOT NULL DEFAULT false, "message_id" uuid, "user_id" uuid, CONSTRAINT "PK_258e8d92b4e212a121dc10a74d3" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_2caedc13670e267be75d85ec13" ON "message_read_status" ("message_id", "user_id") `
    );
    await queryRunner.query(
      `ALTER TABLE "message_read_status" ADD CONSTRAINT "FK_c3e9aed660151891b1efa5fe34a" FOREIGN KEY ("message_id") REFERENCES "message"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "message_read_status" ADD CONSTRAINT "FK_c634dcb6a485d81233d0192c0ae" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "message_read_status" DROP CONSTRAINT "FK_c634dcb6a485d81233d0192c0ae"`
    );
    await queryRunner.query(
      `ALTER TABLE "message_read_status" DROP CONSTRAINT "FK_c3e9aed660151891b1efa5fe34a"`
    );
    await queryRunner.query(`DROP INDEX "public"."IDX_2caedc13670e267be75d85ec13"`);
    await queryRunner.query(`DROP TABLE "message_read_status"`);
  }
}

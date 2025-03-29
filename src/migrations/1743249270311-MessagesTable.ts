import { MigrationInterface, QueryRunner } from 'typeorm';

export class MessagesTable1743249270311 implements MigrationInterface {
  name = 'MessagesTable1743249270311';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "message" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "content" text NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "is_edited" boolean NOT NULL DEFAULT false, "is_deleted" boolean NOT NULL DEFAULT false, "metadata" jsonb, "sender_id" uuid, "channel_id" uuid, "recipient_id" uuid, CONSTRAINT "PK_ba01f0a3e0123651915008bc578" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `ALTER TABLE "message" ADD CONSTRAINT "FK_c0ab99d9dfc61172871277b52f6" FOREIGN KEY ("sender_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "message" ADD CONSTRAINT "FK_f6d0a3bccef803efd6d5102655c" FOREIGN KEY ("channel_id") REFERENCES "channel"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "message" ADD CONSTRAINT "FK_3318a3c87e7795d769d5b96e564" FOREIGN KEY ("recipient_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "message" DROP CONSTRAINT "FK_3318a3c87e7795d769d5b96e564"`
    );
    await queryRunner.query(
      `ALTER TABLE "message" DROP CONSTRAINT "FK_f6d0a3bccef803efd6d5102655c"`
    );
    await queryRunner.query(
      `ALTER TABLE "message" DROP CONSTRAINT "FK_c0ab99d9dfc61172871277b52f6"`
    );
    await queryRunner.query(`DROP TABLE "message"`);
  }
}

import { MigrationInterface, QueryRunner } from 'typeorm';

export class DirectMessageTable1743252545372 implements MigrationInterface {
  name = 'DirectMessageTable1743252545372';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "direct_message_thread" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "is_archived_user1" boolean NOT NULL DEFAULT false, "is_archived_user2" boolean NOT NULL DEFAULT false, "is_blocked" boolean NOT NULL DEFAULT false, "user1_id" uuid, "user2_id" uuid, "last_message_id" uuid, "blocked_by_id" uuid, CONSTRAINT "PK_02c35793b14f8570d1bc0986d9b" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(`ALTER TABLE "message" ADD "direct_thread_id" uuid`);
    await queryRunner.query(
      `ALTER TABLE "direct_message_thread" ADD CONSTRAINT "FK_b7213ec5b647dc1f1cadae1adde" FOREIGN KEY ("user1_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "direct_message_thread" ADD CONSTRAINT "FK_b9b1bff9fe7386975805679a2d8" FOREIGN KEY ("user2_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "direct_message_thread" ADD CONSTRAINT "FK_04efddd19a716bd449e6bfc754d" FOREIGN KEY ("last_message_id") REFERENCES "message"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "direct_message_thread" ADD CONSTRAINT "FK_d764c13d6f9faf95b27b6a2ce4e" FOREIGN KEY ("blocked_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "message" ADD CONSTRAINT "FK_34b0b230d91df1ef6dfb9cf828f" FOREIGN KEY ("direct_thread_id") REFERENCES "direct_message_thread"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "message" DROP CONSTRAINT "FK_34b0b230d91df1ef6dfb9cf828f"`
    );
    await queryRunner.query(
      `ALTER TABLE "direct_message_thread" DROP CONSTRAINT "FK_d764c13d6f9faf95b27b6a2ce4e"`
    );
    await queryRunner.query(
      `ALTER TABLE "direct_message_thread" DROP CONSTRAINT "FK_04efddd19a716bd449e6bfc754d"`
    );
    await queryRunner.query(
      `ALTER TABLE "direct_message_thread" DROP CONSTRAINT "FK_b9b1bff9fe7386975805679a2d8"`
    );
    await queryRunner.query(
      `ALTER TABLE "direct_message_thread" DROP CONSTRAINT "FK_b7213ec5b647dc1f1cadae1adde"`
    );
    await queryRunner.query(`ALTER TABLE "message" DROP COLUMN "direct_thread_id"`);
    await queryRunner.query(`DROP TABLE "direct_message_thread"`);
  }
}

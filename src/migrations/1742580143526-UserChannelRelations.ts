import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserChannelRelations1742580143526 implements MigrationInterface {
  name = 'UserChannelRelations1742580143526';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user_channels_channel" ("userId" uuid NOT NULL, "channelId" uuid NOT NULL, CONSTRAINT "PK_01cb58c2f493472e335712d76c7" PRIMARY KEY ("userId", "channelId"))`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_9c701cabd952769d5c75844343" ON "user_channels_channel" ("userId") `
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ab9fe5d9528e30e09b462c345d" ON "user_channels_channel" ("channelId") `
    );
    await queryRunner.query(
      `CREATE TABLE "user_admin_channels_channel" ("userId" uuid NOT NULL, "channelId" uuid NOT NULL, CONSTRAINT "PK_f10875791fd8988ce94c5e7c950" PRIMARY KEY ("userId", "channelId"))`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_a2648e81a521d90f13e7e506b6" ON "user_admin_channels_channel" ("userId") `
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_bbab05ea3f5c715fe9bcf713ba" ON "user_admin_channels_channel" ("channelId") `
    );
    await queryRunner.query(`ALTER TABLE "channel" DROP COLUMN "owner_id"`);
    await queryRunner.query(
      `ALTER TABLE "user_channels_channel" ADD CONSTRAINT "FK_9c701cabd952769d5c75844343c" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    );
    await queryRunner.query(
      `ALTER TABLE "user_channels_channel" ADD CONSTRAINT "FK_ab9fe5d9528e30e09b462c345d2" FOREIGN KEY ("channelId") REFERENCES "channel"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "user_admin_channels_channel" ADD CONSTRAINT "FK_a2648e81a521d90f13e7e506b6d" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    );
    await queryRunner.query(
      `ALTER TABLE "user_admin_channels_channel" ADD CONSTRAINT "FK_bbab05ea3f5c715fe9bcf713ba8" FOREIGN KEY ("channelId") REFERENCES "channel"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_admin_channels_channel" DROP CONSTRAINT "FK_bbab05ea3f5c715fe9bcf713ba8"`
    );
    await queryRunner.query(
      `ALTER TABLE "user_admin_channels_channel" DROP CONSTRAINT "FK_a2648e81a521d90f13e7e506b6d"`
    );
    await queryRunner.query(
      `ALTER TABLE "user_channels_channel" DROP CONSTRAINT "FK_ab9fe5d9528e30e09b462c345d2"`
    );
    await queryRunner.query(
      `ALTER TABLE "user_channels_channel" DROP CONSTRAINT "FK_9c701cabd952769d5c75844343c"`
    );
    await queryRunner.query(`ALTER TABLE "channel" ADD "owner_id" character varying NOT NULL`);
    await queryRunner.query(`DROP INDEX "public"."IDX_bbab05ea3f5c715fe9bcf713ba"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_a2648e81a521d90f13e7e506b6"`);
    await queryRunner.query(`DROP TABLE "user_admin_channels_channel"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_ab9fe5d9528e30e09b462c345d"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_9c701cabd952769d5c75844343"`);
    await queryRunner.query(`DROP TABLE "user_channels_channel"`);
  }
}

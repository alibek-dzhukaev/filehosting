import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChannelMembersTable1743254704484 implements MigrationInterface {
  name = 'ChannelMembersTable1743254704484';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."channel_member_role_enum" AS ENUM('owner', 'admin', 'moderator', 'member', 'guest')`
    );
    await queryRunner.query(
      `CREATE TABLE "channel_member" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "role" "public"."channel_member_role_enum" NOT NULL DEFAULT 'member', "joined_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "notifications_enabled" boolean NOT NULL DEFAULT true, "preferences" jsonb, "user_id" uuid, "channel_id" uuid, "last_read_message_id" uuid, CONSTRAINT "PK_a4a716289e5b0468f55f8e8d225" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `ALTER TABLE "channel_member" ADD CONSTRAINT "FK_acb34f60dda89d12956feeedbf4" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "channel_member" ADD CONSTRAINT "FK_c0e555240770b2a13a82da4db6e" FOREIGN KEY ("channel_id") REFERENCES "channel"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "channel_member" ADD CONSTRAINT "FK_6aa56be86bcdd982375723b1293" FOREIGN KEY ("last_read_message_id") REFERENCES "message"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "channel_member" DROP CONSTRAINT "FK_6aa56be86bcdd982375723b1293"`
    );
    await queryRunner.query(
      `ALTER TABLE "channel_member" DROP CONSTRAINT "FK_c0e555240770b2a13a82da4db6e"`
    );
    await queryRunner.query(
      `ALTER TABLE "channel_member" DROP CONSTRAINT "FK_acb34f60dda89d12956feeedbf4"`
    );
    await queryRunner.query(`DROP TABLE "channel_member"`);
    await queryRunner.query(`DROP TYPE "public"."channel_member_role_enum"`);
  }
}

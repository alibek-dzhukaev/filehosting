import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateChannelTable1742553590909 implements MigrationInterface {
  name = 'CreateChannelTable1742553590909';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."channel_type_enum" AS ENUM('public', 'private', 'direct')`
    );
    await queryRunner.query(
      `CREATE TABLE "channel" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying, "type" "public"."channel_type_enum" NOT NULL DEFAULT 'public', "create_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP, "owner_id" character varying NOT NULL, "is_archived" boolean NOT NULL DEFAULT false, "is_readonly" boolean NOT NULL DEFAULT false, "invite_link" character varying, "avatar" character varying, "tags" text array, CONSTRAINT "PK_590f33ee6ee7d76437acf362e39" PRIMARY KEY ("id"))`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "channel"`);
    await queryRunner.query(`DROP TYPE "public"."channel_type_enum"`);
  }
}

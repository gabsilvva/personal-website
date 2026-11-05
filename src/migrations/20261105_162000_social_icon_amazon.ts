import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_settings_socials_icon" ADD VALUE 'amazon' BEFORE 'devto';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "settings_socials" ALTER COLUMN "icon" SET DATA TYPE text;
  UPDATE "settings_socials" SET "icon" = NULL WHERE "icon" = 'amazon';
  DROP TYPE "public"."enum_settings_socials_icon";
  CREATE TYPE "public"."enum_settings_socials_icon" AS ENUM('cv', 'whatsapp', 'reddit', 'spotify', 'devto', 'dribbble', 'github', 'linkedin', 'x', 'instagram', 'strava', 'setup');
  ALTER TABLE "settings_socials" ALTER COLUMN "icon" SET DATA TYPE "public"."enum_settings_socials_icon" USING "icon"::"public"."enum_settings_socials_icon";`)
}

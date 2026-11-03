import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Media alt text becomes translatable and required, with a description for every image of the
 * site (matched by file name, since ids differ between databases). Scheduled publishing is off,
 * so the jobs tables it used are dropped. Hand-edited so no alt text is lost.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "media_locales" (
  	"alt" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );

  -- Every image keeps its current text in Portuguese (or its file name, when it had none)
  INSERT INTO "media_locales" ("alt", "_locale", "_parent_id")
    SELECT COALESCE(NULLIF(trim("alt"), ''), regexp_replace("filename", '\\.[^.]+$', '')), 'pt', "id" FROM "media";

  -- Descriptions of the site's images, in both languages
  WITH texts ("filename", "pt", "en") AS (VALUES
    ('portrait-5.png', 'Ilustração de Gabriel da Silva de camiseta branca, com tatuagens no pescoço e no braço', 'Illustration of Gabriel da Silva in a white T-shirt, with tattoos on his neck and arm'),
    ('me-john.png', 'Retrato artístico de Gabriel da Silva em preto e branco, com coroa, auréola e estrelas desenhadas', 'Artistic black and white portrait of Gabriel da Silva with a hand-drawn crown, halo and stars'),
    ('face.png', 'Rosto de Gabriel da Silva em preto e branco', 'Close-up of Gabriel da Silva''s face in black and white'),
    ('Ellipse 2.png', 'Foto de perfil de Gabriel da Silva', 'Profile photo of Gabriel da Silva'),
    ('cat-5.png', 'Foto do gato do Gabriel', 'Photo of Gabriel''s cat'),
    ('memoji-5.png', 'Memoji do Gabriel de óculos, fazendo sinal de positivo', 'Gabriel''s Memoji wearing glasses and giving a thumbs up'),
    ('logo-l0gik-5.svg', 'Logo da L0gik', 'L0gik logo'),
    ('logo-fullcycle-5.png', 'Logo da Full Cycle', 'Full Cycle logo'),
    ('logo-brinov-5.svg', 'Logo da Brinov', 'Brinov logo'),
    ('opengraph-5.jpg', 'GAB.S — Gabriel da Silva, Design Engineer e Desenvolvedor Full Stack', 'GAB.S — Gabriel da Silva, Design Engineer & Full Stack Developer'),
    ('project-kritica-5.png', 'Tela da Kritica, plataforma de reviews de jogos, com o logo em destaque', 'Kritica, a game review platform, with its logo in front'),
    ('project-brinov-5.png', 'Home do site da Brinov, consultoria de TI, com o logo em destaque', 'Homepage of the Brinov IT consultancy website, with its logo in front'),
    ('project-broot-5.png', 'Logo do Broot sobre um degradê roxo e azul', 'Broot logo over a purple and blue gradient'),
    ('project-issue-helper-5.png', 'Painel de chamados do Issue Helper, com o logo em destaque', 'Issue Helper ticket dashboard, with its logo in front'),
    ('project-logicos-5.png', 'Home do site da Lógicos, logística para marcas digitais, com o logo em destaque', 'Homepage of Lógicos, logistics for digital brands, with its logo in front'),
    ('project-cms-5.png', 'Painel de gestão de conteúdo com lista de empreendimentos e o texto CMS em destaque', 'Content management dashboard listing real estate projects, with the word CMS in front')
  ),
  pt AS (
    UPDATE "media_locales" l SET "alt" = t."pt"
    FROM "media" m JOIN texts t ON t."filename" = m."filename"
    WHERE l."_parent_id" = m."id" AND l."_locale" = 'pt'
  )
  INSERT INTO "media_locales" ("alt", "_locale", "_parent_id")
    SELECT t."en", 'en', m."id" FROM "media" m JOIN texts t ON t."filename" = m."filename";

  DROP TABLE "payload_jobs_log" CASCADE;
  DROP TABLE "payload_jobs" CASCADE;
  ALTER TABLE "media_locales" ADD CONSTRAINT "media_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "media_locales_locale_parent_id_unique" ON "media_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "media_locales_parent_id_idx" ON "media_locales" USING btree ("_parent_id");
  ALTER TABLE "media" DROP COLUMN "alt";
  DROP TYPE "public"."enum_payload_jobs_log_task_slug";
  DROP TYPE "public"."enum_payload_jobs_log_state";
  DROP TYPE "public"."enum_payload_jobs_task_slug";`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_payload_jobs_log_task_slug" AS ENUM('inline', 'schedulePublish');
  CREATE TYPE "public"."enum_payload_jobs_log_state" AS ENUM('failed', 'succeeded');
  CREATE TYPE "public"."enum_payload_jobs_task_slug" AS ENUM('inline', 'schedulePublish');
  CREATE TABLE "payload_jobs_log" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"executed_at" timestamp(3) with time zone NOT NULL,
  	"completed_at" timestamp(3) with time zone NOT NULL,
  	"task_slug" "enum_payload_jobs_log_task_slug" NOT NULL,
  	"task_i_d" varchar NOT NULL,
  	"input" jsonb,
  	"output" jsonb,
  	"state" "enum_payload_jobs_log_state" NOT NULL,
  	"error" jsonb
  );

  CREATE TABLE "payload_jobs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"input" jsonb,
  	"completed_at" timestamp(3) with time zone,
  	"total_tried" numeric DEFAULT 0,
  	"has_error" boolean DEFAULT false,
  	"error" jsonb,
  	"task_slug" "enum_payload_jobs_task_slug",
  	"queue" varchar DEFAULT 'default',
  	"wait_until" timestamp(3) with time zone,
  	"processing" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  ALTER TABLE "media" ADD COLUMN "alt" varchar;
  -- Back to a single, Portuguese alt text
  UPDATE "media" m SET "alt" = l."alt" FROM "media_locales" l WHERE l."_parent_id" = m."id" AND l."_locale" = 'pt';
  DROP TABLE "media_locales" CASCADE;
  ALTER TABLE "payload_jobs_log" ADD CONSTRAINT "payload_jobs_log_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."payload_jobs"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_jobs_log_order_idx" ON "payload_jobs_log" USING btree ("_order");
  CREATE INDEX "payload_jobs_log_parent_id_idx" ON "payload_jobs_log" USING btree ("_parent_id");
  CREATE INDEX "payload_jobs_completed_at_idx" ON "payload_jobs" USING btree ("completed_at");
  CREATE INDEX "payload_jobs_total_tried_idx" ON "payload_jobs" USING btree ("total_tried");
  CREATE INDEX "payload_jobs_has_error_idx" ON "payload_jobs" USING btree ("has_error");
  CREATE INDEX "payload_jobs_task_slug_idx" ON "payload_jobs" USING btree ("task_slug");
  CREATE INDEX "payload_jobs_queue_idx" ON "payload_jobs" USING btree ("queue");
  CREATE INDEX "payload_jobs_wait_until_idx" ON "payload_jobs" USING btree ("wait_until");
  CREATE INDEX "payload_jobs_processing_idx" ON "payload_jobs" USING btree ("processing");
  CREATE INDEX "payload_jobs_updated_at_idx" ON "payload_jobs" USING btree ("updated_at");
  CREATE INDEX "payload_jobs_created_at_idx" ON "payload_jobs" USING btree ("created_at");`)
}

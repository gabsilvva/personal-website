import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Links can point to a site page, a text page or any URL; the blog (posts, categories, search)
 * is gone and the menu's "Artigos" now opens the DEV.to profile; "Equipamentos" is now "Vida"
 * at /vida. Hand-edited around the generated SQL so no content is lost.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Menu: link type first, so "Artigos" leaves the 'articles' page before that option is removed
  await db.execute(sql`
   CREATE TYPE "public"."enum_header_nav_items_type" AS ENUM('page', 'document', 'custom');
  ALTER TABLE "header_nav_items" ADD COLUMN "type" "enum_header_nav_items_type" DEFAULT 'page';
  ALTER TABLE "header_nav_items_locales" ADD COLUMN "url" varchar;
  ALTER TABLE "header_nav_items" ALTER COLUMN "page" DROP NOT NULL;
  UPDATE "header_nav_items" SET "type" = 'custom', "page" = NULL, "soon" = false WHERE "page" = 'articles';
  UPDATE "header_nav_items_locales" AS l
    SET "url" = COALESCE(
      (SELECT sl."url" FROM "settings_socials" s
        JOIN "settings_socials_locales" sl ON sl."_parent_id" = s."id" AND sl."_locale" = 'pt'
        WHERE s."icon" = 'devto' ORDER BY s."_order" LIMIT 1),
      'https://dev.to/'
    )
    FROM "header_nav_items" i
    WHERE l."_parent_id" = i."id" AND i."type" = 'custom' AND l."_locale" = 'pt';`)

  await db.execute(sql`
   CREATE TYPE "public"."enum_home_page_projects_button_type" AS ENUM('page', 'document', 'custom');
  CREATE TYPE "public"."enum_home_page_projects_button_page" AS ENUM('home', 'projects', 'about', 'uses');
  CREATE TYPE "public"."enum_home_page_about_link_type" AS ENUM('page', 'document', 'custom');
  CREATE TYPE "public"."enum_home_page_about_link_page" AS ENUM('home', 'projects', 'about', 'uses');
  CREATE TYPE "public"."enum__home_page_v_version_projects_button_type" AS ENUM('page', 'document', 'custom');
  CREATE TYPE "public"."enum__home_page_v_version_projects_button_page" AS ENUM('home', 'projects', 'about', 'uses');
  CREATE TYPE "public"."enum__home_page_v_version_about_link_type" AS ENUM('page', 'document', 'custom');
  CREATE TYPE "public"."enum__home_page_v_version_about_link_page" AS ENUM('home', 'projects', 'about', 'uses');
  CREATE TYPE "public"."enum_footer_legal_links_type" AS ENUM('page', 'document', 'custom');
  CREATE TYPE "public"."enum_footer_legal_links_page" AS ENUM('home', 'projects', 'about', 'uses');
  CREATE TABLE "footer_legal_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"type" "enum_footer_legal_links_type" DEFAULT 'document',
  	"page" "enum_footer_legal_links_page",
  	"document_id" integer
  );
  
  CREATE TABLE "footer_legal_links_locales" (
  	"label" varchar,
  	"url" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );

  -- The legal links were a relationship (footer_rels, dropped below): keep them as text-page links
  INSERT INTO "footer_legal_links" ("_order", "_parent_id", "id", "type", "document_id")
    SELECT "order", "parent_id", substr(md5(random()::text || "id"::text), 1, 24), 'document', "pages_id"
    FROM "footer_rels" WHERE "path" = 'legalLinks' AND "pages_id" IS NOT NULL;

  ALTER TABLE "posts_populated_authors" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_version_populated_authors" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "categories_breadcrumbs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "categories" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "search_categories" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "search" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "search_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "search_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "footer_rels" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "posts_populated_authors" CASCADE;
  DROP TABLE "posts" CASCADE;
  DROP TABLE "posts_locales" CASCADE;
  DROP TABLE "posts_rels" CASCADE;
  DROP TABLE "_posts_v_version_populated_authors" CASCADE;
  DROP TABLE "_posts_v" CASCADE;
  DROP TABLE "_posts_v_locales" CASCADE;
  DROP TABLE "_posts_v_rels" CASCADE;
  DROP TABLE "categories_breadcrumbs" CASCADE;
  DROP TABLE "categories" CASCADE;
  DROP TABLE "search_categories" CASCADE;
  DROP TABLE "search" CASCADE;
  DROP TABLE "search_locales" CASCADE;
  DROP TABLE "search_rels" CASCADE;
  DROP TABLE "footer_rels" CASCADE;
  ALTER TABLE "redirects_rels" DROP CONSTRAINT IF EXISTS "redirects_rels_posts_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_posts_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_categories_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_search_fk";
  
  ALTER TABLE "header_nav_items" ALTER COLUMN "page" SET DATA TYPE text;
  DROP TYPE "public"."enum_header_nav_items_page";
  CREATE TYPE "public"."enum_header_nav_items_page" AS ENUM('home', 'projects', 'about', 'uses');
  ALTER TABLE "header_nav_items" ALTER COLUMN "page" SET DATA TYPE "public"."enum_header_nav_items_page" USING "page"::"public"."enum_header_nav_items_page";
  DROP INDEX IF EXISTS "redirects_rels_posts_id_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_posts_id_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_categories_id_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_search_id_idx";
  ALTER TABLE "uses_page_locales" ALTER COLUMN "subtitle" SET DEFAULT 'Vida';
  ALTER TABLE "_uses_page_v_locales" ALTER COLUMN "version_subtitle" SET DEFAULT 'Vida';
  ALTER TABLE "home_page" ADD COLUMN "projects_button_type" "enum_home_page_projects_button_type" DEFAULT 'page';
  ALTER TABLE "home_page" ADD COLUMN "projects_button_page" "enum_home_page_projects_button_page" DEFAULT 'projects';
  ALTER TABLE "home_page" ADD COLUMN "projects_button_document_id" integer;
  ALTER TABLE "home_page" ADD COLUMN "about_link_type" "enum_home_page_about_link_type" DEFAULT 'page';
  ALTER TABLE "home_page" ADD COLUMN "about_link_page" "enum_home_page_about_link_page" DEFAULT 'about';
  ALTER TABLE "home_page" ADD COLUMN "about_link_document_id" integer;
  ALTER TABLE "home_page_locales" ADD COLUMN "projects_button_url" varchar;
  ALTER TABLE "home_page_locales" ADD COLUMN "about_link_url" varchar;
  ALTER TABLE "_home_page_v" ADD COLUMN "version_projects_button_type" "enum__home_page_v_version_projects_button_type" DEFAULT 'page';
  ALTER TABLE "_home_page_v" ADD COLUMN "version_projects_button_page" "enum__home_page_v_version_projects_button_page" DEFAULT 'projects';
  ALTER TABLE "_home_page_v" ADD COLUMN "version_projects_button_document_id" integer;
  ALTER TABLE "_home_page_v" ADD COLUMN "version_about_link_type" "enum__home_page_v_version_about_link_type" DEFAULT 'page';
  ALTER TABLE "_home_page_v" ADD COLUMN "version_about_link_page" "enum__home_page_v_version_about_link_page" DEFAULT 'about';
  ALTER TABLE "_home_page_v" ADD COLUMN "version_about_link_document_id" integer;
  ALTER TABLE "_home_page_v_locales" ADD COLUMN "version_projects_button_url" varchar;
  ALTER TABLE "_home_page_v_locales" ADD COLUMN "version_about_link_url" varchar;
  ALTER TABLE "settings_locales" ADD COLUMN "hire_url" varchar;
  ALTER TABLE "header_nav_items" ADD COLUMN "document_id" integer;
  ALTER TABLE "footer_legal_links" ADD CONSTRAINT "footer_legal_links_document_id_pages_id_fk" FOREIGN KEY ("document_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "footer_legal_links" ADD CONSTRAINT "footer_legal_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_legal_links_locales" ADD CONSTRAINT "footer_legal_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_legal_links"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "footer_legal_links_order_idx" ON "footer_legal_links" USING btree ("_order");
  CREATE INDEX "footer_legal_links_parent_id_idx" ON "footer_legal_links" USING btree ("_parent_id");
  CREATE INDEX "footer_legal_links_document_idx" ON "footer_legal_links" USING btree ("document_id");
  CREATE UNIQUE INDEX "footer_legal_links_locales_locale_parent_id_unique" ON "footer_legal_links_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "footer_legal_links_locales_parent_id_idx" ON "footer_legal_links_locales" USING btree ("_parent_id");
  ALTER TABLE "home_page" ADD CONSTRAINT "home_page_projects_button_document_id_pages_id_fk" FOREIGN KEY ("projects_button_document_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_page" ADD CONSTRAINT "home_page_about_link_document_id_pages_id_fk" FOREIGN KEY ("about_link_document_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_home_page_v" ADD CONSTRAINT "_home_page_v_version_projects_button_document_id_pages_id_fk" FOREIGN KEY ("version_projects_button_document_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_home_page_v" ADD CONSTRAINT "_home_page_v_version_about_link_document_id_pages_id_fk" FOREIGN KEY ("version_about_link_document_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "header_nav_items" ADD CONSTRAINT "header_nav_items_document_id_pages_id_fk" FOREIGN KEY ("document_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "home_page_projects_button_projects_button_document_idx" ON "home_page" USING btree ("projects_button_document_id");
  CREATE INDEX "home_page_about_link_about_link_document_idx" ON "home_page" USING btree ("about_link_document_id");
  CREATE INDEX "_home_page_v_version_projects_button_version_projects_bu_idx" ON "_home_page_v" USING btree ("version_projects_button_document_id");
  CREATE INDEX "_home_page_v_version_about_link_version_about_link_docum_idx" ON "_home_page_v" USING btree ("version_about_link_document_id");
  CREATE INDEX "header_nav_items_document_idx" ON "header_nav_items" USING btree ("document_id");
  ALTER TABLE "redirects_rels" DROP COLUMN "posts_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "posts_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "categories_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "search_id";
  DROP TYPE "public"."enum_posts_status";
  DROP TYPE "public"."enum__posts_v_version_status";
  DROP TYPE "public"."enum__posts_v_published_locale";`)

  // "Equipamentos" (and the menu's "Usos") is now "Vida", at /vida, in the page and its drafts
  await db.execute(sql`
   UPDATE "uses_page_locales" SET "subtitle" = 'Vida' WHERE "_locale" = 'pt' AND "subtitle" = 'Equipamentos';
  UPDATE "uses_page_locales" SET "meta_title" = replace("meta_title", 'Equipamentos', 'Vida') WHERE "_locale" = 'pt';
  UPDATE "_uses_page_v_locales" SET "version_subtitle" = 'Vida' WHERE "_locale" = 'pt' AND "version_subtitle" = 'Equipamentos';
  UPDATE "_uses_page_v_locales" SET "version_meta_title" = replace("version_meta_title", 'Equipamentos', 'Vida') WHERE "_locale" = 'pt';
  UPDATE "header_nav_items_locales" AS l SET "label" = 'Vida'
    FROM "header_nav_items" i
    WHERE l."_parent_id" = i."id" AND i."page" = 'uses' AND l."_locale" = 'pt';
  UPDATE "settings_socials_locales" SET "url" = '/vida' WHERE "url" = '/equipamentos';`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_posts_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__posts_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__posts_v_published_locale" AS ENUM('pt', 'en');
  ALTER TYPE "public"."enum_header_nav_items_page" ADD VALUE 'articles';
  CREATE TABLE "posts_populated_authors" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar
  );
  
  CREATE TABLE "posts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"hero_image_id" integer,
  	"content" jsonb,
  	"published_at" timestamp(3) with time zone,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_posts_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "posts_locales" (
  	"meta_title" varchar,
  	"meta_image_id" integer,
  	"meta_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "posts_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"posts_id" integer,
  	"categories_id" integer,
  	"users_id" integer
  );
  
  CREATE TABLE "_posts_v_version_populated_authors" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"name" varchar
  );
  
  CREATE TABLE "_posts_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_hero_image_id" integer,
  	"version_content" jsonb,
  	"version_published_at" timestamp(3) with time zone,
  	"version_generate_slug" boolean DEFAULT true,
  	"version_slug" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__posts_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__posts_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_posts_v_locales" (
  	"version_meta_title" varchar,
  	"version_meta_image_id" integer,
  	"version_meta_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_posts_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"posts_id" integer,
  	"categories_id" integer,
  	"users_id" integer
  );
  
  CREATE TABLE "categories_breadcrumbs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"doc_id" integer,
  	"url" varchar,
  	"label" varchar
  );
  
  CREATE TABLE "categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar NOT NULL,
  	"parent_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "search_categories" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"relation_to" varchar,
  	"category_i_d" varchar,
  	"title" varchar
  );
  
  CREATE TABLE "search" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"priority" numeric,
  	"slug" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "search_locales" (
  	"title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "search_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"posts_id" integer
  );
  
  CREATE TABLE "footer_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer
  );
  
  ALTER TABLE "footer_legal_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "footer_legal_links_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "footer_legal_links" CASCADE;
  DROP TABLE "footer_legal_links_locales" CASCADE;
  ALTER TABLE "home_page" DROP CONSTRAINT "home_page_projects_button_document_id_pages_id_fk";
  
  ALTER TABLE "home_page" DROP CONSTRAINT "home_page_about_link_document_id_pages_id_fk";
  
  ALTER TABLE "_home_page_v" DROP CONSTRAINT "_home_page_v_version_projects_button_document_id_pages_id_fk";
  
  ALTER TABLE "_home_page_v" DROP CONSTRAINT "_home_page_v_version_about_link_document_id_pages_id_fk";
  
  ALTER TABLE "header_nav_items" DROP CONSTRAINT "header_nav_items_document_id_pages_id_fk";
  
  DROP INDEX "home_page_projects_button_projects_button_document_idx";
  DROP INDEX "home_page_about_link_about_link_document_idx";
  DROP INDEX "_home_page_v_version_projects_button_version_projects_bu_idx";
  DROP INDEX "_home_page_v_version_about_link_version_about_link_docum_idx";
  DROP INDEX "header_nav_items_document_idx";
  ALTER TABLE "uses_page_locales" ALTER COLUMN "subtitle" SET DEFAULT 'Equipamentos';
  ALTER TABLE "_uses_page_v_locales" ALTER COLUMN "version_subtitle" SET DEFAULT 'Equipamentos';
  ALTER TABLE "header_nav_items" ALTER COLUMN "page" SET NOT NULL;
  ALTER TABLE "redirects_rels" ADD COLUMN "posts_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "posts_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "categories_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "search_id" integer;
  ALTER TABLE "posts_populated_authors" ADD CONSTRAINT "posts_populated_authors_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts_locales" ADD CONSTRAINT "posts_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts_locales" ADD CONSTRAINT "posts_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_version_populated_authors" ADD CONSTRAINT "_posts_v_version_populated_authors_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_parent_id_posts_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."posts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v_locales" ADD CONSTRAINT "_posts_v_locales_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v_locales" ADD CONSTRAINT "_posts_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "categories_breadcrumbs" ADD CONSTRAINT "categories_breadcrumbs_doc_id_categories_id_fk" FOREIGN KEY ("doc_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "categories_breadcrumbs" ADD CONSTRAINT "categories_breadcrumbs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "categories" ADD CONSTRAINT "categories_parent_id_categories_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "search_categories" ADD CONSTRAINT "search_categories_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."search"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "search" ADD CONSTRAINT "search_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "search_locales" ADD CONSTRAINT "search_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."search"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "search_rels" ADD CONSTRAINT "search_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."search"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "search_rels" ADD CONSTRAINT "search_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_rels" ADD CONSTRAINT "footer_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_rels" ADD CONSTRAINT "footer_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "posts_populated_authors_order_idx" ON "posts_populated_authors" USING btree ("_order");
  CREATE INDEX "posts_populated_authors_parent_id_idx" ON "posts_populated_authors" USING btree ("_parent_id");
  CREATE INDEX "posts_hero_image_idx" ON "posts" USING btree ("hero_image_id");
  CREATE UNIQUE INDEX "posts_slug_idx" ON "posts" USING btree ("slug");
  CREATE INDEX "posts_updated_at_idx" ON "posts" USING btree ("updated_at");
  CREATE INDEX "posts_created_at_idx" ON "posts" USING btree ("created_at");
  CREATE INDEX "posts__status_idx" ON "posts" USING btree ("_status");
  CREATE INDEX "posts_meta_meta_image_idx" ON "posts_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "posts_locales_locale_parent_id_unique" ON "posts_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "posts_locales_parent_id_idx" ON "posts_locales" USING btree ("_parent_id");
  CREATE INDEX "posts_rels_order_idx" ON "posts_rels" USING btree ("order");
  CREATE INDEX "posts_rels_parent_idx" ON "posts_rels" USING btree ("parent_id");
  CREATE INDEX "posts_rels_path_idx" ON "posts_rels" USING btree ("path");
  CREATE INDEX "posts_rels_posts_id_idx" ON "posts_rels" USING btree ("posts_id");
  CREATE INDEX "posts_rels_categories_id_idx" ON "posts_rels" USING btree ("categories_id");
  CREATE INDEX "posts_rels_users_id_idx" ON "posts_rels" USING btree ("users_id");
  CREATE INDEX "_posts_v_version_populated_authors_order_idx" ON "_posts_v_version_populated_authors" USING btree ("_order");
  CREATE INDEX "_posts_v_version_populated_authors_parent_id_idx" ON "_posts_v_version_populated_authors" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_parent_idx" ON "_posts_v" USING btree ("parent_id");
  CREATE INDEX "_posts_v_version_version_hero_image_idx" ON "_posts_v" USING btree ("version_hero_image_id");
  CREATE INDEX "_posts_v_version_version_slug_idx" ON "_posts_v" USING btree ("version_slug");
  CREATE INDEX "_posts_v_version_version_updated_at_idx" ON "_posts_v" USING btree ("version_updated_at");
  CREATE INDEX "_posts_v_version_version_created_at_idx" ON "_posts_v" USING btree ("version_created_at");
  CREATE INDEX "_posts_v_version_version__status_idx" ON "_posts_v" USING btree ("version__status");
  CREATE INDEX "_posts_v_created_at_idx" ON "_posts_v" USING btree ("created_at");
  CREATE INDEX "_posts_v_updated_at_idx" ON "_posts_v" USING btree ("updated_at");
  CREATE INDEX "_posts_v_snapshot_idx" ON "_posts_v" USING btree ("snapshot");
  CREATE INDEX "_posts_v_published_locale_idx" ON "_posts_v" USING btree ("published_locale");
  CREATE INDEX "_posts_v_latest_idx" ON "_posts_v" USING btree ("latest");
  CREATE INDEX "_posts_v_autosave_idx" ON "_posts_v" USING btree ("autosave");
  CREATE INDEX "_posts_v_version_meta_version_meta_image_idx" ON "_posts_v_locales" USING btree ("version_meta_image_id","_locale");
  CREATE UNIQUE INDEX "_posts_v_locales_locale_parent_id_unique" ON "_posts_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_posts_v_locales_parent_id_idx" ON "_posts_v_locales" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_rels_order_idx" ON "_posts_v_rels" USING btree ("order");
  CREATE INDEX "_posts_v_rels_parent_idx" ON "_posts_v_rels" USING btree ("parent_id");
  CREATE INDEX "_posts_v_rels_path_idx" ON "_posts_v_rels" USING btree ("path");
  CREATE INDEX "_posts_v_rels_posts_id_idx" ON "_posts_v_rels" USING btree ("posts_id");
  CREATE INDEX "_posts_v_rels_categories_id_idx" ON "_posts_v_rels" USING btree ("categories_id");
  CREATE INDEX "_posts_v_rels_users_id_idx" ON "_posts_v_rels" USING btree ("users_id");
  CREATE INDEX "categories_breadcrumbs_order_idx" ON "categories_breadcrumbs" USING btree ("_order");
  CREATE INDEX "categories_breadcrumbs_parent_id_idx" ON "categories_breadcrumbs" USING btree ("_parent_id");
  CREATE INDEX "categories_breadcrumbs_locale_idx" ON "categories_breadcrumbs" USING btree ("_locale");
  CREATE INDEX "categories_breadcrumbs_doc_idx" ON "categories_breadcrumbs" USING btree ("doc_id");
  CREATE UNIQUE INDEX "categories_slug_idx" ON "categories" USING btree ("slug");
  CREATE INDEX "categories_parent_idx" ON "categories" USING btree ("parent_id");
  CREATE INDEX "categories_updated_at_idx" ON "categories" USING btree ("updated_at");
  CREATE INDEX "categories_created_at_idx" ON "categories" USING btree ("created_at");
  CREATE INDEX "search_categories_order_idx" ON "search_categories" USING btree ("_order");
  CREATE INDEX "search_categories_parent_id_idx" ON "search_categories" USING btree ("_parent_id");
  CREATE INDEX "search_slug_idx" ON "search" USING btree ("slug");
  CREATE INDEX "search_meta_meta_image_idx" ON "search" USING btree ("meta_image_id");
  CREATE INDEX "search_updated_at_idx" ON "search" USING btree ("updated_at");
  CREATE INDEX "search_created_at_idx" ON "search" USING btree ("created_at");
  CREATE UNIQUE INDEX "search_locales_locale_parent_id_unique" ON "search_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "search_locales_parent_id_idx" ON "search_locales" USING btree ("_parent_id");
  CREATE INDEX "search_rels_order_idx" ON "search_rels" USING btree ("order");
  CREATE INDEX "search_rels_parent_idx" ON "search_rels" USING btree ("parent_id");
  CREATE INDEX "search_rels_path_idx" ON "search_rels" USING btree ("path");
  CREATE INDEX "search_rels_posts_id_idx" ON "search_rels" USING btree ("posts_id");
  CREATE INDEX "footer_rels_order_idx" ON "footer_rels" USING btree ("order");
  CREATE INDEX "footer_rels_parent_idx" ON "footer_rels" USING btree ("parent_id");
  CREATE INDEX "footer_rels_path_idx" ON "footer_rels" USING btree ("path");
  CREATE INDEX "footer_rels_pages_id_idx" ON "footer_rels" USING btree ("pages_id");
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_search_fk" FOREIGN KEY ("search_id") REFERENCES "public"."search"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "redirects_rels_posts_id_idx" ON "redirects_rels" USING btree ("posts_id");
  CREATE INDEX "payload_locked_documents_rels_posts_id_idx" ON "payload_locked_documents_rels" USING btree ("posts_id");
  CREATE INDEX "payload_locked_documents_rels_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("categories_id");
  CREATE INDEX "payload_locked_documents_rels_search_id_idx" ON "payload_locked_documents_rels" USING btree ("search_id");
  ALTER TABLE "home_page" DROP COLUMN "projects_button_type";
  ALTER TABLE "home_page" DROP COLUMN "projects_button_page";
  ALTER TABLE "home_page" DROP COLUMN "projects_button_document_id";
  ALTER TABLE "home_page" DROP COLUMN "about_link_type";
  ALTER TABLE "home_page" DROP COLUMN "about_link_page";
  ALTER TABLE "home_page" DROP COLUMN "about_link_document_id";
  ALTER TABLE "home_page_locales" DROP COLUMN "projects_button_url";
  ALTER TABLE "home_page_locales" DROP COLUMN "about_link_url";
  ALTER TABLE "_home_page_v" DROP COLUMN "version_projects_button_type";
  ALTER TABLE "_home_page_v" DROP COLUMN "version_projects_button_page";
  ALTER TABLE "_home_page_v" DROP COLUMN "version_projects_button_document_id";
  ALTER TABLE "_home_page_v" DROP COLUMN "version_about_link_type";
  ALTER TABLE "_home_page_v" DROP COLUMN "version_about_link_page";
  ALTER TABLE "_home_page_v" DROP COLUMN "version_about_link_document_id";
  ALTER TABLE "_home_page_v_locales" DROP COLUMN "version_projects_button_url";
  ALTER TABLE "_home_page_v_locales" DROP COLUMN "version_about_link_url";
  ALTER TABLE "settings_locales" DROP COLUMN "hire_url";
  ALTER TABLE "header_nav_items" DROP COLUMN "type";
  ALTER TABLE "header_nav_items" DROP COLUMN "document_id";
  ALTER TABLE "header_nav_items_locales" DROP COLUMN "url";
  DROP TYPE "public"."enum_home_page_projects_button_type";
  DROP TYPE "public"."enum_home_page_projects_button_page";
  DROP TYPE "public"."enum_home_page_about_link_type";
  DROP TYPE "public"."enum_home_page_about_link_page";
  DROP TYPE "public"."enum__home_page_v_version_projects_button_type";
  DROP TYPE "public"."enum__home_page_v_version_projects_button_page";
  DROP TYPE "public"."enum__home_page_v_version_about_link_type";
  DROP TYPE "public"."enum__home_page_v_version_about_link_page";
  DROP TYPE "public"."enum_header_nav_items_type";
  DROP TYPE "public"."enum_footer_legal_links_type";
  DROP TYPE "public"."enum_footer_legal_links_page";`)
}

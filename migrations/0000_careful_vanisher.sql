DO $$ BEGIN
 CREATE TYPE "book_availabality" AS ENUM('Free', 'Paid');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "book_language" AS ENUM('English', 'Spanish', 'French', 'German', 'Chinese', 'Russian', 'Japanese', 'Arabic', 'Hindi', 'Portuguese', 'Bengali', 'Urdu', 'Indonesian', 'Italian', 'Dutch', 'Turkish', 'Korean', 'Vietnamese', 'Polish', 'Thai');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "book_status" AS ENUM('draft', 'published');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "authors" (
	"clerk_id" varchar(255) PRIMARY KEY NOT NULL,
	"author_name" varchar(120) NOT NULL,
	"author_image" varchar(255),
	"bio" varchar(255) NOT NULL,
	"artist_genres" json NOT NULL,
	"confirmed_email" varchar(255) NOT NULL,
	"is_confirmed" boolean DEFAULT false,
	"secret_key" varchar(255) NOT NULL,
	"stars" integer DEFAULT 0,
	"instagram" varchar(255),
	"twitter" varchar(255),
	"joined_on" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "books" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"clerk_id" varchar(255) NOT NULL,
	"book_name" varchar(70) NOT NULL,
	"content" json,
	"synopsis" text,
	"normalised_title" varchar(100) NOT NULL,
	"front_artwork" varchar(255),
	"back_artwork" varchar(255),
	"status" "book_status" NOT NULL,
	"genres" json,
	"language" "book_language" NOT NULL,
	"availability" "book_availabality",
	"pricing" numeric(10, 2),
	"series" json DEFAULT '[]'::json NOT NULL,
	"collaborations" json,
	"stars" integer DEFAULT 0,
	"rated_by" integer DEFAULT 0,
	"purchase_count" integer DEFAULT 0,
	"publication_date" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "books_book_name_unique" UNIQUE("book_name"),
	CONSTRAINT "books_normalised_title_unique" UNIQUE("normalised_title")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "forum_posts" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"clerk_id" varchar(255) NOT NULL,
	"is_author" boolean DEFAULT false,
	"post_title" varchar(70) NOT NULL,
	"post_content" json NOT NULL,
	"post_image" varchar(255),
	"tags" json,
	"likes" json,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "forum_posts_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "rated_authors" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"clerk_id" varchar(255) NOT NULL,
	"author_id" varchar(255) NOT NULL,
	"author_name" varchar(70) NOT NULL,
	"stars" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "rated_authors_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "rated_books" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"clerk_id" varchar(255) NOT NULL,
	"book_id" varchar(255) NOT NULL,
	"book_name" varchar(70) NOT NULL,
	"stars" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "rated_books_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"clerk_id" varchar(255) PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"first_name" varchar(50) NOT NULL,
	"last_name" varchar(70) NOT NULL,
	"user_name" varchar(50),
	"image_url" varchar(255),
	"strategy" varchar(50) NOT NULL,
	"is_author" boolean DEFAULT false,
	"purchased_books" json DEFAULT '[]'::json,
	"stripe_customer_id" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "clerk_idx" ON "authors" ("clerk_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "book_idx" ON "books" ("book_name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "clerk_idx" ON "books" ("clerk_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "post_idx" ON "forum_posts" ("id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "clerk_idx" ON "forum_posts" ("clerk_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "title_idx" ON "forum_posts" ("post_title");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "book_idx" ON "rated_authors" ("id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "author_idx" ON "rated_authors" ("clerk_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "book_idx" ON "rated_books" ("book_name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "clerk_idx" ON "rated_books" ("clerk_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "clerk_idx" ON "users" ("clerk_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "email_idx" ON "users" ("email");
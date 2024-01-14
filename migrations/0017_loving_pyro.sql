ALTER TABLE `likes` ADD `liked_books` json NOT NULL;--> statement-breakpoint
ALTER TABLE `likes` ADD `liked_authors` json NOT NULL;--> statement-breakpoint
ALTER TABLE `likes` DROP COLUMN `created_at`;
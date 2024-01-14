ALTER TABLE `likes` RENAME COLUMN `updated_at` TO `created_at`;--> statement-breakpoint
ALTER TABLE `likes` MODIFY COLUMN `created_at` timestamp NOT NULL DEFAULT (now());--> statement-breakpoint
ALTER TABLE `likes` ADD `book_id` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `likes` ADD `book_name` varchar(70) NOT NULL;--> statement-breakpoint
ALTER TABLE `likes` ADD `stars` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `likes` DROP COLUMN `liked_books`;--> statement-breakpoint
ALTER TABLE `likes` DROP COLUMN `liked_authors`;
ALTER TABLE `authors` MODIFY COLUMN `genres` json NOT NULL;--> statement-breakpoint
ALTER TABLE `books` ADD `genres` json NOT NULL;
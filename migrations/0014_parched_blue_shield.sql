ALTER TABLE `books` MODIFY COLUMN `availabality` enum('Free','Paid');--> statement-breakpoint
ALTER TABLE `books` ADD `synopsis` text;
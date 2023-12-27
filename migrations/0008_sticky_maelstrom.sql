ALTER TABLE `books` MODIFY COLUMN `status` enum('draft','published') NOT NULL;--> statement-breakpoint
ALTER TABLE `books` MODIFY COLUMN `genres` json;--> statement-breakpoint
ALTER TABLE `books` MODIFY COLUMN `publication_date` timestamp;--> statement-breakpoint
ALTER TABLE `books` ADD `front_artwork` varchar(255);--> statement-breakpoint
ALTER TABLE `books` ADD `back_artwork` varchar(255);--> statement-breakpoint
ALTER TABLE `books` ADD `language` enum('English','Spanish','French','German','Chinese','Russian','Japanese','Arabic','Hindi','Portuguese','Bengali','Urdu','Indonesian','Italian','Dutch','Turkish','Korean','Vietnamese','Polish','Thai') NOT NULL;--> statement-breakpoint
ALTER TABLE `books` ADD `availabality` enum('free','paid');--> statement-breakpoint
ALTER TABLE `books` ADD `pricing` decimal(10,2);--> statement-breakpoint
ALTER TABLE `books` ADD `series` varchar(150) NOT NULL;--> statement-breakpoint
ALTER TABLE `books` ADD `collaborations` json;
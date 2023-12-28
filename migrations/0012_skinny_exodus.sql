ALTER TABLE `books` ADD `normalised_title` varchar(100) NOT NULL;--> statement-breakpoint
ALTER TABLE `books` ADD CONSTRAINT `books_normalised_title_unique` UNIQUE(`normalised_title`);
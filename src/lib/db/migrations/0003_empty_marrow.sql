CREATE TABLE `authors` (
	`clerk_id` varchar(255) NOT NULL,
	`author_name` varchar(120) NOT NULL,
	`author_image` varchar(255),
	`stars` int DEFAULT 0,
	`joined_on` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `authors_clerk_id` PRIMARY KEY(`clerk_id`)
);
--> statement-breakpoint
CREATE TABLE `books` (
	`id` varchar(255) NOT NULL,
	`clerk_id` varchar(255) NOT NULL,
	`book_name` varchar(70) NOT NULL,
	`status` enum('draft','published'),
	`stars` int DEFAULT 0,
	`publication_date` timestamp DEFAULT (now()),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `books_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `likes` (
	`clerk_id` varchar(255) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `likes_clerk_id` PRIMARY KEY(`clerk_id`)
);
--> statement-breakpoint
ALTER TABLE `users` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `users` ADD `is_author` boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `id`;--> statement-breakpoint
ALTER TABLE `users` ADD PRIMARY KEY(`clerk_id`);
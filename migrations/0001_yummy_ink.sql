CREATE TABLE `forum_posts` (
	`id` varchar(255) NOT NULL,
	`clerk_id` varchar(255),
	`is_author` boolean DEFAULT false,
	`post_title` varchar(70) NOT NULL,
	`post_content` json,
	`post_image` varchar(255),
	`tags` json,
	CONSTRAINT `forum_posts_id` PRIMARY KEY(`id`),
	CONSTRAINT `forum_posts_id_unique` UNIQUE(`id`)
);
--> statement-breakpoint
ALTER TABLE `rated_authors` MODIFY COLUMN `clerk_id` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `rated_books` MODIFY COLUMN `clerk_id` varchar(255) NOT NULL;
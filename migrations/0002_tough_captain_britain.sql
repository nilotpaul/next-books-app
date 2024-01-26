ALTER TABLE `forum_posts` MODIFY COLUMN `clerk_id` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `forum_posts` MODIFY COLUMN `post_content` json NOT NULL;--> statement-breakpoint
ALTER TABLE `forum_posts` ADD `likes` json;--> statement-breakpoint
ALTER TABLE `forum_posts` ADD `created_at` timestamp DEFAULT (now()) NOT NULL;--> statement-breakpoint
CREATE INDEX `book_idx` ON `books` (`book_name`);--> statement-breakpoint
CREATE INDEX `clerk_idx` ON `books` (`clerk_id`);--> statement-breakpoint
CREATE INDEX `clerk_idx` ON `users` (`clerk_id`);--> statement-breakpoint
CREATE INDEX `email_idx` ON `users` (`email`);
ALTER TABLE `books` ADD `purchase_count` int DEFAULT 0;--> statement-breakpoint
CREATE INDEX `clerk_idx` ON `authors` (`clerk_id`);--> statement-breakpoint
CREATE INDEX `post_idx` ON `forum_posts` (`id`);--> statement-breakpoint
CREATE INDEX `clerk_idx` ON `forum_posts` (`clerk_id`);--> statement-breakpoint
CREATE INDEX `title_idx` ON `forum_posts` (`post_title`);--> statement-breakpoint
CREATE INDEX `book_idx` ON `rated_authors` (`id`);--> statement-breakpoint
CREATE INDEX `author_idx` ON `rated_authors` (`clerk_id`);--> statement-breakpoint
CREATE INDEX `book_idx` ON `rated_books` (`book_name`);--> statement-breakpoint
CREATE INDEX `clerk_idx` ON `rated_books` (`clerk_id`);--> statement-breakpoint
CREATE INDEX `clerk_idx` ON `social_links` (`clerk_id`);
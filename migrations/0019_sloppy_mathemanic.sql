CREATE TABLE `liked_authors` (
	`clerk_id` varchar(255) NOT NULL,
	`author_id` varchar(255) NOT NULL,
	`author_name` varchar(70) NOT NULL,
	`stars` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `liked_authors_clerk_id` PRIMARY KEY(`clerk_id`)
);
--> statement-breakpoint
RENAME TABLE `likes` TO `liked_books`;
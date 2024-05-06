CREATE TABLE `authors` (
	`clerk_id` varchar(255) NOT NULL,
	`author_name` varchar(120) NOT NULL,
	`author_image` varchar(255),
	`bio` varchar(255) NOT NULL,
	`artist_genres` json NOT NULL,
	`confirmed_email` varchar(255) NOT NULL,
	`is_confirmed` boolean DEFAULT false,
	`secret_key` varchar(255) NOT NULL,
	`stars` int DEFAULT 0,
	`instagram` varchar(255),
	`twitter` varchar(255),
	`joined_on` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `authors_clerk_id` PRIMARY KEY(`clerk_id`)
);
--> statement-breakpoint
CREATE TABLE `books` (
	`id` varchar(255) NOT NULL,
	`clerk_id` varchar(255) NOT NULL,
	`book_name` varchar(70) NOT NULL,
	`content` json,
	`synopsis` text,
	`normalised_title` varchar(100) NOT NULL,
	`front_artwork` varchar(255),
	`back_artwork` varchar(255),
	`status` enum('draft','published') NOT NULL,
	`genres` json,
	`language` enum('English','Spanish','French','German','Chinese','Russian','Japanese','Arabic','Hindi','Portuguese','Bengali','Urdu','Indonesian','Italian','Dutch','Turkish','Korean','Vietnamese','Polish','Thai') NOT NULL,
	`availabality` enum('Free','Paid'),
	`pricing` decimal(10,2),
	`series` json NOT NULL DEFAULT ('[]'),
	`collaborations` json,
	`stars` int DEFAULT 0,
	`rated_by` int DEFAULT 0,
	`purchase_count` int DEFAULT 0,
	`publication_date` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `books_id` PRIMARY KEY(`id`),
	CONSTRAINT `books_book_name_unique` UNIQUE(`book_name`),
	CONSTRAINT `books_normalised_title_unique` UNIQUE(`normalised_title`)
);
--> statement-breakpoint
CREATE TABLE `forum_posts` (
	`id` varchar(255) NOT NULL,
	`clerk_id` varchar(255) NOT NULL,
	`is_author` boolean DEFAULT false,
	`post_title` varchar(70) NOT NULL,
	`post_content` json NOT NULL,
	`post_image` varchar(255),
	`tags` json,
	`likes` json,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `forum_posts_id` PRIMARY KEY(`id`),
	CONSTRAINT `forum_posts_id_unique` UNIQUE(`id`)
);
--> statement-breakpoint
CREATE TABLE `rated_authors` (
	`id` varchar(255) NOT NULL,
	`clerk_id` varchar(255) NOT NULL,
	`author_id` varchar(255) NOT NULL,
	`author_name` varchar(70) NOT NULL,
	`stars` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `rated_authors_id` PRIMARY KEY(`id`),
	CONSTRAINT `rated_authors_id_unique` UNIQUE(`id`)
);
--> statement-breakpoint
CREATE TABLE `rated_books` (
	`id` varchar(255) NOT NULL,
	`clerk_id` varchar(255) NOT NULL,
	`book_id` varchar(255) NOT NULL,
	`book_name` varchar(70) NOT NULL,
	`stars` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `rated_books_id` PRIMARY KEY(`id`),
	CONSTRAINT `rated_books_id_unique` UNIQUE(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`clerk_id` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`first_name` varchar(50) NOT NULL,
	`last_name` varchar(70) NOT NULL,
	`user_name` varchar(50),
	`image_url` varchar(255),
	`strategy` varchar(50) NOT NULL,
	`is_author` boolean DEFAULT false,
	`purchased_books` json DEFAULT ('[]'),
	`stripe_customer_id` varchar(255),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `users_clerk_id` PRIMARY KEY(`clerk_id`)
);
--> statement-breakpoint
CREATE INDEX `clerk_idx` ON `authors` (`clerk_id`);--> statement-breakpoint
CREATE INDEX `book_idx` ON `books` (`book_name`);--> statement-breakpoint
CREATE INDEX `clerk_idx` ON `books` (`clerk_id`);--> statement-breakpoint
CREATE INDEX `post_idx` ON `forum_posts` (`id`);--> statement-breakpoint
CREATE INDEX `clerk_idx` ON `forum_posts` (`clerk_id`);--> statement-breakpoint
CREATE INDEX `title_idx` ON `forum_posts` (`post_title`);--> statement-breakpoint
CREATE INDEX `book_idx` ON `rated_authors` (`id`);--> statement-breakpoint
CREATE INDEX `author_idx` ON `rated_authors` (`clerk_id`);--> statement-breakpoint
CREATE INDEX `book_idx` ON `rated_books` (`book_name`);--> statement-breakpoint
CREATE INDEX `clerk_idx` ON `rated_books` (`clerk_id`);--> statement-breakpoint
CREATE INDEX `clerk_idx` ON `users` (`clerk_id`);--> statement-breakpoint
CREATE INDEX `email_idx` ON `users` (`email`);
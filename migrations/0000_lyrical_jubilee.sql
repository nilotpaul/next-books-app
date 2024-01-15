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
	`publication_date` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `books_id` PRIMARY KEY(`id`),
	CONSTRAINT `books_book_name_unique` UNIQUE(`book_name`),
	CONSTRAINT `books_normalised_title_unique` UNIQUE(`normalised_title`)
);
--> statement-breakpoint
CREATE TABLE `rated_authors` (
	`id` varchar(255) NOT NULL,
	`clerk_id` varchar(255),
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
	`clerk_id` varchar(255),
	`book_id` varchar(255) NOT NULL,
	`book_name` varchar(70) NOT NULL,
	`stars` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `rated_books_id` PRIMARY KEY(`id`),
	CONSTRAINT `rated_books_id_unique` UNIQUE(`id`)
);
--> statement-breakpoint
CREATE TABLE `social_links` (
	`clerk_id` varchar(255) NOT NULL,
	`instagram` varchar(255),
	`twitter` varchar(255),
	`other` varchar(255),
	CONSTRAINT `social_links_clerk_id` PRIMARY KEY(`clerk_id`)
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

CREATE TABLE `users` (
	`id` varchar(255) NOT NULL,
	`clerk_id` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`first_name` varchar(50) NOT NULL,
	`last_name` varchar(70) NOT NULL,
	`user_name` varchar(50) NOT NULL,
	`image_url` varchar(255),
	`is_verified` boolean NOT NULL,
	`strategy` varchar(50) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `users_id` PRIMARY KEY(`id`)
);

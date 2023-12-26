CREATE TABLE `social_links` (
	`clerk_id` varchar(255) NOT NULL,
	`instagram` varchar(255),
	`twitter` varchar(255),
	`other` varchar(255),
	CONSTRAINT `social_links_clerk_id` PRIMARY KEY(`clerk_id`)
);

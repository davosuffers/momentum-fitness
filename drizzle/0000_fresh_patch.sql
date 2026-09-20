CREATE TABLE `Leads` (
	`id` text PRIMARY KEY NOT NULL,
	`business_name` text NOT NULL,
	`email` text NOT NULL,
	`business_url` text NOT NULL,
	`monthly_ad_spend` text NOT NULL,
	`status` text DEFAULT 'new' NOT NULL,
	`created_at` text NOT NULL
);

CREATE TABLE `access_code_modules` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`access_code_id` integer NOT NULL,
	`module_id` integer NOT NULL,
	FOREIGN KEY (`access_code_id`) REFERENCES `access_codes`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`module_id`) REFERENCES `modules`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `access_code_modules_pair_idx` ON `access_code_modules` (`access_code_id`,`module_id`);--> statement-breakpoint
CREATE INDEX `access_code_modules_code_idx` ON `access_code_modules` (`access_code_id`);--> statement-breakpoint
ALTER TABLE `access_codes` ADD `company` text;--> statement-breakpoint
ALTER TABLE `access_codes` ADD `industry` text;--> statement-breakpoint
ALTER TABLE `access_codes` ADD `contact_name` text;--> statement-breakpoint
ALTER TABLE `access_codes` ADD `contact_email` text;--> statement-breakpoint
ALTER TABLE `access_codes` ADD `notes` text;
CREATE TABLE `access_code_plans` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`access_code_id` integer NOT NULL,
	`platform_id` text NOT NULL,
	`plan_id` integer NOT NULL,
	FOREIGN KEY (`access_code_id`) REFERENCES `access_codes`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`platform_id`) REFERENCES `platforms`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`plan_id`) REFERENCES `platform_plans`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `access_code_plans_pair_idx` ON `access_code_plans` (`access_code_id`,`platform_id`);--> statement-breakpoint
CREATE INDEX `access_code_plans_code_idx` ON `access_code_plans` (`access_code_id`);
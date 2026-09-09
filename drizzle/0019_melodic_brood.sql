CREATE TABLE `platform_special_plans` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`special_id` integer NOT NULL,
	`plan_id` integer NOT NULL,
	`availability` text DEFAULT 'incluido' NOT NULL,
	`note` text,
	FOREIGN KEY (`special_id`) REFERENCES `platform_specials`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`plan_id`) REFERENCES `platform_plans`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `platform_special_plans_pair_idx` ON `platform_special_plans` (`special_id`,`plan_id`);--> statement-breakpoint
CREATE INDEX `platform_special_plans_special_idx` ON `platform_special_plans` (`special_id`);--> statement-breakpoint
CREATE INDEX `platform_special_plans_plan_idx` ON `platform_special_plans` (`plan_id`);
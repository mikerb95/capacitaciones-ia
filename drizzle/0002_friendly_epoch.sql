CREATE TABLE `access_codes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`code` text NOT NULL,
	`label` text NOT NULL,
	`active` integer DEFAULT true NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `access_codes_code_idx` ON `access_codes` (`code`);--> statement-breakpoint
CREATE TABLE `participants` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`access_code_id` integer NOT NULL,
	`name` text NOT NULL,
	`phone` text NOT NULL,
	`token` text NOT NULL,
	`last_seen_at` integer DEFAULT (unixepoch()) NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`access_code_id`) REFERENCES `access_codes`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `participants_token_idx` ON `participants` (`token`);--> statement-breakpoint
CREATE UNIQUE INDEX `participants_code_phone_idx` ON `participants` (`access_code_id`,`phone`);--> statement-breakpoint
CREATE INDEX `participants_code_idx` ON `participants` (`access_code_id`);
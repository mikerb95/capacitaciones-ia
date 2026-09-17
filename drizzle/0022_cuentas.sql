CREATE TABLE `accounts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`email` text NOT NULL,
	`name` text NOT NULL,
	`password_hash` text,
	`failed_logins` integer DEFAULT 0 NOT NULL,
	`locked_until` integer,
	`last_login_at` integer,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `accounts_email_idx` ON `accounts` (`email`);--> statement-breakpoint
CREATE TABLE `email_tokens` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`email` text NOT NULL,
	`purpose` text NOT NULL,
	`token_hash` text NOT NULL,
	`access_code_id` integer,
	`name` text,
	`password_hash` text,
	`destination` text,
	`ip_hash` text,
	`expires_at` integer NOT NULL,
	`used_at` integer,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`access_code_id`) REFERENCES `access_codes`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE UNIQUE INDEX `email_tokens_hash_idx` ON `email_tokens` (`token_hash`);--> statement-breakpoint
CREATE INDEX `email_tokens_email_idx` ON `email_tokens` (`email`,`created_at`);--> statement-breakpoint
CREATE INDEX `email_tokens_ip_idx` ON `email_tokens` (`ip_hash`,`created_at`);--> statement-breakpoint
CREATE INDEX `email_tokens_created_idx` ON `email_tokens` (`created_at`);--> statement-breakpoint
ALTER TABLE `participants` ADD `account_id` integer REFERENCES accounts(id) ON DELETE set null;--> statement-breakpoint
CREATE INDEX `participants_account_idx` ON `participants` (`account_id`);
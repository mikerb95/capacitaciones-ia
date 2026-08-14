CREATE TABLE `module_plans` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`module_id` integer NOT NULL,
	`plan_id` integer NOT NULL,
	`availability` text DEFAULT 'incluido' NOT NULL,
	`note` text,
	FOREIGN KEY (`module_id`) REFERENCES `modules`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`plan_id`) REFERENCES `platform_plans`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `module_plans_pair_idx` ON `module_plans` (`module_id`,`plan_id`);--> statement-breakpoint
CREATE INDEX `module_plans_module_idx` ON `module_plans` (`module_id`);--> statement-breakpoint
CREATE INDEX `module_plans_plan_idx` ON `module_plans` (`plan_id`);--> statement-breakpoint
CREATE TABLE `platform_model_plans` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`model_id` integer NOT NULL,
	`plan_id` integer NOT NULL,
	`availability` text DEFAULT 'incluido' NOT NULL,
	`note` text,
	FOREIGN KEY (`model_id`) REFERENCES `platform_models`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`plan_id`) REFERENCES `platform_plans`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `platform_model_plans_pair_idx` ON `platform_model_plans` (`model_id`,`plan_id`);--> statement-breakpoint
CREATE INDEX `platform_model_plans_model_idx` ON `platform_model_plans` (`model_id`);--> statement-breakpoint
CREATE INDEX `platform_model_plans_plan_idx` ON `platform_model_plans` (`plan_id`);--> statement-breakpoint
CREATE TABLE `platform_models` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`platform_id` text NOT NULL,
	`key` text NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`sort_order` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`platform_id`) REFERENCES `platforms`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `platform_models_key_idx` ON `platform_models` (`platform_id`,`key`);--> statement-breakpoint
CREATE INDEX `platform_models_platform_idx` ON `platform_models` (`platform_id`);--> statement-breakpoint
CREATE TABLE `platform_plans` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`platform_id` text NOT NULL,
	`key` text NOT NULL,
	`name` text NOT NULL,
	`price` text NOT NULL,
	`audience` text DEFAULT 'Personal' NOT NULL,
	`summary` text,
	`note` text,
	`tier` integer DEFAULT 0 NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`platform_id`) REFERENCES `platforms`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `platform_plans_key_idx` ON `platform_plans` (`platform_id`,`key`);--> statement-breakpoint
CREATE INDEX `platform_plans_platform_idx` ON `platform_plans` (`platform_id`);--> statement-breakpoint
ALTER TABLE `platforms` ADD `plans_note` text;
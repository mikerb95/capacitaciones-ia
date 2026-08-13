CREATE TABLE `module_mistakes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`module_id` integer NOT NULL,
	`bad` text NOT NULL,
	`good` text NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`module_id`) REFERENCES `modules`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `module_mistakes_module_idx` ON `module_mistakes` (`module_id`);--> statement-breakpoint
CREATE TABLE `module_outcomes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`module_id` integer NOT NULL,
	`text` text NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`module_id`) REFERENCES `modules`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `module_outcomes_module_idx` ON `module_outcomes` (`module_id`);--> statement-breakpoint
CREATE TABLE `module_prompts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`module_id` integer NOT NULL,
	`tag` text NOT NULL,
	`text` text NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`module_id`) REFERENCES `modules`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `module_prompts_module_idx` ON `module_prompts` (`module_id`);--> statement-breakpoint
CREATE TABLE `module_roles` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`module_id` integer NOT NULL,
	`role` text NOT NULL,
	`task` text NOT NULL,
	`detail` text NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`module_id`) REFERENCES `modules`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `module_roles_module_idx` ON `module_roles` (`module_id`);--> statement-breakpoint
CREATE TABLE `module_steps` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`module_id` integer NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`module_id`) REFERENCES `modules`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `module_steps_module_idx` ON `module_steps` (`module_id`);--> statement-breakpoint
CREATE TABLE `modules` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`platform_id` text NOT NULL,
	`slug` text NOT NULL,
	`name` text NOT NULL,
	`short_name` text NOT NULL,
	`abbr` text NOT NULL,
	`color` text NOT NULL,
	`level` text NOT NULL,
	`category` text,
	`summary` text NOT NULL,
	`intro` text,
	`meta` text,
	`ba_intro` text,
	`before` text,
	`before_time` text,
	`after` text,
	`after_time` text,
	`mock_title` text,
	`mock_prompt` text,
	`mock_reply` text,
	`mock_panel_title` text,
	`mock_panel` text,
	`status` text DEFAULT 'publicado' NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`platform_id`) REFERENCES `platforms`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `modules_platform_slug_idx` ON `modules` (`platform_id`,`slug`);--> statement-breakpoint
CREATE INDEX `modules_platform_idx` ON `modules` (`platform_id`);--> statement-breakpoint
CREATE TABLE `platform_downloads` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`platform_id` text NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`meta` text,
	`href` text,
	`sort_order` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`platform_id`) REFERENCES `platforms`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `platform_downloads_platform_idx` ON `platform_downloads` (`platform_id`);--> statement-breakpoint
CREATE TABLE `platform_faqs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`platform_id` text NOT NULL,
	`question` text NOT NULL,
	`answer` text NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`platform_id`) REFERENCES `platforms`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `platform_faqs_platform_idx` ON `platform_faqs` (`platform_id`);--> statement-breakpoint
CREATE TABLE `platform_links` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`platform_id` text NOT NULL,
	`label` text NOT NULL,
	`href` text NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`platform_id`) REFERENCES `platforms`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `platform_links_platform_idx` ON `platform_links` (`platform_id`);--> statement-breakpoint
CREATE TABLE `platform_practices` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`platform_id` text NOT NULL,
	`number` text NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`platform_id`) REFERENCES `platforms`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `platform_practices_platform_idx` ON `platform_practices` (`platform_id`);--> statement-breakpoint
CREATE TABLE `platform_specials` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`platform_id` text NOT NULL,
	`kicker` text NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`example` text,
	`sort_order` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`platform_id`) REFERENCES `platforms`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `platform_specials_platform_idx` ON `platform_specials` (`platform_id`);--> statement-breakpoint
CREATE TABLE `platform_stats` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`platform_id` text NOT NULL,
	`value` text NOT NULL,
	`label` text NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`platform_id`) REFERENCES `platforms`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `platform_stats_platform_idx` ON `platform_stats` (`platform_id`);--> statement-breakpoint
CREATE TABLE `platforms` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`portal_name` text NOT NULL,
	`initial` text NOT NULL,
	`color` text NOT NULL,
	`tagline` text,
	`input_hint` text,
	`badge` text,
	`hero_title` text,
	`hero_text` text,
	`special_title` text,
	`special_intro` text,
	`help_title` text,
	`help_text` text,
	`description` text,
	`status` text DEFAULT 'borrador' NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);

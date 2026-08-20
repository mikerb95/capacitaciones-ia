CREATE TABLE `questions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`access_code_id` integer NOT NULL,
	`participant_id` integer,
	`name` text,
	`anonymous` integer DEFAULT false NOT NULL,
	`body` text NOT NULL,
	`status` text DEFAULT 'abierta' NOT NULL,
	`answer` text,
	`answered_at` integer,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`access_code_id`) REFERENCES `access_codes`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`participant_id`) REFERENCES `participants`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `questions_code_idx` ON `questions` (`access_code_id`);--> statement-breakpoint
CREATE INDEX `questions_participant_idx` ON `questions` (`participant_id`);
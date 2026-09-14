CREATE TABLE `course_progress` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`participant_id` integer NOT NULL,
	`course_id` text NOT NULL,
	`lesson_slug` text NOT NULL,
	`completed` integer DEFAULT false NOT NULL,
	`score` integer,
	`attempts` integer DEFAULT 0 NOT NULL,
	`result` text,
	`completed_at` integer,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`participant_id`) REFERENCES `participants`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `course_progress_lesson_idx` ON `course_progress` (`participant_id`,`course_id`,`lesson_slug`);--> statement-breakpoint
CREATE INDEX `course_progress_participant_idx` ON `course_progress` (`participant_id`,`course_id`);
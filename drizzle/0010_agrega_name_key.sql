DROP INDEX `attendees_session_participant_idx`;--> statement-breakpoint
ALTER TABLE `attendees` ADD `name_key` text DEFAULT '' NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `attendees_session_name_idx` ON `attendees` (`session_id`,`name_key`);--> statement-breakpoint
DROP INDEX `participants_code_phone_idx`;--> statement-breakpoint
ALTER TABLE `participants` ADD `name_key` text DEFAULT '' NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `participants_code_name_idx` ON `participants` (`access_code_id`,`name_key`);
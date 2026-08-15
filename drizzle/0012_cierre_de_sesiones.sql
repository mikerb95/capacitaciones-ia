DROP INDEX `live_sessions_pin_idx`;--> statement-breakpoint
ALTER TABLE `live_sessions` ADD `ended_at` integer;--> statement-breakpoint
CREATE INDEX `live_sessions_deck_idx` ON `live_sessions` (`deck_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `live_sessions_pin_idx` ON `live_sessions` (`pin`) WHERE "live_sessions"."ended_at" is null;
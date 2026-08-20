DROP INDEX "access_code_modules_pair_idx";--> statement-breakpoint
DROP INDEX "access_code_modules_code_idx";--> statement-breakpoint
DROP INDEX "access_code_plans_pair_idx";--> statement-breakpoint
DROP INDEX "access_code_plans_code_idx";--> statement-breakpoint
DROP INDEX "access_codes_code_idx";--> statement-breakpoint
DROP INDEX "attendees_session_idx";--> statement-breakpoint
DROP INDEX "attendees_session_name_idx";--> statement-breakpoint
DROP INDEX "companies_panel_key_idx";--> statement-breakpoint
DROP INDEX "company_contacts_company_idx";--> statement-breakpoint
DROP INDEX "deck_slides_deck_idx";--> statement-breakpoint
DROP INDEX "decks_slug_idx";--> statement-breakpoint
DROP INDEX "live_sessions_pin_idx";--> statement-breakpoint
DROP INDEX "live_sessions_deck_idx";--> statement-breakpoint
DROP INDEX "module_mistakes_module_idx";--> statement-breakpoint
DROP INDEX "module_outcomes_module_idx";--> statement-breakpoint
DROP INDEX "module_plans_pair_idx";--> statement-breakpoint
DROP INDEX "module_plans_module_idx";--> statement-breakpoint
DROP INDEX "module_plans_plan_idx";--> statement-breakpoint
DROP INDEX "module_prompts_module_idx";--> statement-breakpoint
DROP INDEX "module_roles_module_idx";--> statement-breakpoint
DROP INDEX "module_steps_module_idx";--> statement-breakpoint
DROP INDEX "module_views_pair_idx";--> statement-breakpoint
DROP INDEX "module_views_participant_idx";--> statement-breakpoint
DROP INDEX "module_views_module_idx";--> statement-breakpoint
DROP INDEX "modules_platform_slug_idx";--> statement-breakpoint
DROP INDEX "modules_platform_idx";--> statement-breakpoint
DROP INDEX "participants_token_idx";--> statement-breakpoint
DROP INDEX "participants_code_name_idx";--> statement-breakpoint
DROP INDEX "participants_code_idx";--> statement-breakpoint
DROP INDEX "platform_downloads_platform_idx";--> statement-breakpoint
DROP INDEX "platform_faqs_platform_idx";--> statement-breakpoint
DROP INDEX "platform_links_platform_idx";--> statement-breakpoint
DROP INDEX "platform_model_plans_pair_idx";--> statement-breakpoint
DROP INDEX "platform_model_plans_model_idx";--> statement-breakpoint
DROP INDEX "platform_model_plans_plan_idx";--> statement-breakpoint
DROP INDEX "platform_models_key_idx";--> statement-breakpoint
DROP INDEX "platform_models_platform_idx";--> statement-breakpoint
DROP INDEX "platform_plans_key_idx";--> statement-breakpoint
DROP INDEX "platform_plans_platform_idx";--> statement-breakpoint
DROP INDEX "platform_practices_platform_idx";--> statement-breakpoint
DROP INDEX "platform_specials_platform_idx";--> statement-breakpoint
DROP INDEX "platform_stats_platform_idx";--> statement-breakpoint
DROP INDEX "questions_code_idx";--> statement-breakpoint
DROP INDEX "questions_participant_idx";--> statement-breakpoint
ALTER TABLE `participants` ALTER COLUMN "name" TO "name" text;--> statement-breakpoint
CREATE UNIQUE INDEX `access_code_modules_pair_idx` ON `access_code_modules` (`access_code_id`,`module_id`);--> statement-breakpoint
CREATE INDEX `access_code_modules_code_idx` ON `access_code_modules` (`access_code_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `access_code_plans_pair_idx` ON `access_code_plans` (`access_code_id`,`platform_id`);--> statement-breakpoint
CREATE INDEX `access_code_plans_code_idx` ON `access_code_plans` (`access_code_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `access_codes_code_idx` ON `access_codes` (`code`);--> statement-breakpoint
CREATE INDEX `attendees_session_idx` ON `attendees` (`session_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `attendees_session_name_idx` ON `attendees` (`session_id`,`name_key`);--> statement-breakpoint
CREATE UNIQUE INDEX `companies_panel_key_idx` ON `companies` (`panel_key`);--> statement-breakpoint
CREATE INDEX `company_contacts_company_idx` ON `company_contacts` (`company_id`);--> statement-breakpoint
CREATE INDEX `deck_slides_deck_idx` ON `deck_slides` (`deck_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `decks_slug_idx` ON `decks` (`slug`);--> statement-breakpoint
CREATE UNIQUE INDEX `live_sessions_pin_idx` ON `live_sessions` (`pin`) WHERE "live_sessions"."ended_at" is null;--> statement-breakpoint
CREATE INDEX `live_sessions_deck_idx` ON `live_sessions` (`deck_id`);--> statement-breakpoint
CREATE INDEX `module_mistakes_module_idx` ON `module_mistakes` (`module_id`);--> statement-breakpoint
CREATE INDEX `module_outcomes_module_idx` ON `module_outcomes` (`module_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `module_plans_pair_idx` ON `module_plans` (`module_id`,`plan_id`);--> statement-breakpoint
CREATE INDEX `module_plans_module_idx` ON `module_plans` (`module_id`);--> statement-breakpoint
CREATE INDEX `module_plans_plan_idx` ON `module_plans` (`plan_id`);--> statement-breakpoint
CREATE INDEX `module_prompts_module_idx` ON `module_prompts` (`module_id`);--> statement-breakpoint
CREATE INDEX `module_roles_module_idx` ON `module_roles` (`module_id`);--> statement-breakpoint
CREATE INDEX `module_steps_module_idx` ON `module_steps` (`module_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `module_views_pair_idx` ON `module_views` (`participant_id`,`module_id`);--> statement-breakpoint
CREATE INDEX `module_views_participant_idx` ON `module_views` (`participant_id`);--> statement-breakpoint
CREATE INDEX `module_views_module_idx` ON `module_views` (`module_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `modules_platform_slug_idx` ON `modules` (`platform_id`,`slug`);--> statement-breakpoint
CREATE INDEX `modules_platform_idx` ON `modules` (`platform_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `participants_token_idx` ON `participants` (`token`);--> statement-breakpoint
CREATE UNIQUE INDEX `participants_code_name_idx` ON `participants` (`access_code_id`,`name_key`);--> statement-breakpoint
CREATE INDEX `participants_code_idx` ON `participants` (`access_code_id`);--> statement-breakpoint
CREATE INDEX `platform_downloads_platform_idx` ON `platform_downloads` (`platform_id`);--> statement-breakpoint
CREATE INDEX `platform_faqs_platform_idx` ON `platform_faqs` (`platform_id`);--> statement-breakpoint
CREATE INDEX `platform_links_platform_idx` ON `platform_links` (`platform_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `platform_model_plans_pair_idx` ON `platform_model_plans` (`model_id`,`plan_id`);--> statement-breakpoint
CREATE INDEX `platform_model_plans_model_idx` ON `platform_model_plans` (`model_id`);--> statement-breakpoint
CREATE INDEX `platform_model_plans_plan_idx` ON `platform_model_plans` (`plan_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `platform_models_key_idx` ON `platform_models` (`platform_id`,`key`);--> statement-breakpoint
CREATE INDEX `platform_models_platform_idx` ON `platform_models` (`platform_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `platform_plans_key_idx` ON `platform_plans` (`platform_id`,`key`);--> statement-breakpoint
CREATE INDEX `platform_plans_platform_idx` ON `platform_plans` (`platform_id`);--> statement-breakpoint
CREATE INDEX `platform_practices_platform_idx` ON `platform_practices` (`platform_id`);--> statement-breakpoint
CREATE INDEX `platform_specials_platform_idx` ON `platform_specials` (`platform_id`);--> statement-breakpoint
CREATE INDEX `platform_stats_platform_idx` ON `platform_stats` (`platform_id`);--> statement-breakpoint
CREATE INDEX `questions_code_idx` ON `questions` (`access_code_id`);--> statement-breakpoint
CREATE INDEX `questions_participant_idx` ON `questions` (`participant_id`);
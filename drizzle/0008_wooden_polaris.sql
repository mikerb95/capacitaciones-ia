CREATE TABLE `companies` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`industry` text,
	`panel_key` text NOT NULL,
	`panel_active` integer DEFAULT true NOT NULL,
	`contract_ref` text,
	`contract_start` integer,
	`contract_end` integer,
	`contract_sessions` integer,
	`contract_notes` text,
	`notes` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `companies_panel_key_idx` ON `companies` (`panel_key`);--> statement-breakpoint
CREATE TABLE `company_contacts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`company_id` integer NOT NULL,
	`name` text NOT NULL,
	`role` text,
	`email` text,
	`phone` text,
	`sort_order` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `company_contacts_company_idx` ON `company_contacts` (`company_id`);--> statement-breakpoint
CREATE TABLE `module_views` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`participant_id` integer NOT NULL,
	`module_id` integer NOT NULL,
	`views` integer DEFAULT 1 NOT NULL,
	`first_seen_at` integer DEFAULT (unixepoch()) NOT NULL,
	`last_seen_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`participant_id`) REFERENCES `participants`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`module_id`) REFERENCES `modules`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `module_views_pair_idx` ON `module_views` (`participant_id`,`module_id`);--> statement-breakpoint
CREATE INDEX `module_views_participant_idx` ON `module_views` (`participant_id`);--> statement-breakpoint
CREATE INDEX `module_views_module_idx` ON `module_views` (`module_id`);--> statement-breakpoint
ALTER TABLE `access_codes` ADD `contracted` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `access_codes` ADD `company_id` integer REFERENCES companies(id);--> statement-breakpoint
--- Traspaso del perfil que vivía dentro del código: cada empresa nombrada pasa
--- a ser un registro propio, con su clave de panel y su contacto.
INSERT INTO `companies` (`name`, `industry`, `panel_key`)
SELECT
  TRIM(`company`),
  MIN(`industry`),
  UPPER(SUBSTR(HEX(RANDOMBLOB(4)), 1, 5)) || '-' || UPPER(SUBSTR(HEX(RANDOMBLOB(4)), 1, 5))
FROM `access_codes`
WHERE `company` IS NOT NULL AND TRIM(`company`) <> ''
GROUP BY TRIM(`company`);--> statement-breakpoint
INSERT INTO `company_contacts` (`company_id`, `name`, `email`)
SELECT
  co.`id`,
  COALESCE(MIN(ac.`contact_name`), 'Contacto'),
  MIN(ac.`contact_email`)
FROM `access_codes` ac
JOIN `companies` co ON co.`name` = TRIM(ac.`company`)
WHERE ac.`company` IS NOT NULL
  AND TRIM(ac.`company`) <> ''
  AND (ac.`contact_name` IS NOT NULL OR ac.`contact_email` IS NOT NULL)
GROUP BY co.`id`;--> statement-breakpoint
--- `contracted` queda en 0 a propósito: el dato viejo no sabe si la
--- capacitación se dictó bajo contrato, y eso decide qué ve la empresa.
UPDATE `access_codes`
SET `company_id` = (SELECT `id` FROM `companies` WHERE `name` = TRIM(`access_codes`.`company`))
WHERE `company` IS NOT NULL AND TRIM(`company`) <> '';